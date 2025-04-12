"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Play,
  Save,
  Plus,
  Menu,
  Zap,
  Search,
  LayoutGrid,
  Code,
  Settings,
  Trash2,
  X,
  Download,
  Folder,
  FileText,
  Mic,
  Scissors,
  Brain,
  Tag,
  User,
  Filter,
  Mail,
  Database,
  Bell,
  Globe,
  Clock,
  Activity,
  GitBranch,
  CornerDownRight,
} from "lucide-react";

/* ------------------------------------------------------------------
   1) Module-specific config forms
   ------------------------------------------------------------------ */
const renderConditionalConfig = (currentModuleConfig) => {
  if (!currentModuleConfig) return null;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Condition Type
        </label>
        <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
          <option>Contains Text</option>
          <option>Greater Than</option>
          <option>Less Than</option>
          <option>Equal To</option>
          <option>Custom Expression</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Value to Check
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          placeholder="Enter value or variable"
          defaultValue={currentModuleConfig.config.valueToCheck || ""}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Condition Value
        </label>
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

const renderTriggerConfig = (currentModuleConfig) => {
  if (!currentModuleConfig) return null;

  if (currentModuleConfig.type === "Webhook Trigger") {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Webhook Path
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            placeholder="/api/trigger/my-webhook"
            defaultValue={currentModuleConfig.config.path || ""}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Authentication Type
          </label>
          <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
            <option>None</option>
            <option>API Key</option>
            <option>Bearer Token</option>
          </select>
        </div>
      </div>
    );
  }

  if (currentModuleConfig.type === "Schedule Trigger") {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Schedule Type
          </label>
          <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
            <option>Hourly</option>
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Custom Cron</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Time (24h format)
          </label>
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

  // Default for other triggers
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Trigger Configuration
        </label>
        <p className="text-sm text-gray-500">
          Configure your {currentModuleConfig.type} settings here.
        </p>
      </div>
    </div>
  );
};

const renderLLMAnalyzerConfig = (currentModuleConfig) => {
  if (!currentModuleConfig) return null;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Prompt Template
        </label>
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
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Temperature
        </label>
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
        <label className="block text-sm font-medium text-gray-700">
          Custom Prompt
        </label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md text-sm h-24"
          placeholder="Enter your custom prompt instructions..."
          defaultValue={currentModuleConfig.config.customPrompt || ""}
        />
      </div>
    </div>
  );
};

const renderNotifierConfig = (currentModuleConfig) => {
  if (!currentModuleConfig) return null;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Notification Channel
        </label>
        <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
          <option>Slack</option>
          <option>Email</option>
          <option>Webhook</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Destination
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          placeholder="#channel or email@example.com"
          defaultValue={currentModuleConfig.config.destination || ""}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Message Template
        </label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md text-sm h-24"
          placeholder="Enter your notification message template..."
          defaultValue={currentModuleConfig.config.messageTemplate || ""}
        />
      </div>
    </div>
  );
};

const renderFileIngestorConfig = (currentModuleConfig) => {
  if (!currentModuleConfig) return null;

  const fileTypes = ["pdf", "docx", "csv", "mp3", "mp4", "wav"];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Accepted File Types
        </label>
        <div className="grid grid-cols-3 gap-2">
          {fileTypes.map((type) => (
            <label
              key={type}
              className="flex items-center space-x-2 p-2 border border-gray-200 rounded bg-white"
            >
              <input
                type="checkbox"
                className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                defaultChecked={
                  (currentModuleConfig.config.acceptTypes || []).includes(type)
                }
              />
              <span className="text-sm">.{type}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Input Field Label
        </label>
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

/* ------------------------------------------------------------------
   2) Custom Node: Larger handle & properly aligned cog icon
   ------------------------------------------------------------------ */
const ModuleNode = ({ data, id }) => {
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

  // Optional badges (Trigger/If/Else)
  const renderBadge = () => {
    if (data.isTrigger) {
      return (
        <div className="absolute -top-2 -left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
          Trigger
        </div>
      );
    }
    if (data.isConditional && data.label === "If Condition") {
      return (
        <div className="absolute -top-2 -left-2 bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">
          Condition
        </div>
      );
    }
    if (data.isConditional && data.label === "Else Path") {
      return (
        <div className="absolute -top-2 -left-2 bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">
          Else
        </div>
      );
    }
    return null;
  };

  /* LARGER handles so it’s easier to connect */
  const handleStyle = {
    width: 20,
    height: 20,
    top: "50%",
    transform: "translateY(-50%)",
    background: "#6366F1",
  };

  return (
    <div className="relative">
      {renderBadge()}

      {/* Left handle if not trigger */}
      {!data.isTrigger && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            ...handleStyle,
            left: -10,
          }}
          isConnectable={true}
        />
      )}

      <div className={nodeStyle}>
        <div
          className={`w-10 h-10 flex items-center justify-center ${data.iconColor} rounded-lg mr-3`}
        >
          {data.icon}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-800">{data.label}</h4>
          <p className="text-xs text-gray-500">
            {Object.keys(data.config || {}).length > 0
              ? `${Object.keys(data.config).length} configurations set`
              : "No configuration set"}
          </p>
        </div>

        {/* Cog + Trash, with clickable area matching icon */}
        <div className="flex space-x-1 items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onConfig(id);
            }}
            className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-indigo-600"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete(id);
            }}
            className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Right handle (source) */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          ...handleStyle,
          right: -10,
        }}
        isConnectable={true}
      />
      {/* Visual circle/plus. pointer-events none => we drag the handle behind it */}
      <div className="pointer-events-none absolute top-1/2 -right-3 transform -translate-y-1/2">
        <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white">
          <Plus size={14} />
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------
   3) Main Component
   ------------------------------------------------------------------ */
const nodeTypes = {
  moduleNode: ModuleNode,
};

const ModularPipeline = () => {
  const [activeTab, setActiveTab] = useState("builder");
  const [workflowName, setWorkflowName] = useState("New Workflow");
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [currentModuleConfig, setCurrentModuleConfig] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Node / Edge states
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Connect callback
  const onConnect = useCallback(
    (params) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: {
              type: "arrowclosed",
              color: "#6366F1",
            },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  /* Example templates */
  const workflowTemplates = [
    {
      id: "resume-screener",
      name: "Smart Resume Screener",
      description: "Extract skills from resumes and match with job listings",
      icon: "📦",
      modules: [
        {
          type: "Webhook Trigger",
          config: { path: "/api/resume" },
          position: 1,
        },
        {
          type: "File Ingestor",
          config: { acceptTypes: ["pdf", "docx"] },
          position: 2,
        },
        {
          type: "NER / Skill Extractor",
          config: { extractFields: ["skills", "experience"] },
          position: 3,
        },
      ],
    },
    {
      id: "financial-insight",
      name: "Financial Data Insights",
      description: "Extract and analyze data from financial reports",
      icon: "📊",
      modules: [
        {
          type: "Schedule Trigger",
          config: { time: "14:00" },
          position: 1,
        },
        {
          type: "File Ingestor",
          config: { acceptTypes: ["pdf"] },
          position: 2,
        },
        {
          type: "LLM Analyzer",
          config: { promptTemplate: "financial_metrics" },
          position: 3,
        },
        {
          type: "Summarizer",
          config: { maxLength: 500 },
          position: 4,
        },
      ],
    },
  ];

  /* Available modules list */
  const availableModules = [
    // Triggers
    {
      type: "Webhook Trigger",
      description: "Start workflow when webhook is called",
      category: "Trigger",
      icon: "zap",
      isTrigger: true,
    },
    {
      type: "Schedule Trigger",
      description: "Run workflow on a time schedule",
      category: "Trigger",
      icon: "clock",
      isTrigger: true,
    },
    {
      type: "Event Trigger",
      description: "Start workflow on a specific event",
      category: "Trigger",
      icon: "activity",
      isTrigger: true,
    },

    // Input
    {
      type: "File Ingestor",
      description: "Handles user uploads (PDF, DOCX, audio, CSV)",
      category: "Input",
      icon: "folder",
    },
    {
      type: "OCR / PDF Extractor",
      description: "Converts file to text, handles formatting",
      category: "Input",
      icon: "file-text",
    },
    {
      type: "Transcriber",
      description: "Converts audio to text",
      category: "Input",
      icon: "mic",
    },
    {
      type: "Web Scraper",
      description: "Scrapes content from websites",
      category: "Input",
      icon: "globe",
    },

    // Processing
    {
      type: "Text Segmenter",
      description: "Breaks text into chunks for analysis",
      category: "Processing",
      icon: "scissors",
    },

    // AI
    {
      type: "LLM Analyzer",
      description: "GPT prompt runner, uses template + few-shot examples",
      category: "AI",
      icon: "brain",
    },
    {
      type: "Topic Extractor",
      description: "Extracts topics/keywords/intents",
      category: "AI",
      icon: "tag",
    },
    {
      type: "NER / Skill Extractor",
      description: "Extracts named entities, skills, metrics",
      category: "AI",
      icon: "user",
    },

    // Data
    {
      type: "Vector Matcher",
      description: "Compares text chunks to a database (e.g., jobs)",
      category: "Data",
      icon: "filter",
    },

    // Output
    {
      type: "Summarizer",
      description: "Converts long content into clean summaries",
      category: "Output",
      icon: "file-text",
    },
    {
      type: "Email Generator",
      description: "Fills email template using context",
      category: "Output",
      icon: "mail",
    },
    {
      type: "DB Writer",
      description: "Saves results to DB (Notion, Airtable, Supabase)",
      category: "Output",
      icon: "database",
    },
    {
      type: "Notifier",
      description: "Sends notifications (Slack, Email, etc.)",
      category: "Output",
      icon: "bell",
    },

    // Control
    {
      type: "If Condition",
      description: "Branch workflow based on a condition",
      category: "Control",
      icon: "git-branch",
      isConditional: true,
    },
    {
      type: "Else Path",
      description: "Alternative path when the If Condition fails",
      category: "Control",
      icon: "corner-down-right",
      isConditional: true,
    },
  ];

  // Search filter
  const filteredModules = searchTerm
    ? availableModules.filter(
        (m) =>
          m.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : availableModules;

  const categories = [...new Set(availableModules.map((m) => m.category))];

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  const getModuleIcon = (iconName) => {
    switch (iconName) {
      case "zap":
        return <Zap size={16} />;
      case "clock":
        return <Clock size={16} />;
      case "activity":
        return <Activity size={16} />;
      case "folder":
        return <Folder size={16} />;
      case "file-text":
        return <FileText size={16} />;
      case "mic":
        return <Mic size={16} />;
      case "globe":
        return <Globe size={16} />;
      case "scissors":
        return <Scissors size={16} />;
      case "brain":
        return <Brain size={16} />;
      case "tag":
        return <Tag size={16} />;
      case "user":
        return <User size={16} />;
      case "filter":
        return <Filter size={16} />;
      case "mail":
        return <Mail size={16} />;
      case "database":
        return <Database size={16} />;
      case "bell":
        return <Bell size={16} />;
      case "git-branch":
        return <GitBranch size={16} />;
      case "corner-down-right":
        return <CornerDownRight size={16} />;
      default:
        return <Settings size={16} />;
    }
  };

  const getModuleIconColor = (category) => {
    switch (category) {
      case "Trigger":
        return "bg-orange-100 text-orange-600";
      case "Input":
        return "bg-blue-100 text-blue-600";
      case "Processing":
        return "bg-yellow-100 text-yellow-600";
      case "AI":
        return "bg-purple-100 text-purple-600";
      case "Data":
        return "bg-green-100 text-green-600";
      case "Output":
        return "bg-red-100 text-red-600";
      case "Control":
        return "bg-indigo-100 text-indigo-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Convert React Flow nodes -> pipeline steps
  const getActiveModules = () => {
    return nodes.map((node) => ({
      type: node.data.label,
      config: node.data.config || {},
      position: node.data.position,
      icon: node.data.iconName,
    }));
  };

  // Generate YAML
  const generateYaml = () => {
    const activeModules = getActiveModules();
    return `name: ${workflowName}
description: Custom workflow
version: 1.0.0
steps:
${activeModules
  .map(
    (mod) => `  - type: ${mod.type.toLowerCase().replace(/\s+/g, "_")}
    position: ${mod.position}
    config:
${Object.entries(mod.config)
  .map(([k, v]) => `      ${k}: ${JSON.stringify(v)}`)
  .join("\n")}`
  )
  .join("\n")}
`;
  };

  // Download the YAML file
  const handleDownloadYaml = () => {
    const yamlText = generateYaml();
    const blob = new Blob([yamlText], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = workflowName.replace(/\s+/g, "_").toLowerCase() + ".yaml";
    link.click();
    URL.revokeObjectURL(url);
  };

  /* ------------------------------------------------------------------
     Template -> Generate nodes
     ------------------------------------------------------------------ */
  const selectWorkflowTemplate = (template) => {
    setWorkflowName(template.name);

    const newNodes = [];
    const newEdges = [];

    template.modules.forEach((module, idx) => {
      const moduleType = availableModules.find((m) => m.type === module.type);
      const iconName = moduleType ? moduleType.icon : "settings";
      const category = moduleType ? moduleType.category : "default";

      const nodeId = `${module.type}-${idx}`;
      newNodes.push({
        id: nodeId,
        type: "moduleNode",
        position: { x: 200, y: 100 + idx * 120 },
        data: {
          label: module.type,
          config: module.config,
          position: module.position,
          icon: getModuleIcon(iconName),
          iconColor: getModuleIconColor(category),
          iconName,
          category,
          onConfig: openModuleConfig,
          onDelete: removeNode,
          selected: false,
          isTrigger: moduleType?.isTrigger || false,
          isConditional: moduleType?.isConditional || false,
        },
      });

      // Connect each node to the previous
      if (idx > 0) {
        newEdges.push({
          id: `e-${idx - 1}-${idx}`,
          source: `${template.modules[idx - 1].type}-${idx - 1}`,
          target: nodeId,
          markerEnd: { type: "arrowclosed", color: "#6366F1" },
        });
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
    setActiveTab("builder");
  };

  /* ------------------------------------------------------------------
     4) Drag & Drop: create node
     ------------------------------------------------------------------ */
  const onDragOver = useCallback((ev) => {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (ev) => {
      ev.preventDefault();
      if (!reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const moduleData = ev.dataTransfer.getData("module");
      if (!moduleData) return;

      const module = JSON.parse(moduleData);
      const position = reactFlowInstance.project({
        x: ev.clientX - reactFlowBounds.left,
        y: ev.clientY - reactFlowBounds.top,
      });

      const nodeId = `${module.type}-${nodes.length}`;
      const moduleType = availableModules.find((m) => m.type === module.type);
      const iconName = moduleType ? moduleType.icon : "settings";
      const category = moduleType ? moduleType.category : "default";

      const newNode = {
        id: nodeId,
        type: "moduleNode",
        position,
        data: {
          label: module.type,
          config: {},
          position: nodes.length + 1,
          icon: getModuleIcon(iconName),
          iconColor: getModuleIconColor(category),
          iconName,
          category,
          onConfig: openModuleConfig,
          onDelete: removeNode,
          selected: false,
          isTrigger: module.isTrigger || false,
          isConditional: module.isConditional || false,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, nodes, availableModules]
  );

  /* ------------------------------------------------------------------
     5) Config & Deletion
     ------------------------------------------------------------------ */
  const openModuleConfig = (nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      setCurrentModuleConfig({
        id: nodeId,
        type: node.data.label,
        config: node.data.config || {},
        icon: node.data.iconName,
        category: node.data.category,
      });
      setIsConfigOpen(true);
    }
  };

  const updateModuleConfig = (config) => {
    if (!currentModuleConfig) return;
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === currentModuleConfig.id) {
          return {
            ...node,
            data: {
              ...node.data,
              config,
            },
          };
        }
        return node;
      })
    );
    setIsConfigOpen(false);
  };

  const removeNode = (nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  };

  // Delete selected node with Delete/Backspace
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName;
      if (activeTag === "INPUT" || activeTag === "TEXTAREA") return;

      if (e.key === "Delete" || e.key === "Backspace") {
        const selectedNode = nodes.find((n) => n.data.selected);
        if (selectedNode) {
          removeNode(selectedNode.id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nodes]);

  // Node click => mark as selected
  const onNodeClick = (evt, node) => {
    setNodes((prevNodes) =>
      prevNodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          selected: n.id === node.id,
        },
      }))
    );
    // We open config only via the cogwheel. If you want auto-open on node click,
    // call openModuleConfig(node.id) here.
  };

  /* ------------------------------------------------------------------
     6) Sidebar + Tooltips
     ------------------------------------------------------------------ */
  const handleDragStart = (e, module) => {
    e.dataTransfer.setData("module", JSON.stringify(module));
  };

  const renderModulesByCategory = () => {
    return categories.map((cat) => (
      <div key={cat} className="mb-4 relative">
        <h3 className="text-sm font-medium text-gray-500 mb-2">{cat}</h3>
        <div className="space-y-2">
          {filteredModules
            .filter((m) => m.category === cat)
            .map((module, idx) => (
              <div
                key={`${module.type}-${idx}`}
                className="group relative flex items-center p-2 bg-white border border-gray-200 rounded-lg cursor-grab hover:border-indigo-300 transition-colors"
                draggable
                onDragStart={(e) => handleDragStart(e, module)}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center ${getModuleIconColor(
                    module.category
                  )} rounded-lg`}
                >
                  {getModuleIcon(module.icon)}
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-800">
                    {module.type}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {module.description}
                  </p>
                </div>

                {/* Tooltip with high z-index */}
                <div
                  className="hidden group-hover:block absolute top-1/2 left-full ml-2 transform -translate-y-1/2 p-2 bg-white shadow-lg border border-gray-100 rounded text-gray-700 text-xs max-w-xs z-50"
                  style={{ width: "200px" }}
                >
                  {module.description}
                </div>
              </div>
            ))}
        </div>
      </div>
    ));
  };

  const renderTemplatesGrid = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workflowTemplates.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => selectWorkflowTemplate(tpl)}
            className="cursor-pointer bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">{tpl.icon}</span>
              <h3 className="text-lg font-medium">{tpl.name}</h3>
            </div>
            <p className="text-sm text-gray-600">{tpl.description}</p>
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
          <button
            className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
            onClick={handleDownloadYaml}
          >
            <Download size={14} className="mr-1" />
            Download
          </button>
        </div>
        <div className="p-4 bg-gray-50">
          <pre className="whitespace-pre-wrap text-sm font-mono">
            {generateYaml()}
          </pre>
        </div>
      </div>
    );
  };

  /* ------------------------------------------------------------------
     7) Main Return
     ------------------------------------------------------------------ */
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* LEFT SIDEBAR */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-visible">
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
          <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
            Available Modules
          </h2>
          {renderModulesByCategory()}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP NAVBAR */}
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <button
              className={`px-3 py-2 text-sm font-medium ${
                activeTab === "builder"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("builder")}
            >
              <LayoutGrid size={16} className="inline mr-1" />
              Workflow Builder
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium ${
                activeTab === "templates"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("templates")}
            >
              <Menu size={16} className="inline mr-1" />
              Templates
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium ${
                activeTab === "yaml"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("yaml")}
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

        {/* TAB CONTENT */}
        <div className="flex-1 overflow-auto">
          {activeTab === "builder" && (
            <div
              className="h-full"
              ref={reactFlowWrapper}
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
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
                defaultEdgeOptions={{
                  type: "smoothstep",
                  style: { stroke: "#6366F1" },
                  animated: true,
                }}
                /* Pan/zoom settings */
                panOnDrag={true}
                panOnScroll={false}
                zoomOnScroll={true}
                zoomOnDoubleClick={false}
                minZoom={0.2}
                maxZoom={2}
              >
                <Background />
                <Controls />
                <MiniMap />

                {/* Workflow Name Panel */}
                <Panel
                  position="top-left"
                  className="m-2 bg-white px-3 py-2 rounded shadow-md flex items-center space-x-2"
                >
                  <input
                    type="text"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    placeholder="Workflow Name"
                    className="w-64 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </Panel>

                {/* No nodes -> show helpful panel */}
                {nodes.length === 0 && (
                  <Panel
                    position="center"
                    className="bg-white p-6 rounded-md shadow-md text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <Plus size={24} className="text-indigo-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">
                        Start Building Your Workflow
                      </h3>
                      <p className="text-sm text-gray-500 max-w-md">
                        Drag modules from the sidebar and drop them here to
                        create your workflow pipeline.
                      </p>
                    </div>
                  </Panel>
                )}
              </ReactFlow>
            </div>
          )}

          {activeTab === "templates" && (
            <div className="p-6 overflow-auto">{renderTemplatesGrid()}</div>
          )}

          {activeTab === "yaml" && (
            <div className="p-6 overflow-auto">{renderYamlConfig()}</div>
          )}
        </div>
      </div>

      {/* CONFIGURATION MODAL */}
      {isConfigOpen && currentModuleConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium">
                Configure {currentModuleConfig.type}
              </h2>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setIsConfigOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              {currentModuleConfig?.type === "File Ingestor" &&
                renderFileIngestorConfig(currentModuleConfig)}
              {currentModuleConfig?.type === "LLM Analyzer" &&
                renderLLMAnalyzerConfig(currentModuleConfig)}
              {currentModuleConfig?.type === "Notifier" &&
                renderNotifierConfig(currentModuleConfig)}
              {currentModuleConfig?.type === "If Condition" &&
                renderConditionalConfig(currentModuleConfig)}
              {currentModuleConfig?.type === "Else Path" && (
                <div className="text-center text-gray-500 py-4">
                  Else path will execute if the connected If Condition fails.
                </div>
              )}
              {(currentModuleConfig?.type === "Webhook Trigger" ||
                currentModuleConfig?.type === "Schedule Trigger" ||
                currentModuleConfig?.type === "Event Trigger") &&
                renderTriggerConfig(currentModuleConfig)}

              {/* Default config for other modules */}
              {![
                "File Ingestor",
                "LLM Analyzer",
                "Notifier",
                "If Condition",
                "Else Path",
                "Webhook Trigger",
                "Schedule Trigger",
                "Event Trigger",
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
