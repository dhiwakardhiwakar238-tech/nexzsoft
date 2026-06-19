import "./CRM.css";
import { useState } from "react";

import {
    DragDropContext,
    Droppable,
    Draggable,
} from "@hello-pangea/dnd";

import AddLeadModal from "./AddLeadModal";
import LeadDetails from "./LeadDetails";
import SalesAnalytics from "./SalesAnalytics";
import TeamPerformance from "./TeamPerformance";

import PipelineBoard from "./PipelineBoard";




function CRM() {
    const [showModal, setShowModal] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [search, setSearch] = useState("");

    const [pipeline, setPipeline] = useState({
        newLeads: [
            {
                id: "1",
                name: "Samsung India",
                company: "Samsung",
                priority: "hot",
            },
            {
                id: "2",
                name: "ABC Retail",
                company: "ABC Pvt Ltd",
                priority: "warm",
            },
        ],

        contacted: [
            {
                id: "3",
                name: "Fresh Mart",
                company: "Fresh Mart Ltd",
                priority: "warm",
            },
        ],

        qualified: [
            {
                id: "4",
                name: "Tech World",
                company: "Tech World",
                priority: "hot",
            },
        ],

        proposal: [
            {
                id: "5",
                name: "Nex Retail",
                company: "Retail Group",
                priority: "cold",
            },
        ],

        won: [
            {
                id: "6",
                name: "Global Corp",
                company: "Global Corp",
                priority: "hot",
            },
        ],
    });

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const sourceCol = result.source.droppableId;
        const destCol = result.destination.droppableId;

        const sourceItems = [...pipeline[sourceCol]];
        const destItems =
            sourceCol === destCol
                ? sourceItems
                : [...pipeline[destCol]];

        const [removed] = sourceItems.splice(
            result.source.index,
            1
        );

        destItems.splice(
            result.destination.index,
            0,
            removed
        );

        setPipeline({
            ...pipeline,
            [sourceCol]: sourceItems,
            [destCol]: destItems,
        });
    };

    const columns = [
        { id: "newLeads", title: "🆕 New Leads" },
        { id: "contacted", title: "📞 Contacted" },
        { id: "qualified", title: "✅ Qualified" },
        { id: "proposal", title: "📄 Proposal" },
        { id: "won", title: "🏆 Won" },
    ];

    return (
        <div className="crm-page">

            <div className="crm-header">
                <h1>👥 CRM Pipeline</h1>

                <button
                    className="add-lead-btn"
                    onClick={() => setShowModal(true)}
                >
                    + Add Lead
                </button>
            </div>

            <SalesAnalytics />

            <TeamPerformance/>


            {/* KPI CARDS */}

            <div className="crm-stats">

                <div className="stat-card">
                    <h4>Total Leads</h4>
                    <h2>42</h2>
                </div>

                <div className="stat-card">
                    <h4>Pipeline Value</h4>
                    <h2>₹ 32L</h2>
                </div>

                <div className="stat-card">
                    <h4>Won Deals</h4>
                    <h2>8</h2>
                </div>

                <div className="stat-card">
                    <h4>Conversion</h4>
                    <h2>34%</h2>
                </div>

            </div>

            {/* SEARCH */}

            <div className="crm-search">
                <input
                    type="text"
                    placeholder="Search lead..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="crm-board">

                    {columns.map((column) => (

                        <Droppable
                            droppableId={column.id}
                            key={column.id}
                        >
                            {(provided) => (
                                <div
                                    className="crm-column"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <h3>{column.title}</h3>

                                    {pipeline[column.id]
                                        .filter((lead) =>
                                            lead.name
                                                .toLowerCase()
                                                .includes(
                                                    search.toLowerCase()
                                                )
                                        )
                                        .map((lead, index) => (

                                            <Draggable
                                                draggableId={lead.id}
                                                index={index}
                                                key={lead.id}
                                            >
                                                {(provided) => (
                                                    <div
                                                        className="lead-card"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        onClick={() =>
                                                            setSelectedLead(lead)
                                                        }
                                                    >
                                                        <h4>{lead.name}</h4>

                                                        <p>{lead.company}</p>

                                                        <span
                                                            className={`priority ${lead.priority}`}
                                                        >
                                                            {lead.priority === "hot"
                                                                ? "🔥 Hot"
                                                                : lead.priority === "warm"
                                                                    ? "🟡 Warm"
                                                                    : "⚪ Cold"}
                                                        </span>

                                                    </div>
                                                )}
                                            </Draggable>

                                        ))}

                                    {provided.placeholder}

                                </div>
                            )}
                        </Droppable>

                    ))}

                </div>
            </DragDropContext>

            {showModal && (
                <AddLeadModal
                    closeModal={() =>
                        setShowModal(false)
                    }
                />
            )}

            {selectedLead && (
                <LeadDetails
                    lead={selectedLead}
                    closeDrawer={() =>
                        setSelectedLead(null)
                    }
                />
            )}

        </div>
    );
}

export default CRM;