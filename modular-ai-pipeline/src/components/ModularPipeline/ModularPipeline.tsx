"use client";

import React, { useState, useEffect } from 'react';
import { Play, FilePlus, Layers, Settings, Check, Code, Save, PlusCircle, X, ChevronRight, Download, Upload, ArrowRight } from 'lucide-react';
import './ModularPipeline.css';

// Define TypeScript interfaces
interface ModuleConfig {
  [key: string]: any;
}

interface WorkflowModule {
  type: string;
  config: ModuleConfig;
  position: number;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  modules: WorkflowModule[];
}

interface AvailableModule {
  type: string;
  description: string;
}

// Mock API for illustration - replace with your actual API
const ModulesAPI = {
  getAllModules: async () => {
    return { data: [] };
  },
  getAllTemplates: async () => {
    return { data: [] };
  }
};

const ModularPipeline = () => {
  const [activeTab, setActiveTab] = useState<string>('builder');
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplate | null>(null);
  const [workflowName, setWorkflowName] = useState<string>('');
  const [activeModules, setActiveModules] = useState<WorkflowModule[]>([]);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [currentModuleConfig, setCurrentModuleConfig] = useState<(WorkflowModule & { index: number }) | null>(null);

  useEffect(() => {
    // Fetch available modules
    const fetchModules = async () => {
      try {
        const response = await ModulesAPI.getAllModules();
        // Update state with the fetched modules
        // setAvailableModules(response.data);
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    };
    
    // Fetch workflow templates
    const fetchTemplates = async () => {
      try {
        const response = await ModulesAPI.getAllTemplates();
        // Update state with the fetched templates
        // setWorkflowTemplates(response.data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };
    
    fetchModules();
    fetchTemplates();
  }, []);
  
  // Predefined templates based on your document
  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: 'resume-screener',
      name: 'Smart Resume Screener',
      description: 'Extract skills from resumes and match with job listings',
      icon: '📦',
      modules: [
        {
          type: 'File Ingestor',
          config: { acceptTypes: ['pdf', 'docx'] },
          position: 1
        },
        {
          type: 'NER / Skill Extractor',
          config: { extractFields: ['skills', 'experience', 'education'] },
          position: 2
        },
        {
          type: 'Vector Matcher',
          config: { matchThreshold: 0.75, maxResults: 5 },
          position: 3
        },
        {
          type: 'LLM Analyzer',
          config: { promptTemplate: 'rank_jobs' },
          position: 4
        },
        {
          type: 'Email Generator',
          config: { template: 'job_match_email' },
          position: 5
        }
      ]
    },
    {
      id: 'meeting-recorder',
      name: 'Smart Meeting Recorder',
      description: 'Transcribe meetings and extract action items',
      icon: '🎙️',
      modules: [
        {
          type: 'File Ingestor',
          config: { acceptTypes: ['mp3', 'wav', 'mp4'] },
          position: 1
        },
        {
          type: 'Transcriber',
          config: { model: 'whisper-large' },
          position: 2
        },
        {
          type: 'Topic Extractor',
          config: { minTopics: 3, maxTopics: 8 },
          position: 3
        },
        {
          type: 'LLM Analyzer',
          config: { promptTemplate: 'action_items' },
          position: 4
        },
        {
          type: 'Notifier',
          config: { channel: 'slack', destination: '#team-updates' },
          position: 5
        }
      ]
    },
    {
      id: 'financial-insight',
      name: 'Financial Data Insights',
      description: 'Extract and analyze data from financial reports',
      icon: '📊',
      modules: [
        {
          type: 'File Ingestor',
          config: { acceptTypes: ['pdf'] },
          position: 1
        },
        {
          type: 'OCR / PDF Extractor',
          config: { extractTables: true, preserveLayout: true },
          position: 2
        },
        {
          type: 'LLM Analyzer',
          config: { 
            promptTemplate: 'financial_metrics',
            outputSchema: {
              revenue: 'number',
              netIncome: 'number',
              growth: 'number'
            }
          },
          position: 3
        },
        {
          type: 'Summarizer',
          config: { maxLength: 500, focus: 'key_metrics' },
          position: 4
        },
        {
          type: 'DB Writer',
          config: { destination: 'notion', template: 'financial_report' },
          position: 5
        }
      ]
    },
    {
      id: 'market-monitor',
      name: 'Market Monitor',
      description: 'Track market trends from multiple sources',
      icon: '🌐',
      modules: [
        {
          type: 'Web Scraper',
          config: { urls: ['example.com/news', 'example.com/finance'], frequency: 'daily' },
          position: 1
        },
        {
          type: 'LLM Analyzer',
          config: { promptTemplate: 'relevance_filter', filterTheme: 'tariffs' },
          position: 2
        },
        {
          type: 'Summarizer',
          config: { maxArticles: 5, summaryLength: 'medium' },
          position: 3
        },
        {
          type: 'Notifier',
          config: { channel: 'email', recipients: ['team@example.com'] },
          position: 4
        }
      ]
    }
  ];

  // All available modules from your document
  const availableModules: AvailableModule[] = [
    { type: 'File Ingestor', description: 'Handles user uploads (PDF, DOCX, audio, CSV)' },
    { type: 'OCR / PDF Extractor', description: 'Converts file to text, handles formatting' },
    { type: 'Transcriber', description: 'Converts audio to text' },
    { type: 'Text Segmenter', description: 'Breaks text into chunks for analysis' },
    { type: 'LLM Analyzer', description: 'GPT prompt runner, uses template + few-shot examples' },
    { type: 'Topic Extractor', description: 'Extracts topics/keywords/intents' },
    { type: 'NER / Skill Extractor', description: 'Extracts named entities, skills, metrics' },
    { type: 'Vector Matcher', description: 'Compares text chunks to database (e.g. jobs)' },
    { type: 'Summarizer', description: 'Converts long content into clean summaries' },
    { type: 'Email Generator', description: 'Fills email template using context' },
    { type: 'DB Writer', description: 'Saves results to DB (Notion, Airtable, Supabase)' },
    { type: 'Notifier', description: 'Sends messages (Slack, Email, webhook)' },
    { type: 'Web Scraper', description: 'Scrapes content from websites' }
  ];

  const selectWorkflowTemplate = (template: WorkflowTemplate) => {
    setSelectedWorkflow(template);
    setWorkflowName(template.name);
    setActiveModules([...template.modules]);
  };

  const addModule = (module: AvailableModule) => {
    const position = activeModules.length > 0 
      ? Math.max(...activeModules.map(m => m.position)) + 1 
      : 1;
    
    setActiveModules([
      ...activeModules, 
      { 
        type: module.type, 
        config: {}, 
        position 
      }
    ]);
  };

  const removeModule = (index: number) => {
    const updatedModules = [...activeModules];
    updatedModules.splice(index, 1);
    setActiveModules(updatedModules);
  };

  const moveModuleUp = (index: number) => {
    if (index === 0) return;
    const updatedModules = [...activeModules];
    const temp = updatedModules[index];
    updatedModules[index] = updatedModules[index - 1];
    updatedModules[index - 1] = temp;
    
    // Update positions
    updatedModules.forEach((module, idx) => {
      module.position = idx + 1;
    });
    
    setActiveModules(updatedModules);
  };

  const moveModuleDown = (index: number) => {
    if (index === activeModules.length - 1) return;
    const updatedModules = [...activeModules];
    const temp = updatedModules[index];
    updatedModules[index] = updatedModules[index + 1];
    updatedModules[index + 1] = temp;
    
    // Update positions
    updatedModules.forEach((module, idx) => {
      module.position = idx + 1;
    });
    
    setActiveModules(updatedModules);
  };

  const openModuleConfig = (module: WorkflowModule, index: number) => {
    setCurrentModuleConfig({ ...module, index });
    setIsConfigOpen(true);
  };

  const updateModuleConfig = (config: ModuleConfig) => {
    if (!currentModuleConfig) return;
    
    const updatedModules = [...activeModules];
    updatedModules[currentModuleConfig.index].config = config;
    setActiveModules(updatedModules);
    setIsConfigOpen(false);
  };

  const generateYaml = (): string => {
    // Simplified YAML generation
    return `name: ${workflowName}
description: Custom workflow
version: 1.0.0
steps:
${activeModules.map(module => `  - type: ${module.type.toLowerCase().replace(/\s+/g, '_')}
    position: ${module.position}
    config:
${Object.entries(module.config).map(([key, value]) => `      ${key}: ${JSON.stringify(value)}`).join('\n')}`).join('\n')}
`;
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-container">
          <div className="logo-container">
            <Layers className="logo-icon" />
            <h1 className="app-title">ModularAI Pipeline Builder</h1>
          </div>
          <div className="header-actions">
            <button className="btn btn-save">
              <Save className="btn-icon" />
              Save
            </button>
            <button className="btn btn-run">
              <Play className="btn-icon" />
              Run
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="app-nav">
        <div className="nav-container">
          <nav className="tab-nav">
            <button 
              onClick={() => setActiveTab('builder')}
              className={`tab-btn ${activeTab === 'builder' ? 'tab-active' : ''}`}
            >
              Workflow Builder
            </button>
            <button 
              onClick={() => setActiveTab('templates')}
              className={`tab-btn ${activeTab === 'templates' ? 'tab-active' : ''}`}
            >
              Templates
            </button>
            <button 
              onClick={() => setActiveTab('yaml')}
              className={`tab-btn ${activeTab === 'yaml' ? 'tab-active' : ''}`}
            >
              YAML Config
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === 'builder' && (
          <div className="builder-layout">
            {/* Module sidebar */}
            <div className="module-sidebar">
              <div className="sidebar-header">
                <h2 className="sidebar-title">Available Modules</h2>
                <p className="sidebar-subtitle">Drag and drop or click to add</p>
              </div>
              <div className="module-list">
                {availableModules.map((module, index) => (
                  <div 
                    key={index}
                    className="module-item"
                    onClick={() => addModule(module)}
                  >
                    <div className="module-name">{module.type}</div>
                    <div className="module-desc">{module.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow builder */}
            <div className="workflow-builder">
              <div className="workflow-header">
                <input
                  type="text"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  placeholder="Workflow Name"
                  className="workflow-name-input"
                />
              </div>
              
              <div className="workflow-canvas">
                {activeModules.length === 0 ? (
                  <div className="empty-workflow">
                    <PlusCircle className="empty-icon" />
                    <p>Add modules from the sidebar to build your workflow</p>
                  </div>
                ) : (
                  <div className="workflow-modules">
                    {activeModules.sort((a, b) => a.position - b.position).map((module, index) => (
                      <div key={index} className="workflow-module">
                        <div className="module-content">
                          <div className="module-title">{module.type}</div>
                          <div className="module-config-status">
                            {Object.keys(module.config).length > 0 
                              ? `${Object.keys(module.config).length} configurations set` 
                              : 'No configuration set'}
                          </div>
                        </div>
                        <div className="module-actions">
                          <button 
                            onClick={() => moveModuleUp(index)}
                            className="module-btn module-move-up"
                            disabled={index === 0}
                          >
                            ↑
                          </button>
                          <button 
                            onClick={() => moveModuleDown(index)}
                            className="module-btn module-move-down"
                            disabled={index === activeModules.length - 1}
                          >
                            ↓
                          </button>
                          <button 
                            onClick={() => openModuleConfig(module, index)}
                            className="module-btn module-config"
                          >
                            <Settings className="module-btn-icon" />
                          </button>
                          <button 
                            onClick={() => removeModule(index)}
                            className="module-btn module-remove"
                          >
                            <X className="module-btn-icon" />
                          </button>
                        </div>
                        {index < activeModules.length - 1 && (
                          <div className="module-connector">
                            <ArrowRight className="connector-icon" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="templates-grid">
            {workflowTemplates.map((template) => (
              <div 
                key={template.id}
                className="template-card"
                onClick={() => selectWorkflowTemplate(template)}
              >
                <div className="template-header">
                  <span className="template-icon">{template.icon}</span>
                  <h3 className="template-title">{template.name}</h3>
                </div>
                <p className="template-desc">{template.description}</p>
                <div className="template-modules">
                  {template.modules.map((module, index) => (
                    <div key={index} className="template-module">
                      <span className="module-number">{index + 1}</span>
                      <span className="module-type">{module.type}</span>
                    </div>
                  ))}
                </div>
                <div className="template-footer">
                  <button className="template-use-btn">
                    Use this template
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'yaml' && (
          <div className="yaml-container">
            <div className="yaml-header">
              <h2 className="yaml-title">YAML Configuration</h2>
              <button className="yaml-download-btn">
                <Download className="download-icon" />
                Download
              </button>
            </div>
            <div className="yaml-content">
              <pre className="yaml-code">{generateYaml()}</pre>
            </div>
          </div>
        )}
      </div>

      {/* Module Configuration Modal */}
      {isConfigOpen && currentModuleConfig && (
        <div className="modal-overlay">
          <div className="config-modal">
            <div className="modal-header">
              <h3 className="modal-title">Configure {currentModuleConfig.type}</h3>
              <button className="modal-close" onClick={() => setIsConfigOpen(false)}>
                <X className="close-icon" />
              </button>
            </div>
            
            <div className="modal-body">
              {/* Simplified config UI - would be dynamic based on module type */}
              <div className="config-form">
                {currentModuleConfig.type === 'File Ingestor' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Accepted File Types</label>
                      <div className="checkbox-group">
                        {['pdf', 'docx', 'csv', 'mp3', 'mp4', 'wav'].map(type => (
                          <label key={type} className="checkbox-label">
                            <input 
                              type="checkbox" 
                              checked={currentModuleConfig.config.acceptTypes?.includes(type)}
                              className="checkbox-input" 
                            />
                            <span className="checkbox-text">.{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                {currentModuleConfig.type === 'LLM Analyzer' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Prompt Template</label>
                      <select className="form-select">
                        <option>Default Analyzer</option>
                        <option>Skill Extractor</option>
                        <option>Action Item Generator</option>
                        <option>Financial Metrics</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Temperature</label>
                      <input type="range" className="form-range" min="0" max="1" step="0.1" />
                    </div>
                  </>
                )}
                
                {currentModuleConfig.type === 'Notifier' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Notification Type</label>
                      <select className="form-select">
                        <option>Slack</option>
                        <option>Email</option>
                        <option>Webhook</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Destination</label>
                      <input type="text" className="form-input" placeholder="#channel or email@example.com" />
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-cancel"
                onClick={() => setIsConfigOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-save-config"
                onClick={() => updateModuleConfig(currentModuleConfig.config)}
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModularPipeline;