import "./Sidebar.css";

import {
    RiDashboardFill,
    RiInboxFill,
    RiWhatsappFill,
    RiFacebookFill,
    RiInstagramFill,
    RiTelegramFill,
    RiGlobalLine,
    RiMessage2Fill,
    RiRobot2Fill,
    RiFileList3Fill,
    RiTicket2Fill,
    RiVipDiamondFill,
} from "react-icons/ri";

import React, { useEffect, useState } from "react";

function Sidebar({ activeSidebar, setActiveSidebar, currentPlan }) {

    const businessname =
        localStorage.getItem("businessName") || "Workspace";

    const sections = [
        {
            title: null,
            items: [
                {
                    id: "dashboard",
                    label: "Dashboard",
                    icon: <RiDashboardFill />
                }/*,
                {
                    id: "inbox",
                    label: "Unified Inbox",
                    icon: <RiInboxFill />
                }*/
            ]
        },

        {
            title: "Channels",
            items: [
                {
                    id: "whatsapp",
                    label: "WhatsApp",
                    icon: <RiWhatsappFill />
                }/*,
                {
                    id: "facebook",
                    label: "Facebook",
                    icon: <RiFacebookFill />
                },
                {
                    id: "instagram",
                    label: "Instagram",
                    icon: <RiInstagramFill />
                },
                {
                    id: "webchat",
                    label: "Web Chat",
                    icon: <RiGlobalLine />
                },
                {
                    id: "telegram",
                    label: "Telegram",
                    icon: <RiTelegramFill />
                },
                {
                    id: "rcs",
                    label: "RCS",
                    icon: <RiMessage2Fill />
                }*/
            ]
        },

        {
            title: "Elements",
            items: [
                {
                    id: "ticketing",
                    label: "Ticketing",
                    icon: <RiTicket2Fill />
                },
                {
                    id: "aistudio",
                    label: "AI Studio",
                    icon: <RiFileList3Fill />
                }
            ]
        }
    ];

    return (
        <aside className="sidebar">

            {/* WORKSPACE HEADER */} 
            <div className="sidebar-workspace"> 
                <div className="sidebar-workspace-info"> 
                    <h2>{
                        businessname}
                    </h2> 
                    <span>
                        Workspace
                    </span> 
                </div>
            </div>


            {/* MENU */}
            <div className="menu">

                {sections.map((section, sectionIndex) => (

                    <div
                        className="menu-section"
                        key={
                            section.title ||
                            `main-${sectionIndex}`
                        }
                    >

                        {section.title && (
                            <div className="menu-section-title">
                                {section.title}
                            </div>
                        )}

                        <div className="menu-section-items">

                            {section.items.map((item) => (

                                <div
                                    key={item.id}
                                    className={`menu-item ${
                                        activeSidebar === item.id
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setActiveSidebar(item.id)
                                    }
                                >

                                    <span className="menu-icon">
                                        {item.icon}
                                    </span>

                                    <span className="menu-label">
                                        {item.label}
                                    </span>

                                </div>

                            ))}

                        </div>

                    </div>

                ))}

            </div>


            {/* FOOTER - SUBSCRIPTION */}
            <div className="sidebar-footer">

                <div className="subscription-card">

                    <div className="subscription-card-header">

                        <span className="subscription-label">
                            CURRENT PLAN
                        </span>

                        <span
                            className={`subscription-status ${
                                currentPlan?.subscription_status === "active"
                                    ? "active"
                                    : currentPlan?.subscription_status === "cancelled"
                                        ? "cancelled"
                                        : "trial"
                            }`}
                        >
                            {currentPlan?.subscription_status === "active"
                                ? "Active"
                                : currentPlan?.subscription_status === "cancelled"
                                    ? "Cancelled"
                                    : "Trial"}
                        </span>

                    </div>


                    <div className="subscription-plan">

                        <strong>
                            {currentPlan?.subscription_status === "active"
                                ? "Pay As You Grow"
                                : currentPlan?.subscription_status === "cancelled"
                                    ? "Pay As You Grow"
                                    : "Trial Plan"}
                        </strong>

                        <span>
                            {currentPlan?.subscription_status === "cancelled"
                                ? "Subscription cancelled"
                                : currentPlan?.ended_at
                                    ? currentPlan.subscription_status === "trialing"
                                        ? "Trial completed"
                                        : "Usage plan completed"
                                    : currentPlan?.subscription_status === "active"
                                        ? "Active subscription"
                                        : currentPlan?.subscription_status === "trialing" &&
                                          currentPlan?.trial_started_at &&
                                          currentPlan?.trial_ends_at
                                            ? (() => {
                                                const today = new Date();
                        
                                                const trialEnd = new Date(
                                                    currentPlan.trial_ends_at
                                                );
                        
                                                const graceStart =
                                                    currentPlan.grace_period_started_at
                                                        ? new Date(
                                                            currentPlan.grace_period_started_at
                                                        )
                                                        : null;
                        
                                                const graceEnd =
                                                    currentPlan.grace_period_ends_at
                                                        ? new Date(
                                                            currentPlan.grace_period_ends_at
                                                        )
                                                        : null;
                        
                                                // Trial is still active
                                                if (today < trialEnd) {
                                                    const diffTime =
                                                        trialEnd.getTime() -
                                                        today.getTime();
                        
                                                    const daysLeft = Math.max(
                                                        0,
                                                        Math.ceil(
                                                            diffTime /
                                                                (1000 * 60 * 60 * 24)
                                                        )
                                                    );
                        
                                                    return `${daysLeft} days left`;
                                                }
                        
                                                // Trial ended, but grace period is active
                                                if (
                                                    graceStart &&
                                                    graceEnd &&
                                                    today >= graceStart &&
                                                    today < graceEnd
                                                ) {
                                                    const diffTime =
                                                        graceEnd.getTime() -
                                                        today.getTime();
                        
                                                    const graceDaysLeft = Math.max(
                                                        0,
                                                        Math.ceil(
                                                            diffTime /
                                                                (1000 * 60 * 60 * 24)
                                                        )
                                                    );
                        
                                                    return `${graceDaysLeft} days left in grace period`;
                                                }
                        
                                                return "Trial completed";
                                            })()
                                            : "Ready to activate"}
                        </span>

                    </div>


                    <button
                        className="subscription-action"
                        onClick={() => {

                            const trialNotStarted =
                                !currentPlan?.subscription_status &&
                                !currentPlan?.trial_started_at;

                            if (
                                trialNotStarted ||
                                currentPlan?.subscription_status === "cancelled"
                            ) {
                        
                                setActiveSidebar("whatsapp");

                            } else {

                                // Trial is active or subscription is active.
                                setActiveSidebar("subscription");

                            }

                        }}
                    >

                        <span>
                            {currentPlan?.subscription_status === "cancelled"
                                ? "Connect WhatsApp"
                                : currentPlan?.ended_at
                                    ? "Start Usage Pricing"
                                    : currentPlan?.subscription_status === "active"
                                        ? "Manage Subscription"
                                        : currentPlan?.subscription_status === "trialing" &&
                                          currentPlan?.trial_started_at
                                            ? "Start Usage Pricing"
                                            : "Connect WhatsApp"}
                        </span>

                        <span className="subscription-arrow">
                            →
                        </span>

                    </button>

                </div>

            </div>

        </aside>
    );
}

export default Sidebar;
