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

/* 
  ------------------------------------------------------------------
  1) MODULE-SPECIFIC CONFIGURATION FORMS
  ------------------------------------------------------------------
*/
const renderConditionalConfig = (currentModuleConfig) => {
  if (!currentModuleConfig) return null;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Condition Type
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          value={currentModuleConfig.config.conditionType || "Contains Text"}
          onChange={(e) =>
            currentModuleConfig.handleConfigChange("conditionType", e.target.value)
          }
        >
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
          value={currentModuleConfig.config.valueToCheck || ""}
          onChange={(e) =>
            currentModuleConfig.handleConfigChange("valueToCheck", e.target.value)
          }
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
          value={currentModuleConfig.config.conditionValue || ""}
          onChange={(e) =>
            currentModuleConfig.handleConfigChange("conditionValue", e.target.value)
          }
        />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------
  2) CUSTOM NODE COMPONENT
  ------------------------------------------------------------------
*/
const ModuleNode = ({ data, id }) => {
  // Base style
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

  const handleStyle = {
    width: 20,
    height: 20,
    top: "50%",
    transform: "translateY(-50%)",
    background: "#6366F1",
  };

  // Optional badges
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

  return (
    <div className="relative">
      {renderBadge()}

      {/* Left handle if not trigger */}
      {!data.isTrigger && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ ...handleStyle, left: -10 }}
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

        {/* Cog + Trash, bigger clickable area */}
        <div className="flex space-x-1 items-center">
          <button
            className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-indigo-600"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Cogwheel clicked for node:", id); // ADDED LOG
              data.onConfig(id);
            }}
          >
            <Settings size={16} />
          </button>
          <button
            className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete(id);
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Right handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ ...handleStyle, right: -10 }}
        isConnectable={true}
      />
      <div className="pointer-events-none absolute top-1/2 -right-3 transform -translate-y-1/2">
        <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white">
          <Plus size={14} />
        </div>
      </div>
    </div>
  );
};

/*
  ------------------------------------------------------------------
  3) MAIN BUILDER COMPONENT
  ------------------------------------------------------------------
*/
const nodeTypes = {
  moduleNode: ModuleNode,
};

export default function ModularPipeline() {
  const [activeTab, setActiveTab] = useState("builder");
  const [workflowName, setWorkflowName] = useState("New Workflow");
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [currentModuleConfig, setCurrentModuleConfig] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Node & Edge states
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const nodesRef = useRef(nodes);
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);
  // Connect callback => step edges
  const onConnect = useCallback(
    (params) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: { type: "arrowclosed", color: "#6366F1" },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  /* TEMPLATES EXAMPLE */
  const workflowTemplates = [
    {
      id: "resume-screener",
      name: "Smart Resume Screener",
      description: "Extract skills from resumes and match with job listings",
      icon: "📦",
      modules: [
        { type: "Webhook Trigger", config: { path: "/api/resume", method: "POST" }, position: 1 },
        { type: "File Ingestor", config: { acceptTypes: ["pdf", "docx"] }, position: 2 },
        { type: "NER / Skill Extractor", config: { extractFields: ["skills"] }, position: 3 },
      ],
    },
    {
      id: "financial-insight",
      name: "Financial Data Insights",
      description: "Extract and analyze data from financial reports",
      icon: "📊",
      modules: [
        { type: "Schedule Trigger", config: { time: "14:00" }, position: 1 },
        { type: "File Ingestor", config: { acceptTypes: ["pdf"] }, position: 2 },
        { type: "LLM Analyzer", config: { promptTemplate: "financial_metrics" }, position: 3 },
        { type: "Summarizer", config: { maxLength: 500 }, position: 4 },
      ],
    },
  ];

  /* AVAILABLE MODULES (WITH TRIGGERS, INTEGRATIONS, ETC.) */
  const availableModules = [
    // triggers
    { type: "Webhook Trigger", description: "Start workflow when webhook is called", category: "Trigger", icon: "zap", isTrigger: true },
    { type: "Schedule Trigger", description: "Run workflow on a time schedule", category: "Trigger", icon: "clock", isTrigger: true },
    { type: "Event Trigger", description: "Start workflow on specific event", category: "Trigger", icon: "activity", isTrigger: true },
    // integrations
    { type: "Slack Integration", description: "Post/read Slack channels", category: "Integration", icon: "bell" },
    { type: "Google Sheets", description: "Read/write data to Google Sheets", category: "Integration", icon: "database" },
    { type: "Salesforce", description: "Sync leads in Salesforce", category: "Integration", icon: "user" },
    { type: "Mailchimp", description: "Manage mailing lists in Mailchimp", category: "Integration", icon: "mail" },
    // input
    { type: "File Ingestor", description: "Handles user uploads (PDF, DOCX, CSV...)", category: "Input", icon: "folder" },
    { type: "OCR / PDF Extractor", description: "Convert PDF to text", category: "Input", icon: "file-text" },
    { type: "Transcriber", description: "Converts audio to text", category: "Input", icon: "mic" },
    { type: "Web Scraper", description: "Scrapes content from websites", category: "Input", icon: "globe" },
    // processing
    { type: "Text Segmenter", description: "Break text into chunks for analysis", category: "Processing", icon: "scissors" },
    // AI
    { type: "LLM Analyzer", description: "GPT prompt runner with templates", category: "AI", icon: "brain" },
    { type: "Topic Extractor", description: "Extract topics, keywords, etc.", category: "AI", icon: "tag" },
    { type: "NER / Skill Extractor", description: "Extract named entities or skills", category: "AI", icon: "user" },
    // data
    { type: "Vector Matcher", description: "Compare text to DB (jobs, etc.)", category: "Data", icon: "filter" },
    // output
    { type: "Summarizer", description: "Turns long content into short summary", category: "Output", icon: "file-text" },
    { type: "Email Generator", description: "Fills email template with context", category: "Output", icon: "mail" },
    { type: "DB Writer", description: "Save results to DB (Notion, etc.)", category: "Output", icon: "database" },
    { type: "Notifier", description: "Sends Slack/email notifications", category: "Output", icon: "bell" },
    // control
    { type: "If Condition", description: "Branch workflow if condition met", category: "Control", icon: "git-branch", isConditional: true },
    { type: "Else Path", description: "Alternative path if If Condition fails", category: "Control", icon: "corner-down-right", isConditional: true },
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

  /* HELPER: pick icons, colors, etc. */
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
      case "Integration":
        return "bg-green-100 text-green-600";
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

  const getActiveModules = () => {
    return nodes.map((node) => ({
      type: node.data.label,
      config: node.data.config || {},
      position: node.data.position,
      icon: node.data.iconName,
    }));
  };

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
  .join("\n")}`;
  };

  // Download YAML
  const handleDownloadYaml = () => {
    const yamlText = generateYaml();
    const blob = new Blob([yamlText], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download =
      workflowName.replace(/\s+/g, "_").toLowerCase() + ".yaml";
    link.click();
    URL.revokeObjectURL(url);
  };

  /* TEMPLATES => create nodes/edges */
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

      // connect each node
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

  /* DRAG & DROP => create new node */
  const onDragOver = useCallback((evt) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (evt) => {
      evt.preventDefault();
      if (!reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const moduleData = evt.dataTransfer.getData("module");
      if (!moduleData) return;

      const module = JSON.parse(moduleData);
      const position = reactFlowInstance.project({
        x: evt.clientX - reactFlowBounds.left,
        y: evt.clientY - reactFlowBounds.top,
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

  /* CONFIG & DELETION */
  const openModuleConfig = (nodeId) => {
    console.log("openModuleConfig triggered for node:", nodeId); // ADDED LOG
    console.log("Current nodes state:", nodesRef.current); // ADDED LOG
    const node = nodesRef.current.find((n) => n.id === nodeId);
    if (node) {
      console.log("if node true for node:", nodeId);
      // Include the handleConfigChange method so config forms can update state
      setCurrentModuleConfig({
        id: nodeId,
        type: node.data.label,
        config: node.data.config || {},
        icon: node.data.iconName,
        category: node.data.category,
        handleConfigChange, // pass the change handler for config inputs
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
    setEdges((eds) =>
      eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
    );
  };

  // Delete node with Delete/Backspace
  useEffect(() => {
    const handleKeyDown = (evt) => {
      const activeTag = document.activeElement?.tagName;
      if (activeTag === "INPUT" || activeTag === "TEXTAREA") return;
      if (evt.key === "Delete" || evt.key === "Backspace") {
        const selectedNode = nodes.find((n) => n.data.selected);
        if (selectedNode) removeNode(selectedNode.id);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nodes]);

  // Node click => mark selected
  const onNodeClick = (evt, node) => {
    setNodes((prevNodes) =>
      prevNodes.map((n) => ({
        ...n,
        data: { ...n.data, selected: n.id === node.id },
      }))
    );
  };

  /* SIDEBAR + TOOLTIPS */
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
                  className="hidden group-hover:block absolute top-1/2 left-full ml-2 transform -translate-y-1/2 p-2 bg-white shadow-lg border border-gray-100 rounded text-gray-700 text-xs max-w-xs z-[999999]"
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

  const renderTemplatesGrid = () => (
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

  const renderYamlConfig = () => (
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

  /* ------------------------------------------------------------------
     CONFIGURATION HANDLER & RENDERING
     ------------------------------------------------------------------ */
  const handleConfigChange = (key, value) => {
    setCurrentModuleConfig((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value,
      },
    }));
  };

  const renderModuleConfig = () => {
    if (!currentModuleConfig) return null;
    const { type, config } = currentModuleConfig;
    switch (type) {
      case "If Condition":
        return renderConditionalConfig(currentModuleConfig);
      case "Webhook Trigger":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Endpoint Path
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={config.path || ""}
                onChange={(e) =>
                  handleConfigChange("path", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                HTTP Method
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={config.method || "POST"}
                onChange={(e) =>
                  handleConfigChange("method", e.target.value)
                }
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
            </div>
          </div>
        );
      case "Schedule Trigger":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Schedule Time
              </label>
              <input
                type="time"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={config.time || ""}
                onChange={(e) =>
                  handleConfigChange("time", e.target.value)
                }
              />
            </div>
          </div>
        );
      case "Event Trigger":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Event Name
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={config.eventName || ""}
                onChange={(e) =>
                  handleConfigChange("eventName", e.target.value)
                }
              />
            </div>
          </div>
        );
      case "Slack Integration":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Webhook URL
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={config.webhookUrl || ""}
                onChange={(e) =>
                  handleConfigChange("webhookUrl", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Channel
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={config.channel || ""}
                onChange={(e) =>
                  handleConfigChange("channel", e.target.value)
                }
              />
            </div>
          </div>
        );
      case "Google Sheets":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Sheet ID
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={config.sheetId || ""}
                onChange={(e) =>
                  handleConfigChange("sheetId", e.target.value)
                }
              />
            </div>
          </div>
        );
      case "Salesforce":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                API Key
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={config.apiKey || ""}
                onChange={(e) =>
                  handleConfigChange("apiKey", e.target.value)
                }
              />
            </div>
          </div>
        );
      case "Mailchimp":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                API Key
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={config.apiKey || ""}
                onChange={(e) =>
                  handleConfigChange("apiKey", e.target.value)
                }
              />
            </div>
          </div>
        );
      case "File Ingestor":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Accepted File Types (comma separated)
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={
                  config.acceptTypes ? config.acceptTypes.join(",") : ""
                }
                onChange={(e) =>
                  handleConfigChange("acceptTypes", e.target.value.split(","))
                }
              />
            </div>
          </div>
        );
      case "OCR / PDF Extractor":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              No additional configuration required.
            </p>
          </div>
        );
      case "Transcriber":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Language
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={config.language || ""}
                onChange={(e) =>
                  handleConfigChange("language", e.target.value)
                }
              />
            </div>
          </div>
        );
      case "Web Scraper":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Target URL
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={config.targetUrl || ""}
                onChange={(e) =>
                  handleConfigChange("targetUrl", e.target.value)
                }
              />
            </div>
          </div>
        );
      case "Text Segmenter":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Chunk Size
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={config.chunkSize || 0}
                onChange={(e) =>
                  handleConfigChange("chunkSize", e.target.value)
                }
              />
            </div>
          </div>
        );
      case "LLM Analyzer":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Prompt Template
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={config.promptTemplate || ""}
                onChange={(e) =>
                  handleConfigChange("promptTemplate", e.target.value)
                }
              />
            </div>
          </div>
        );
      case "Topic Extractor":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Number of Topics
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={config.numTopics || 0}
                onChange={(e) =>
                  handleConfigChange("numTopics", e.target.value)
                }
              />
            </div>
          </div>
        );
      case "NER / Skill Extractor":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Fields to Extract (comma separated)
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={config.extractFields ? config.extractFields.join(",") : ""}
                onChange={(e) =>
                  handleConfigChange("extractFields", e.target.value.split(","))
                }
              />
            </div>
          </div>
        );
      case "Vector Matcher":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Similarity Threshold
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={config.threshold || 0}
                onChange={(e) =>
                  handleConfigChange("threshold", e.target.value)
                }
              />
            </div>
          </div>
        );
      case "Summarizer":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Max Length
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={config.maxLength || 0}
                onChange={(e) =>
                  handleConfigChange("maxLength", e.target.value)
                }
              />
            </div>
          </div>
        );
      case "Email Generator":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Subject
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={config.emailSubject || ""}
                onChange={(e) =>
                  handleConfigChange("emailSubject", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Body Template
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={config.emailBody || ""}
                onChange={(e) =>
                  handleConfigChange("emailBody", e.target.value)
                }
              />
            </div>
          </div>
        );
      case "DB Writer":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Database Connection String
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={config.connectionString || ""}
                onChange={(e) =>
                  handleConfigChange("connectionString", e.target.value)
                }
              />
            </div>
          </div>
        );
      case "Notifier":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Notification Message
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={config.notificationMessage || ""}
                onChange={(e) =>
                  handleConfigChange("notificationMessage", e.target.value)
                }
              />
            </div>
          </div>
        );
      case "Else Path":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              No configuration required for Else Path.
            </p>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              No configuration available for this module type.
            </p>
          </div>
        );
    }
  };

  /* ------------------------------------------------------------------
     FINAL RENDERING
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
                defaultEdgeOptions={{
                  type: "step",
                  style: { stroke: "#6366F1" },
                  animated: true,
                }}
                snapToGrid
                snapGrid={[20, 20]}
                panOnDrag
                panOnScroll={false}
                zoomOnScroll
                zoomOnDoubleClick={false}
                minZoom={0.2}
                maxZoom={2}
                fitView
              >
                <Background />
                <Controls />
                <MiniMap />

                {/* Panel for workflow name */}
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

                {/* If no nodes => helpful panel */}
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
                        Drag modules from the sidebar and drop them here to create your workflow pipeline.
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999999]">
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
              {renderModuleConfig()}
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
}
