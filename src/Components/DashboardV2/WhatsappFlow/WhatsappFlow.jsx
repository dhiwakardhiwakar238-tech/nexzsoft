import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { saveFlow, getFlows } from "../../../services/api.js";
import {
  FiMessageSquare,
  FiHelpCircle,
  FiGitBranch,
  FiUserPlus,
  FiTag,
  FiCheckCircle,
  FiClock,
  FiTrash2,
  FiPlus,
  FiArrowDown,
  FiInfo,
  FiLayers,
  FiCornerDownRight,
  FiSave,
  FiCheck
} from "react-icons/fi";
import "./WhatsappFlow.css";

const STEP_TYPES = {
  message: { label: "Send Message", desc: "Send a WhatsApp message", icon: FiMessageSquare, color: "#4f46e5" },
  wait: { label: "Wait for Reply", desc: "Wait for customer response", icon: FiClock, color: "#0284c7" },
  question: { label: "Ask Question", desc: "Ask and capture an answer", icon: FiHelpCircle, color: "#7c3aed" },
  condition: { label: "Condition", desc: "Choose a path based on response", icon: FiGitBranch, color: "#d97706" },
  agent: { label: "Assign Agent", desc: "Assign conversation to a team", icon: FiUserPlus, color: "#059669" },
  tag: { label: "Add Tag", desc: "Add a customer tag", icon: FiTag, color: "#dc2626" },
  close: { label: "Close Conversation", desc: "End the conversation", icon: FiCheckCircle, color: "#16a34a" }
};

const DEFAULT_INITIAL_STEPS = [
  { id: 101, type: "message", title: "Welcome Message", message: "Hi! Welcome to QuickFix Mobile Service Center. How can we help today?" },
  { id: 102, type: "question", title: "Main Menu", question: "Please select an option:\n1. New Repair Service\n2. Check Existing Ticket Status", variable: "main_choice" },
  {
    id: 103,
    type: "condition",
    title: "Check Main Choice",
    variable: "main_choice",
    rules: [
      { id: "r1", operator: "equals", value: "1", targetStepId: 104 },
      { id: "r2", operator: "equals", value: "2", targetStepId: 105 }
    ],
    defaultTargetStepId: 102
  },
  { id: 104, type: "question", title: "Select Brand", question: "Which brand is your phone?\n1. Samsung\n2. Apple\n3. Other", variable: "brand_choice" },
  { id: 105, type: "question", title: "Get Ticket Number", question: "Please enter your 6-digit ticket number:", variable: "ticket_num" }
];

export default function WhatsappFlow() {
  // Flows collection & Active Metadata
  const [flowList, setFlowList] = useState([]);
  const [selectedFlowId, setSelectedFlowId] = useState("");
  const [flowName, setFlowName] = useState("");
  const [flowDescription, setFlowDescription] = useState("");

  // Step Designer State
  const [steps, setSteps] = useState([]);
  const [selectedStepId, setSelectedStepId] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const selectedStep =
  steps.find((s) => s.id === selectedStepId) || steps[0] || null;

  // Flow Switching & Creation
  const handleFlowSelect = (flowId) => {

      setSelectedFlowId(flowId);
  
      if (!flowId) {
          return;
      }
  
      const flow = flowList.find(
          (f) => f.flow_id === flowId
      );
  
      if (flow) {
  
          setFlowName(flow.name);
  
          setFlowDescription(
              flow.description || ""
          );
  
          setSteps(
              Array.isArray(flow.steps)
                  ? flow.steps
                  : []
          );
  
          setSelectedStepId(
              flow.steps?.[0]?.id || null
          );
      }
  };

  const handleCreateNewFlow = () => {
    const newEmptySteps = [
      {
        id: 101,
        type: "message",
        title: "Welcome Message",
        message: "Hi! Welcome to our customer service."
      }
    ];
  
    // New flow is only editor state.
    // It is NOT added to flowList until saved to DB.
    setSelectedFlowId("");
    setFlowName("New Untitled Flow");
    setFlowDescription("");
    setSteps(newEmptySteps);
    setSelectedStepId(101);
  };

  // Step Management Handlers
  const addStep = (type) => {
    const newId = steps.length > 0 ? Math.max(...steps.map((s) => s.id)) + 1 : 101;
    let newStep = { id: newId, type, title: STEP_TYPES[type].label };

    if (type === "condition") {
      newStep.variable = "user_response";
      newStep.rules = [{ id: "r1", operator: "equals", value: "1", targetStepId: "" }];
      newStep.defaultTargetStepId = "";
    } else if (type === "question") {
      newStep.question = "";
      newStep.variable = "";
    } else if (type === "message") {
      newStep.message = "";
    }

    setSteps([...steps, newStep]);
    setSelectedStepId(newId);
    setShowAddMenu(false);
  };

  const deleteStep = (id) => {
    if (steps.length <= 1) return;
    const filtered = steps.filter((s) => s.id !== id);
    setSteps(filtered);
    if (selectedStepId === id) {
      setSelectedStepId(filtered[0].id);
    }
  };

  const updateSelectedStep = (key, value) => {
    setSteps(
      steps.map((s) => {
        if (s.id === selectedStepId) {
          return { ...s, [key]: value };
        }
        return s;
      })
    );
  };

  // Rule Handlers for Multi-Condition Logic
  const addRule = () => {
    if (selectedStep.type !== "condition") return;
    const newRules = [
      ...(selectedStep.rules || []),
      { id: `r_${Date.now()}`, operator: "equals", value: "", targetStepId: "" }
    ];
    updateSelectedStep("rules", newRules);
  };

  const updateRule = (ruleId, field, value) => {
    if (selectedStep.type !== "condition") return;
    const updatedRules = selectedStep.rules.map((r) => {
      if (r.id === ruleId) {
        return { ...r, [field]: value };
      }
      return r;
    });
    updateSelectedStep("rules", updatedRules);
  };

  const deleteRule = (ruleId) => {
    if (selectedStep.type !== "condition") return;
    const updatedRules = selectedStep.rules.filter((r) => r.id !== ruleId);
    updateSelectedStep("rules", updatedRules);
  };

  // Save / Publish Pipeline
  const handleSaveFlow = async (status = "draft") => {
    try {
      setIsSaving(true);
      const flowData = {
        flowId: selectedFlowId,
        name: flowName,
        description: flowDescription,
        steps,
        status
      };

      const savedFlow = await saveFlow(flowData);

      // Update flow record in memory
      setFlowList((prev) =>
        prev.map((f) => (f.id === selectedFlowId ? { ...f, name: flowName, description: flowDescription, steps } : f))
      );

      if (savedFlow?.flow_id && savedFlow.flow_id !== selectedFlowId) {
        setSelectedFlowId(savedFlow.flow_id);
      }

      toast.success(status === "published" ? "Flow published successfully!" : "Draft saved successfully!");
    } catch (error) {
      console.error(`Failed to ${status} flow:`, error);
      toast.error("Error saving flow.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {

    const loadFlows = async () => {

        try {

            const flows = await getFlows();

            setFlowList(flows);

        } catch (error) {

            console.error(
                "Failed to load WhatsApp flows:",
                error
            );

            toast.error(
                "Failed to load flows."
            );
        }
    };

    loadFlows();

}, []);

  return (
    <div className="flow-page">
      {/* HEADER */}
      <header className="flow-header">
        <div>
          <div className="flow-eyebrow">WHATSAPP AUTOMATION ENGINE</div>
          <h1>Chatbot Builder</h1>
          <p>Configure branching decision trees with multi-condition step jumping.</p>
        </div>
        <div className="flow-header-actions">
          <select
            className="flow-dropdown-select"
            value={selectedFlowId}
            onChange={(e) => handleFlowSelect(e.target.value)}
          >
            <option value="">
                Create New Flow
            </option>
            {flowList.map((flow) => (
                <option
                    key={flow.flow_id}
                    value={flow.flow_id}
                >
                    {flow.name} · v{flow.version}
                </option>
            ))}
          </select>

          <button className="flow-primary-btn" onClick={handleCreateNewFlow}>
            <FiPlus /> New Flow
          </button>
        </div>
        
        {/*<div className="flow-header-left">
          <div className="flow-selector-row">
            
          </div>

          <div className="flow-meta-row">
            <input
              type="text"
              className="flow-meta-name-input"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              placeholder="Flow Name..."
            />
            <input
              type="text"
              className="flow-meta-desc-input"
              value={flowDescription}
              onChange={(e) => setFlowDescription(e.target.value)}
              placeholder="Brief description (e.g. Weekend support triage)..."
            />
          </div>
        </div>*/}
      </header>

      {/* 3-COLUMN LAYOUT */}
      <div className="flow-layout">
        {/* COLUMN 1: CUSTOMER JOURNEY (STEP CANVAS) */}
        <div className="flow-canvas">
          <div className="flow-canvas-header">
            <div>
              <h3>Customer Journey</h3>
              <span>{steps.length} steps configured</span>
            </div>
            <div className="flow-status">
              <span /> Dynamic Flow
            </div>
          </div>

          <div className="flow-steps">
            <div className="flow-meta-block">
              <input
                type="text"
                className="flow-meta-name-input"
                value={flowName}
                onChange={(e) => setFlowName(e.target.value)}
                placeholder="Flow Name..."
              />
            
              <input
                type="text"
                className="flow-meta-desc-input"
                value={flowDescription}
                onChange={(e) => setFlowDescription(e.target.value)}
                placeholder="Brief description..."
              />
            </div>

            <div className="flow-connector">
              <FiArrowDown />
            </div>
            
            <div className="flow-start-node">
              <div className="flow-start-icon">
                <FiMessageSquare />
              </div>
              <div className="flow-start-content">
                <strong>Flow Start</strong>
                <span>Customer messages your WhatsApp number</span>
              </div>
            </div>

            <div className="flow-connector">
              <FiArrowDown />
            </div>

            {steps.map((step, idx) => {
              const IconComponent = STEP_TYPES[step.type]?.icon || FiMessageSquare;
              const isSelected = step.id === selectedStepId;

              return (
                <div key={step.id} className="flow-step-wrapper">
                  <div
                    className={`flow-step ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedStepId(step.id)}
                  >
                    <div
                      className="flow-step-icon"
                      style={{ color: STEP_TYPES[step.type]?.color, background: `${STEP_TYPES[step.type]?.color}15` }}
                    >
                      <IconComponent />
                    </div>
                    <div className="flow-step-content">
                      <span className="flow-step-number">STEP #{step.id}</span>
                      <strong>{step.title}</strong>
                      <small>
                        {step.type === "condition"
                          ? `${step.rules?.length || 0} Branch Rule(s)`
                          : step.type === "question"
                          ? `Variable: {{${step.variable || "none"}}}`
                          : STEP_TYPES[step.type]?.desc}
                      </small>
                    </div>
                  </div>

                  {idx < steps.length - 1 && (
                    <div className="flow-connector">
                      <FiArrowDown />
                    </div>
                  )}
                </div>
              );
            })}

            {/* ADD STEP BUTTON & MENU */}
            <div className="flow-connector">
              <FiArrowDown />
            </div>

            <div className="flow-add-area">
              <div className="flow-add-box" onClick={() => setShowAddMenu(!showAddMenu)}>
                <div className="flow-add-icon">
                  <FiPlus />
                </div>
                <div className="flow-start-content">
                  <strong>Add Next Step</strong>
                  <span>Extend the customer path</span>
                </div>
              </div>

              {showAddMenu && (
                <div className="flow-step-menu">
                  {Object.entries(STEP_TYPES).map(([type, info]) => (
                    <button key={type} onClick={() => addStep(type)}>
                      <span style={{ color: info.color, background: `${info.color}15` }}>
                        <info.icon />
                      </span>
                      <div>
                        <strong>{info.label}</strong>
                        <small>{info.desc}</small>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COLUMN 2: STEP CONFIGURATION PANEL */}
        <div className="flow-config">
          {selectedStep ? (
            <>
              <div className="flow-panel-header">
                <div>
                  <span>
                    STEP CONFIGURATION (ID: #{selectedStep.id})
                  </span>
                  <h3>{selectedStep.title}</h3>
                </div>
        
                {steps.length > 1 && (
                  <button
                    className="flow-delete-btn"
                    onClick={() => deleteStep(selectedStep.id)}
                    title="Delete Step"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
        
              <div className="flow-form">
                <label>Step Name / Title</label>
                <input
                  type="text"
                  value={selectedStep.title}
                  onChange={(e) =>
                    updateSelectedStep("title", e.target.value)
                  }
                  placeholder="e.g. Check Customer Response"
                />
        
                {/* MESSAGE FIELDS */}
                {selectedStep.type === "message" && (
                  <>
                    <label>WhatsApp Message Content</label>
                    <textarea
                      rows={4}
                      value={selectedStep.message || ""}
                      onChange={(e) =>
                        updateSelectedStep("message", e.target.value)
                      }
                      placeholder="Enter greeting or response text..."
                    />
                  </>
                )}
        
                {/* QUESTION FIELDS */}
                {selectedStep.type === "question" && (
                  <>
                    <label>Question Prompt</label>
                    <textarea
                      rows={3}
                      value={selectedStep.question || ""}
                      onChange={(e) =>
                        updateSelectedStep("question", e.target.value)
                      }
                      placeholder="e.g. Please select 1 for New Repair or 2 for Status Check"
                    />
        
                    <label>Save Answer To Variable</label>
                    <input
                      type="text"
                      value={selectedStep.variable || ""}
                      onChange={(e) =>
                        updateSelectedStep("variable", e.target.value)
                      }
                      placeholder="e.g. main_choice"
                    />
                  </>
                )}
        
                {/* MULTI-CONDITION JUMP LOGIC FIELDS */}
                {selectedStep.type === "condition" && (
                  <div className="flow-condition-builder">
                    <label>Variable to Evaluate</label>
        
                    <input
                      type="text"
                      value={selectedStep.variable || ""}
                      onChange={(e) =>
                        updateSelectedStep("variable", e.target.value)
                      }
                      placeholder="e.g. main_choice"
                    />
        
                    <div className="flow-rules-header">
                      <label>Branching Jump Rules</label>
        
                      <button
                        className="flow-add-rule-btn"
                        onClick={addRule}
                      >
                        + Add Condition
                      </button>
                    </div>
        
                    {(selectedStep.rules || []).map((rule, index) => (
                      <div
                        key={rule.id}
                        className="flow-rule-card"
                      >
                        <div className="flow-rule-top">
                          <span className="rule-badge">
                            Rule #{index + 1}
                          </span>
        
                          {selectedStep.rules.length > 1 && (
                            <button
                              className="rule-del-btn"
                              onClick={() => deleteRule(rule.id)}
                            >
                              &times;
                            </button>
                          )}
                        </div>
        
                        <div className="flow-input-row">
                          <select
                            value={rule.operator}
                            onChange={(e) =>
                              updateRule(
                                rule.id,
                                "operator",
                                e.target.value
                              )
                            }
                          >
                            <option value="equals">
                              Equals
                            </option>
        
                            <option value="contains">
                              Contains
                            </option>
        
                            <option value="not_equals">
                              Does Not Equal
                            </option>
                          </select>
        
                          <input
                            type="text"
                            value={rule.value}
                            onChange={(e) =>
                              updateRule(
                                rule.id,
                                "value",
                                e.target.value
                              )
                            }
                            placeholder="Value (e.g. 1)"
                          />
                        </div>
        
                        <label className="jump-label">
                          If Match → Jump Directly To Step:
                        </label>
        
                        <select
                          value={rule.targetStepId || ""}
                          onChange={(e) =>
                            updateRule(
                              rule.id,
                              "targetStepId",
                              Number(e.target.value)
                            )
                          }
                          className="jump-select"
                        >
                          <option value="">
                            -- Select Target Step --
                          </option>
        
                          {steps
                            .filter(
                              (s) => s.id !== selectedStep.id
                            )
                            .map((s) => (
                              <option
                                key={s.id}
                                value={s.id}
                              >
                                STEP #{s.id}: {s.title} ({s.type})
                              </option>
                            ))}
                        </select>
                      </div>
                    ))}
        
                    <label className="jump-label">
                      Default Target (If No Rules Match):
                    </label>
        
                    <select
                      value={
                        selectedStep.defaultTargetStepId || ""
                      }
                      onChange={(e) =>
                        updateSelectedStep(
                          "defaultTargetStepId",
                          Number(e.target.value)
                        )
                      }
                      className="jump-select"
                    >
                      <option value="">
                        -- Select Fallback Target Step --
                      </option>
        
                      {steps
                        .filter(
                          (s) => s.id !== selectedStep.id
                        )
                        .map((s) => (
                          <option
                            key={s.id}
                            value={s.id}
                          >
                            STEP #{s.id}: {s.title}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
        
                {/* HELPER BOX */}
                <div className="flow-helper">
                  <FiInfo style={{ marginRight: 6 }} />
        
                  <span>
                    <strong>
                      How Jump Logic Works:
                    </strong>{" "}
                    When the customer replies, the engine tests
                    each rule top-to-bottom and jumps directly to
                    that step ID.
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flow-empty-state">
              <FiInfo />
        
              <h3>No Flow Selected</h3>
        
              <p>
                Select an existing flow or create a new flow to
                begin.
              </p>
            </div>
          )}
        </div>

        {/* COLUMN 3: FLOW OVERVIEW & TREE WITH BOTTOM ACTION BUTTONS */}
        <div className="flow-summary">
          <div className="flow-panel-header">
            <div>
              <span>FLOW OVERVIEW & TREE</span>
              <h3>Interactive Connection Graph</h3>
            </div>
            <FiLayers style={{ color: "#6366f1" }} />
          </div>

          <div className="flow-tree-container">
            {steps.map((step, idx) => {
              const isSelected = step.id === selectedStepId;
              const isHovered = step.id === hoveredNodeId;

              let targets = [];
              if (step.type === "condition" && step.rules) {
                targets = step.rules.map((r) => r.targetStepId).filter(Boolean);
                if (step.defaultTargetStepId) targets.push(step.defaultTargetStepId);
              } else if (idx < steps.length - 1) {
                targets.push(steps[idx + 1].id);
              }

              return (
                <div
                  key={step.id}
                  className={`tree-node-card ${isSelected ? "tree-selected" : ""} ${isHovered ? "tree-hovered" : ""}`}
                  onClick={() => setSelectedStepId(step.id)}
                  onMouseEnter={() => setHoveredNodeId(step.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                >
                  <div className="tree-node-header">
                    <span className="tree-step-badge">STEP #{step.id}</span>
                    <span className="tree-type-pill">{step.type}</span>
                  </div>
                  <strong className="tree-step-title">{step.title}</strong>

                  {step.type === "condition" && (
                    <div className="tree-branches">
                      {(step.rules || []).map((r, i) => (
                        <div key={i} className="tree-branch-link">
                          <FiCornerDownRight />
                          <span>If "{r.value}"</span>
                          <strong className="target-pill">
                            {r.targetStepId ? `➔ STEP #${r.targetStepId}` : "Unlinked"}
                          </strong>
                        </div>
                      ))}
                    </div>
                  )}

                  {isHovered && (
                    <div className="tree-tooltip">
                      <strong>STEP #{step.id} Details</strong>
                      <p>
                        {step.type === "message" && `Text: "${step.message || "Not set"}"`}
                        {step.type === "question" && `Question: "${step.question || "Not set"}"`}
                        {step.type === "condition" && `Branch variable: ${step.variable}`}
                      </p>
                      <small>Targets: {targets.length > 0 ? targets.join(", ") : "End of Flow"}</small>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flow-summary-footer">
            <div className="summary-stat">
              <strong>{steps.length}</strong>
              <span>Total Steps</span>
            </div>
            <div className="summary-stat">
              <strong>
                {steps.filter((s) => s.type === "condition").reduce((acc, curr) => acc + (curr.rules?.length || 0), 0)}
              </strong>
              <span>Active Rules</span>
            </div>
          </div>

          {/* ACTION BUTTONS BELOW TREE */}
          <div className="flow-bottom-actions">
            <button
              className="flow-secondary-btn flow-action-btn"
              onClick={() => handleSaveFlow("draft")}
              disabled={isSaving}
            >
              <FiSave /> Save Draft
            </button>
            <button
              className="flow-primary-btn flow-action-btn"
              onClick={() => handleSaveFlow("published")}
              disabled={isSaving}
            >
              <FiCheck /> {isSaving ? "Publishing..." : "Publish Flow"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
