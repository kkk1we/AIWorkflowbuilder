"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  addEdge, 
  useNodesState, 
  useEdgesState,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Play, FilePlus, Layers, Settings, Check, Code, Save, 
  PlusCircle, X, ChevronRight, Download, Upload, ArrowRight,
  Search, Plus, LayoutGrid, Menu, Zap, Trash2, Edit,
  ChevronDown, ChevronUp, Folder, FileText, Mic, Scissors,
  Brain, Tag, User, Filter, Mail, Database, Bell, Globe,
  Clock, Activity, GitBranch, CornerDownRight
} from 'lucide-react';

// --- Render conditional module configuration ---
const renderConditionalConfig = (currentModuleConfig) => {
  if (!currentModuleConfig) return null;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Condition Type</label>
        <select className="w-full p-2 border border-gray-300 rounded-md text-sm" defaultValue="Contains Text">
          <option>Contains Text</option>
          <option>Greater Than</option>
          <option>Less Than</option>
          <option>Equal To</option>
          <option>Custom Expression</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Value to Check</label>
        <input 
          type="text" 
          className="w-full p-2 border border-gray-300 rounded-md text-sm" 
          placeholder="Enter value or variable" 
          defaultValue={currentModuleConfig.config.valueToCheck || ""}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Condition Value</label>
        <input 
          type="text" 
          className="w-full p-2 border border-gray-300 rounded-md text-sm" 
          placeholder="Enter comparison value" 
          defaultValue={currentModuleConfig.config.conditionValue || ""}
        />
      </div>
    </div>
  );
};

// --- Render trigger module configuration ---
const renderTriggerConfig = (currentModuleConfig) => {
  if (!currentModuleConfig) return null;

  if (currentModuleConfig.type === 'Webhook Trigger') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Webhook Path</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded-md text-sm" 
            placeholder="/api/trigger/my-webhook" 
            defaultValue={currentModuleConfig.config.path || ""}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Authentication Type</label>
          <select className="w-full p-2 border border-gray-300 rounded-md text-sm" defaultValue="None">
            <option>None</option>
            <option>API Key</option>
            <option>Bearer Token</option>
          </select>
        </div>
      </div>
    );
  }

  if (currentModuleConfig.type === 'Schedule Trigger') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Schedule Type</label>
          <select className="w-full p-2 border border-gray-300 rounded-md text-sm" defaultValue="Hourly">
            <option>Hourly</option>
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Custom Cron</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Time (24h format)</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded-md text-sm" 
            placeholder="14:00" 
            defaultValue={currentModuleConfig.config.time || ""}
          />
        </div>
      </div>
    );
  }

  // Default catch-all for other triggers
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Trigger Configuration</label>
        <p className="text-sm text-gray-500">Configure your {currentModuleConfig.type} settings here.</p>
      </div>
    </div>
  );
};

// Custom Node Component
const ModuleNode = ({ data, id }) => {
  // Determine node style based on type
  let nodeStyle = "p-4 bg-white rounded-lg border shadow-sm flex items-center w-64";
  
  if (data.selected) {
    nodeStyle += " border-indigo-300";
  } else if (data.isTrigger) {
    nodeStyle += " border-orange-300";
  } else if (data.isConditional) {
    nodeStyle += " border-indigo-300";
  } else {
    nodeStyle += " border-gray-200";
  }
  
  // Add a trigger/condition badge
  const renderBadge = () => {
    if (data.isTrigger) {
      return <div className="absolute -top-2 -left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">Trigger</div>;
    }
    if (data.isConditional && data.label === 'If Condition') {
      return <div className="absolute -top-2 -left-2 bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">Condition</div>;
    }
    if (data.isConditional && data.label === 'Else Path') {
      return <div className="absolute -top-2 -left-2 bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">Else</div>;
    }
    return null;
  };
  
  return (
    <div className="relative">
      {renderBadge()}
      <div className={nodeStyle}>
        <div className={`w-10 h-10 flex items-center justify-center ${data.iconColor} rounded-lg mr-3`}>
          {data.icon}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-800">{data.label}</h4>
          <p className="text-xs text-gray-500">
            {Object.keys(data.config || {}).length > 0 
              ? `${Object.keys(data.config).length} configurations set` 
              : 'No configuration set'}
          </p>
        </div>
        <div className="flex">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              data.onConfig(id);
            }}
            className="p-1 text-gray-400 hover:text-indigo-600"
          >
            <Settings size={16} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete(id);
            }}
            className="p-1 text-gray-400 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {/* Connection button on the right edge */}
      <div className="absolute top-1/2 -right-3 transform -translate-y-1/2">
        <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-600 text-white">
          <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
};

// Custom node types
const nodeTypes = {
  moduleNode: ModuleNode,
};

const ModularPipeline = () => {
  const [activeTab, setActiveTab] = useState('builder');
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [workflowName, setWorkflowName] = useState('New Workflow');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [currentModuleConfig, setCurrentModuleConfig] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  
  // React Flow State
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // Handle connections between nodes
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({
      ...params,
      animated: true,
      style: { stroke: '#6366F1' },
      markerEnd: {
        type: 'arrowclosed',
        width: 20,
        height: 20,
        color: '#6366F1',
      },
    }, eds));
  }, [setEdges]);

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

  // Enhanced modules with categories/icons
  const availableModules = [
    // Trigger modules
    { 
      type: 'Webhook Trigger', 
      description: 'Start workflow when webhook is called',
      category: 'Trigger',
      icon: 'zap',
      isTrigger: true
    },
    { 
      type: 'Schedule Trigger', 
      description: 'Run workflow on a time schedule',
      category: 'Trigger',
      icon: 'clock',
      isTrigger: true
    },
    { 
      type: 'Event Trigger', 
      description: 'Start workflow on specific event',
      category: 'Trigger',
      icon: 'activity',
      isTrigger: true
    },
    
    // Regular modules
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
    },
    
    // Conditional modules
    { 
      type: 'If Condition', 
      description: 'Branch workflow based on condition',
      category: 'Control',
      icon: 'git-branch',
      isConditional: true
    },
    { 
      type: 'Else Path', 
      description: 'Alternative path for failed condition',
      category: 'Control',
      icon: 'corner-down-right',
      isConditional: true
    }
  ];

  const filteredModules = searchTerm 
    ? availableModules.filter(m => 
        m.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.description.toLowerCase().includes(searchTerm.toLowerCase()))
    : availableModules;

  const categories = [...new Set(availableModules.map(m => m.category))];

  // Convert React Flow nodes to active modules
  const getActiveModules = () => {
    return nodes.map(node => ({
      type: node.data.label,
      config: node.data.config || {},
      position: node.data.position,
      icon: node.data.iconName
    }));
  };

  // Select template and create nodes/edges
  const selectWorkflowTemplate = (template) => {
    setSelectedWorkflow(template);
    setWorkflowName(template.name);
    
    const newNodes = [];
    const newEdges = [];
    
    template.modules.forEach((module, index) => {
      const moduleType = availableModules.find(m => m.type === module.type);
      const iconName = moduleType ? moduleType.icon : 'settings';
      const category = moduleType ? moduleType.category : 'default';
      
      newNodes.push({
        id: `${module.type}-${index}`,
        type: 'moduleNode',
        position: { x: 250, y: 100 + index * 150 },
        data: {
          label: module.type,
          config: module.config,
          position: module.position,
          icon: getModuleIcon(iconName),
          iconColor: getModuleIconColor(category),
          iconName: iconName,
          category: category,
          onConfig: openModuleConfig,
          onDelete: removeNode,
          selected: false,
          isTrigger: moduleType?.isTrigger || false,
          isConditional: moduleType?.isConditional || false
        }
      });
      
      if (index > 0) {
        newEdges.push({
          id: `e-${index-1}-${index}`,
          source: `${template.modules[index-1].type}-${index-1}`,
          target: `${module.type}-${index}`,
          animated: true,
          style: { stroke: '#6366F1' },
          markerEnd: {
            type: 'arrowclosed',
            width: 20,
            height: 20,
            color: '#6366F1',
          },
        });
      }
    });
    
    setNodes(newNodes);
    setEdges(newEdges);
    setActiveTab('builder');
  };

  // Add a new node when dragging from the sidebar
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const moduleData = event.dataTransfer.getData('module');
      
      if (!moduleData || !reactFlowInstance) {
        return;
      }
      
      const module = JSON.parse(moduleData);
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      
      const nodeId = `${module.type}-${nodes.length}`;
      const newNode = {
        id: nodeId,
        type: 'moduleNode',
        position,
        data: {
          label: module.type,
          config: {},
          position: nodes.length + 1,
          icon: getModuleIcon(module.icon),
          iconColor: getModuleIconColor(module.category),
          iconName: module.icon,
          category: module.category,
          onConfig: openModuleConfig,
          onDelete: removeNode,
          selected: false,
          isTrigger: module.isTrigger || false,
          isConditional: module.isConditional || false
        },
      };
      
      setNodes((nds) => nds.concat(newNode));
      
      // Simple logic to create edges from existing nodes if close in y-position
      if (nodes.length > 0) {
        const newEdges = [];
        nodes.forEach(existingNode => {
          if (
            Math.abs(existingNode.position.y - position.y) < 100 && 
            existingNode.position.x < position.x
          ) {
            newEdges.push({
              id: `e-${existingNode.id}-${nodeId}`,
              source: existingNode.id,
              target: nodeId,
              animated: true,
              style: { stroke: '#6366F1' }
            });
          }
        });
        
        if (newEdges.length > 0) {
          setEdges((eds) => eds.concat(newEdges));
        }
      }
    },
    [nodes, reactFlowInstance, setNodes, setEdges]
  );

  // Open module config modal
  const openModuleConfig = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setCurrentModuleConfig({
        id: nodeId,
        type: node.data.label,
        config: node.data.config || {},
        icon: node.data.iconName,
        category: node.data.category
      });
      setIsConfigOpen(true);
    }
  };

  // Update module configuration
  const updateModuleConfig = (config) => {
    if (!currentModuleConfig) return;
    
    setNodes(prevNodes => 
      prevNodes.map(node => {
        if (node.id === currentModuleConfig.id) {
          return {
            ...node,
            data: {
              ...node.data,
              config
            }
          };
        }
        return node;
      })
    );
    setIsConfigOpen(false);
  };

  // Remove a node
  const removeNode = (nodeId) => {
    setNodes(nodes.filter(node => node.id !== nodeId));
    setEdges(edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
  };
  
  // Handle keyboard events for node deletion
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selectedNode = nodes.find(node => node.data.selected);
        if (selectedNode) {
          removeNode(selectedNode.id);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nodes]);

  // Node click -> open config
  const onNodeClick = (event, node) => {
    setNodes(prevNodes => 
      prevNodes.map(n => ({
        ...n,
        data: {
          ...n.data,
          selected: n.id === node.id
        }
      }))
    );
    openModuleConfig(node.id);
  };

  // Handle drag start from sidebar
  const handleDragStart = (e, module) => {
    e.dataTransfer.setData('module', JSON.stringify(module));
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Icon helper
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
      case 'zap': return <Zap size={16} />;
      case 'clock': return <Clock size={16} />;
      case 'activity': return <Activity size={16} />;
      case 'git-branch': return <GitBranch size={16} />;
      case 'corner-down-right': return <CornerDownRight size={16} />;
      default: return <Settings size={16} />;
    }
  };

  // Icon color helper
  const getModuleIconColor = (category) => {
    switch (category) {
      case 'Input': return 'bg-blue-100 text-blue-600';
      case 'Processing': return 'bg-yellow-100 text-yellow-600';
      case 'AI': return 'bg-purple-100 text-purple-600';
      case 'Data': return 'bg-green-100 text-green-600';
      case 'Output': return 'bg-red-100 text-red-600';
      case 'Trigger': return 'bg-orange-100 text-orange-600';
      case 'Control': return 'bg-indigo-100 text-indigo-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Generate YAML configuration
  const generateYaml = () => {
    const activeModules = getActiveModules();
    return `name: ${workflowName}
description: Custom workflow
version: 1.0.0
steps:
${activeModules
  .map((module) => `  - type: ${module.type.toLowerCase().replace(/\s+/g, '_')}
    position: ${module.position}
    config:
${Object.entries(module.config)
  .map(([key, value]) => `      ${key}: ${JSON.stringify(value)}`)
  .join('\n')}`)
  .join('\n')}
`;
  };

  // Renders modules by category in sidebar
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

  // Renders templates grid
  const renderTemplatesGrid = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflowTemplates.map((template) => (
          <div 
            key={template.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">{template.icon}</span>
              <h3 className="text-lg font-medium">{template.name}</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">{template.description}</p>
            <div className="space-y-2 mb-4">
              {template.modules.map((module, idx) => (
                <div key={idx} className="flex items-center text-sm">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs mr-2">
                    {idx + 1}
                  </span>
                  <span>{module.type}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => selectWorkflowTemplate(template)}
              className="w-full py-2 text-center bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors text-sm font-medium"
            >
              Use This Template
            </button>
          </div>
        ))}
      </div>
    );
  };

  // Renders YAML configuration
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

  // Module-specific config forms
  const renderLLMAnalyzerConfig = () => {
    if (!currentModuleConfig) return null;
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Prompt Template</label>
          <select className="w-full p-2 border border-gray-300 rounded-md text-sm" defaultValue="Default Analyzer">
            <option>Default Analyzer</option>
            <option>Skill Extractor</option>
            <option>Action Item Generator</option>
            <option>Financial Metrics</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <select className="w-full p-2 border border-gray-300 rounded-md text-sm" defaultValue="GPT-4">
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
          />
        </div>
      </div>
    );
  };

  const renderNotifierConfig = () => {
    if (!currentModuleConfig) return null;
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Notification Channel</label>
          <select className="w-full p-2 border border-gray-300 rounded-md text-sm" defaultValue="Slack">
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
          />
        </div>
      </div>
    );
  };

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
              className={`px-3 py-2 text-sm font-medium ${
                activeTab === 'builder' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`} 
              onClick={() => setActiveTab('builder')}
            >
              <LayoutGrid size={16} className="inline mr-1" />
              Workflow Builder
            </button>
            <button 
              className={`px-3 py-2 text-sm font-medium ${
                activeTab === 'templates' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`} 
              onClick={() => setActiveTab('templates')}
            >
              <Menu size={16} className="inline mr-1" />
              Templates
            </button>
            <button 
              className={`px-3 py-2 text-sm font-medium ${
                activeTab === 'yaml' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`} 
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
            <div className="h-full" ref={reactFlowWrapper} onDrop={onDrop} onDragOver={onDragOver}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onNodeClick={onNodeClick}
                fitView
              >
                <Background />
                <Controls />
                <MiniMap />
                
                {/* Workflow Name Panel */}
                <Panel position="top-left" className="m-2 bg-white px-3 py-2 rounded shadow-md flex items-center space-x-2">
                  <input
                    type="text"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    placeholder="Workflow Name"
                    className="w-64 px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </Panel>
                
                {nodes.length === 0 && (
                  <Panel position="center" className="bg-white p-6 rounded-md shadow-md text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <Plus size={24} className="text-indigo-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">Start Building Your Workflow</h3>
                      <p className="text-sm text-gray-500 max-w-md">
                        Drag modules from the sidebar and drop them here to create your workflow pipeline.
                      </p>
                    </div>
                  </Panel>
                )}
              </ReactFlow>
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
              {currentModuleConfig?.type === 'File Ingestor' && renderFileIngestorConfig()}
              {currentModuleConfig?.type === 'LLM Analyzer' && renderLLMAnalyzerConfig()}
              {currentModuleConfig?.type === 'Notifier' && renderNotifierConfig()}
              {currentModuleConfig?.type === 'If Condition' && renderConditionalConfig(currentModuleConfig)}
              {currentModuleConfig?.type === 'Else Path' && (
                <div className="text-center text-gray-500 py-4">
                  <p>Else path will automatically execute when the connected If condition is false.</p>
                </div>
              )}
              {(currentModuleConfig?.type === 'Webhook Trigger' ||
                currentModuleConfig?.type === 'Schedule Trigger' || 
                currentModuleConfig?.type === 'Event Trigger') && renderTriggerConfig(currentModuleConfig)}
              
              {/* Default configuration for other module types */}
              {![
                'File Ingestor',
                'LLM Analyzer',
                'Notifier',
                'If Condition',
                'Else Path',
                'Webhook Trigger',
                'Schedule Trigger',
                'Event Trigger'
              ].includes(currentModuleConfig?.type) && (
                <div className="py-8 text-center text-gray-500">
                  <Settings size={24} className="mx-auto mb-2" />
                  <p>Configure {currentModuleConfig?.type} settings here.</p>
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
