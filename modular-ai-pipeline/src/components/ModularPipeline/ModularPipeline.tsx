"use client";



import React, { useState } from 'react';
import { 
  Play, FilePlus, Layers, Settings, Check, Code, Save, 
  PlusCircle, X, ChevronRight, Download, Upload, ArrowRight,
  Search, Plus, LayoutGrid, Menu, Zap, Trash2, Edit,
  ChevronDown, ChevronUp, Folder, FileText, Mic, Scissors,
  Brain, Tag, User, Filter, Mail, Database, Bell, Globe
} from 'lucide-react';

const ModularPipeline = () => {
  const [activeTab, setActiveTab] = useState('builder');
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [workflowName, setWorkflowName] = useState('New Workflow');
  const [activeModules, setActiveModules] = useState([]);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [currentModuleConfig, setCurrentModuleConfig] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(null);

  // Predefined templates
  const workflowTemplates = [
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

  // Enhanced available modules with categories and icons
  const availableModules = [
    { 
      type: 'File Ingestor', 
      description: 'Handles user uploads (PDF, DOCX, audio, CSV)',
      category: 'Input',
      icon: 'folder'
    },
    { 
      type: 'OCR / PDF Extractor', 
      description: 'Converts file to text, handles formatting',
      category: 'Input',
      icon: 'file-text'
    },
    { 
      type: 'Transcriber', 
      description: 'Converts audio to text',
      category: 'Input',
      icon: 'mic'
    },
    { 
      type: 'Text Segmenter', 
      description: 'Breaks text into chunks for analysis',
      category: 'Processing',
      icon: 'scissors'
    },
    { 
      type: 'LLM Analyzer', 
      description: 'GPT prompt runner, uses template + few-shot examples',
      category: 'AI',
      icon: 'brain'
    },
    { 
      type: 'Topic Extractor', 
      description: 'Extracts topics/keywords/intents',
      category: 'AI',
      icon: 'tag'
    },
    { 
      type: 'NER / Skill Extractor', 
      description: 'Extracts named entities, skills, metrics',
      category: 'AI',
      icon: 'user'
    },
    { 
      type: 'Vector Matcher', 
      description: 'Compares text chunks to database (e.g. jobs)',
      category: 'Data',
      icon: 'filter'
    },
    { 
      type: 'Summarizer', 
      description: 'Converts long content into clean summaries',
      category: 'Output',
      icon: 'file-text'
    },
    { 
      type: 'Email Generator', 
      description: 'Fills email template using context',
      category: 'Output',
      icon: 'mail'
    },
    { 
      type: 'DB Writer', 
      description: 'Saves results to DB (Notion, Airtable, Supabase)',
      category: 'Output',
      icon: 'database'
    },
    { 
      type: 'Notifier', 
      description: 'Sends messages (Slack, Email, webhook)',
      category: 'Output',
      icon: 'bell'
    },
    { 
      type: 'Web Scraper', 
      description: 'Scrapes content from websites',
      category: 'Input',
      icon: 'globe'
    }
  ];

  const filteredModules = searchTerm 
    ? availableModules.filter(m => 
        m.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.description.toLowerCase().includes(searchTerm.toLowerCase()))
    : availableModules;

  const categories = [...new Set(availableModules.map(m => m.category))];

  const selectWorkflowTemplate = (template) => {
    setSelectedWorkflow(template);
    setWorkflowName(template.name);
    setActiveModules([...template.modules]);
  };

  const addModule = (module) => {
    const position = activeModules.length > 0 
      ? Math.max(...activeModules.map(m => m.position)) + 1 
      : 1;
    
    setActiveModules([
      ...activeModules, 
      { 
        type: module.type, 
        config: {}, 
        position,
        icon: module.icon
      }
    ]);
  };

  const removeModule = (index) => {
    const updatedModules = [...activeModules];
    updatedModules.splice(index, 1);
    
    // Update positions
    updatedModules.forEach((module, idx) => {
      module.position = idx + 1;
    });
    
    setActiveModules(updatedModules);
    
    // If the currently selected module is being removed, deselect it
    if (selectedModuleIndex === index) {
      setSelectedModuleIndex(null);
    }
  };

  const moveModuleUp = (index) => {
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
    
    // Update selected module index if necessary
    if (selectedModuleIndex === index) {
      setSelectedModuleIndex(index - 1);
    } else if (selectedModuleIndex === index - 1) {
      setSelectedModuleIndex(index);
    }
  };

  const moveModuleDown = (index) => {
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
    
    // Update selected module index if necessary
    if (selectedModuleIndex === index) {
      setSelectedModuleIndex(index + 1);
    } else if (selectedModuleIndex === index + 1) {
      setSelectedModuleIndex(index);
    }
  };

  const openModuleConfig = (module, index) => {
    setCurrentModuleConfig({ ...module, index });
    setIsConfigOpen(true);
  };

  const updateModuleConfig = (config) => {
    if (!currentModuleConfig) return;
    
    const updatedModules = [...activeModules];
    updatedModules[currentModuleConfig.index].config = config;
    setActiveModules(updatedModules);
    setIsConfigOpen(false);
  };

  const selectModule = (index) => {
    if (selectedModuleIndex === index) {
      setSelectedModuleIndex(null);
    } else {
      setSelectedModuleIndex(index);
      const module = activeModules[index];
      setCurrentModuleConfig({ ...module, index });
    }
  };

  const handleDragStart = (e, module) => {
    e.dataTransfer.setData('module', JSON.stringify(module));
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const moduleData = e.dataTransfer.getData('module');
      if (moduleData) {
        const module = JSON.parse(moduleData);
        addModule(module);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const getModuleIcon = (iconName) => {
    switch (iconName) {
      case 'folder': return <Folder size={16} />;
      case 'file-text': return <FileText size={16} />;
      case 'mic': return <Mic size={16} />;
      case 'scissors': return <Scissors size={16} />;
      case 'brain': return <Brain size={16} />;
      case 'tag': return <Tag size={16} />;
      case 'user': return <User size={16} />;
      case 'filter': return <Filter size={16} />;
      case 'mail': return <Mail size={16} />;
      case 'database': return <Database size={16} />;
      case 'bell': return <Bell size={16} />;
      case 'globe': return <Globe size={16} />;
      default: return <Settings size={16} />;
    }
  };

  const getModuleIconColor = (category) => {
    switch (category) {
      case 'Input': return 'bg-blue-100 text-blue-600';
      case 'Processing': return 'bg-yellow-100 text-yellow-600';
      case 'AI': return 'bg-purple-100 text-purple-600';
      case 'Data': return 'bg-green-100 text-green-600';
      case 'Output': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const generateYaml = () => {
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

  const renderModulesByCategory = () => {
    return categories.map(category => (
      <div key={category} className="mb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">{category}</h3>
        <div className="space-y-2">
          {filteredModules
            .filter(module => module.category === category)
            .map((module, index) => (
              <div
                key={`${module.type}-${index}`}
                className="flex items-center p-2 bg-white border border-gray-200 rounded-lg cursor-grab hover:bg-gray-50 hover:border-indigo-300 transition-colors"
                draggable
                onDragStart={(e) => handleDragStart(e, module)}
                onDragEnd={handleDragEnd}
                onClick={() => addModule(module)}
              >
                <div className={`w-8 h-8 flex items-center justify-center ${getModuleIconColor(module.category)} rounded-lg`}>
                  {getModuleIcon(module.icon)}
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-800">{module.type}</h4>
                  <p className="text-xs text-gray-500 line-clamp-1">{module.description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    ));
  };

  const renderTemplatesGrid = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflowTemplates.map((template) => (
          <div 
            key={template.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
            onClick={() => selectWorkflowTemplate(template)}
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">{template.icon}</span>
              <h3 className="text-lg font-medium">{template.name}</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">{template.description}</p>
            <div className="space-y-2 mb-4">
              {template.modules.map((module, idx) => (
                <div key={idx} className="flex items-center text-sm">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs mr-2">{idx + 1}</span>
                  <span>{module.type}</span>
                </div>
              ))}
            </div>
            <button className="w-full py-2 text-center bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors text-sm font-medium">
              Use This Template
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderYamlConfig = () => {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-medium">YAML Configuration</h2>
          <button className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">
            <Download size={14} className="mr-1" />
            Download
          </button>
        </div>
        <div className="p-4 bg-gray-50">
          <pre className="whitespace-pre-wrap text-sm font-mono">{generateYaml()}</pre>
        </div>
      </div>
    );
  };

  // Fixed LLM Analyzer configuration component
  const renderLLMAnalyzerConfig = () => {
    if (!currentModuleConfig) return null;
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Prompt Template</label>
          <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
            <option>Default Analyzer</option>
            <option>Skill Extractor</option>
            <option>Action Item Generator</option>
            <option>Financial Metrics</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
            <option>GPT-4</option>
            <option>Claude 3</option>
            <option>Mistral</option>
            <option>Mixtral</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Temperature</label>
          <input 
            type="range" 
            className="w-full" 
            min="0" 
            max="1" 
            step="0.1" 
            defaultValue={currentModuleConfig.config.temperature || 0.7}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Precise</span>
            <span>Creative</span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Custom Prompt</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md text-sm h-24"
            placeholder="Enter your custom prompt instructions..."
            defaultValue={currentModuleConfig.config.customPrompt || ""}
          ></textarea>
        </div>
      </div>
    );
  };

  // Fixed Notifier configuration component
  const renderNotifierConfig = () => {
    if (!currentModuleConfig) return null;
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Notification Channel</label>
          <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
            <option>Slack</option>
            <option>Email</option>
            <option>Webhook</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Destination</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded-md text-sm" 
            placeholder="#channel or email@example.com" 
            defaultValue={currentModuleConfig.config.destination || ""}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Message Template</label>
          <textarea 
            className="w-full p-2 border border-gray-300 rounded-md text-sm h-24" 
            placeholder="Enter your notification message template..."
            defaultValue={currentModuleConfig.config.messageTemplate || ""}
          ></textarea>
        </div>
      </div>
    );
  };

  // Fixed File Ingestor configuration component
  const renderFileIngestorConfig = () => {
    if (!currentModuleConfig) return null;
    
    const fileTypes = ['pdf', 'docx', 'csv', 'mp3', 'mp4', 'wav'];
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Accepted File Types</label>
          <div className="grid grid-cols-3 gap-2">
            {fileTypes.map(type => (
              <label key={type} className="flex items-center space-x-2 p-2 border border-gray-200 rounded bg-white">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                  defaultChecked={(currentModuleConfig.config.acceptTypes || []).includes(type)}
                />
                <span className="text-sm">.{type}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Input Field Label</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded-md text-sm" 
            placeholder="Upload your file" 
            defaultValue={currentModuleConfig.config.fieldLabel || ""}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-indigo-600 flex items-center">
            <Zap size={20} className="mr-2" />
            ModularAI
          </h1>
        </div>
        
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search modules..."
              className="w-full pl-9 pr-3 py-2 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:bg-white focus:border-indigo-300 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Available Modules</h2>
          {renderModulesByCategory()}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <button 
              className={`px-3 py-2 text-sm font-medium ${activeTab === 'builder' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-900'}`} 
              onClick={() => setActiveTab('builder')}
            >
              <LayoutGrid size={16} className="inline mr-1" />
              Workflow Builder
            </button>
            <button 
              className={`px-3 py-2 text-sm font-medium ${activeTab === 'templates' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-900'}`} 
              onClick={() => setActiveTab('templates')}
            >
              <Menu size={16} className="inline mr-1" />
              Templates
            </button>
            <button 
              className={`px-3 py-2 text-sm font-medium ${activeTab === 'yaml' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-900'}`} 
              onClick={() => setActiveTab('yaml')}
            >
              <Code size={16} className="inline mr-1" />
              YAML Config
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center">
              <Save size={16} className="mr-1" />
              Save
            </button>
            <button className="px-3 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 flex items-center">
              <Play size={16} className="mr-1" />
              Run
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'builder' && (
            <div className="flex h-full">
              <div className="flex-1 p-6 overflow-auto">
                <div className="mb-4">
                  <input
                    type="text"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    placeholder="Workflow Name"
                    className="w-full max-w-xl px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
                
                <div 
                  className={`bg-white rounded-lg border-2 ${isDragging ? 'border-indigo-400 border-dashed' : 'border-gray-200'} min-h-[500px] transition-colors p-6`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {activeModules.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96 text-center">
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <Plus size={24} className="text-indigo-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">Start Building Your Workflow</h3>
                      <p className="text-sm text-gray-500 max-w-md">Drag modules from the sidebar and drop them here to create your workflow pipeline.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeModules
                        .sort((a, b) => a.position - b.position)
                        .map((module, index) => (
                            <div key={index} className="relative">
                            <div 
                                className={`flex items-center ${selectedModuleIndex === index ? 'ring-2 ring-indigo-500' : ''}`}
                                onClick={() => selectModule(index)}
                            >
                                <div className={`p-4 bg-white rounded-lg border ${selectedModuleIndex === index ? 'border-indigo-300' : 'border-gray-200'} shadow-sm flex items-center w-full`}>
                                <div className={`w-10 h-10 flex items-center justify-center ${module.icon ? getModuleIconColor(availableModules.find(m => m.type === module.type)?.category || 'default') : 'bg-gray-100 text-gray-600'} rounded-lg mr-3`}>
                                    {module.icon ? getModuleIcon(module.icon) : <Settings size={16} />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-gray-800">{module.type}</h4>
                                    <p className="text-xs text-gray-500">
                                    {Object.keys(module.config).length > 0 
                                        ? `${Object.keys(module.config).length} configurations set` 
                                        : 'No configuration set'}
                                    </p>
                                </div>
                                <div className="flex space-x-1">
                                    <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        moveModuleUp(index);
                                    }}
                                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                    disabled={index === 0}
                                    >
                                    <ChevronUp size={16} />
                                    </button>
                                    <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        moveModuleDown(index);
                                    }}
                                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                    disabled={index === activeModules.length - 1}
                                    >
                                    <ChevronDown size={16} />
                                    </button>
                                    <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openModuleConfig(module, index);
                                    }}
                                    className="p-1 text-gray-400 hover:text-indigo-600"
                                    >
                                    <Settings size={16} />
                                    </button>
                                    <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeModule(index);
                                    }}
                                    className="p-1 text-gray-400 hover:text-red-600"
                                    >
                                    <Trash2 size={16} />
                                    </button>
                                </div>
                                </div>
                            </div>

                            {index < activeModules.length - 1 && (
                                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 mb-1 text-gray-300">
                                <ArrowRight size={20} />
                                </div>
                            )}
                            </div>
                        ))}

                    </div>
                  )}
                </div>
              </div>
              
              {/* Properties Panel */}
              {selectedModuleIndex !== null && currentModuleConfig && (
                <div className="w-72 bg-white border-l border-gray-200 overflow-auto">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-sm font-medium text-gray-700">Configure {currentModuleConfig.type}</h2>
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => setSelectedModuleIndex(null)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    {/* Dynamic configuration form based on module type */}
                    {currentModuleConfig.type === 'File Ingestor' && renderFileIngestorConfig()}
                    {currentModuleConfig.type === 'LLM Analyzer' && renderLLMAnalyzerConfig()}
                    {currentModuleConfig.type === 'Notifier' && renderNotifierConfig()}
                    
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <button 
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 text-sm font-medium"
                        onClick={() => updateModuleConfig(currentModuleConfig.config)}
                      >
                        Save Configuration
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'templates' && (
            <div className="p-6 overflow-auto">
              {renderTemplatesGrid()}
            </div>
          )}
          
          {activeTab === 'yaml' && (
            <div className="p-6 overflow-auto">
              {renderYamlConfig()}
            </div>
          )}
        </div>
      </div>
      
      {/* Configuration Modal */}
      {isConfigOpen && currentModuleConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium">Configure {currentModuleConfig.type}</h2>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setIsConfigOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              {currentModuleConfig.type === 'File Ingestor' && renderFileIngestorConfig()}
              {currentModuleConfig.type === 'LLM Analyzer' && renderLLMAnalyzerConfig()}
              {currentModuleConfig.type === 'Notifier' && renderNotifierConfig()}
              
              {/* Default configuration for other module types */}
              {!['File Ingestor', 'LLM Analyzer', 'Notifier'].includes(currentModuleConfig.type) && (
                <div className="py-8 text-center text-gray-500">
                  <Settings size={24} className="mx-auto mb-2" />
                  <p>Configure {currentModuleConfig.type} settings here.</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-2">
              <button 
                className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsConfigOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700"
                onClick={() => updateModuleConfig(currentModuleConfig.config)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModularPipeline;