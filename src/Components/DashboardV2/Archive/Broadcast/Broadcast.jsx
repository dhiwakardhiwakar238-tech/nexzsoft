import toast from "react-hot-toast";
import "./Broadcast.css";

import React, { useState, useEffect } from "react";
// import { sendBroadcast } from "../../../services/api";

import CreateTemplateModal
    from "./CreateTemplateModal/CreateTemplateModal";
// import { getMetaTemplates } from "../../services/api";
// import { getMetaTemplates } from "../../../services/api";


import {

    getMetaTemplates,
    sendBroadcast,
    getCustomers,
    getBroadcasts,
    getBroadcastDetails,
    syncMetaTemplates

} from "../../../services/api";

function Broadcast() {

    const [showCreateTemplate, setShowCreateTemplate] = useState(false);

    const [broadcasts, setBroadcasts] = useState([]);
    const [selectedBroadcast, setSelectedBroadcast] = useState(null);

    const [broadcastLogs, setBroadcastLogs] = useState([]);

    useEffect(() => {

        console.log(
            "Selected Broadcast =",
            selectedBroadcast
        );

    }, [selectedBroadcast]);

    useEffect(() => {

        console.log(
            "Broadcast Logs =",
            broadcastLogs
        );

    }, [broadcastLogs]);


    const [audience, setAudience] = useState("");
    const [customers, setCustomers] = useState([]);
    const [selectedTemplateData, setSelectedTemplateData] = useState(null);
    const [campaign, setCampaign] = useState("");
    const [message, setMessage] = useState(`👋 Hello Customer,

        Festival Offer is LIVE!!

        🎉 Get Flat 30% OFF

        👉 Visit our website now.`);

    const [templates, setTemplates] = useState([]);

    const [selectedTemplate, setSelectedTemplate] = useState("");

    const [recipientCount, setRecipientCount] = useState(0);

    useEffect(() => {

                setRecipientCount(

                    audience === "All Customers"

                        ? customers.length

                        : customers.filter(

                            customer =>

                                customer.label_name === audience

                        ).length

                );

            }, [audience, customers]);

    useEffect(() => {

        loadTemplates();

        loadCustomers();

        loadBroadcasts();

    }, []);

    const audiences = Object.values(
        customers.reduce((acc, customer) => {
            if (!customer.label_name) return acc;

            if (!acc[customer.labels]) {
                acc[customer.labels] = {
                    value: customer.labels,
                    name: customer.label_name,
                    count: 0
                };
            }

            acc[customer.labels].count++;

            return acc;
        }, {})
    );

    const loadTemplates = async () => {

        try {

            const tenantId =
                localStorage.getItem("tenantId");

            // STEP-1
            await syncMetaTemplates(
                tenantId
            );

            // STEP-2
            const data =
                await getMetaTemplates();

                console.log(
                    "Templates =",
                    data
                );

            setTemplates(
                data || []
            );

        }

        catch (err) {

            console.log(err);

        }

    };

    const loadCustomers = async () => {

        try {

            const tenantId =
                localStorage.getItem("tenantId");

            const data =
                await getCustomers(tenantId);

            setCustomers(data || []);

        }

        catch (err) {

            console.log(err);

        }

    };


    const loadBroadcasts = async () => {

        try {

            const tenantId =
                localStorage.getItem("tenantId");

            const response =
                await getBroadcasts(tenantId);

            console.log(
                "Broadcast List =",
                response
            );

            setBroadcasts(response);

        }

        catch (err) {

            console.log(err);

        }

    };


    const loadBroadcastDetails = async (id) => {

        try {

            const tenantId =
                localStorage.getItem("tenantId");

            const response =
                await getBroadcastDetails(
                    id,
                    tenantId
                );

            console.log(
                "Broadcast Details =",
                response
            );

            setSelectedBroadcast(
                response.broadcast
            );

            setBroadcastLogs(
                response.logs || []
            );

        }

        catch (err) {

            console.log(err);

        }

    };



    console.log("BROADCAST LOGS");

    console.log(broadcastLogs);

    return (

        <div className="broadcast-page">
            <div className="broadcast-top">

                <div>

                    <h2>📢 Broadcast Campaigns</h2>

                    <p>
                        Send promotional messages to your customers.
                    </p>

                </div>

                <div className="campaign-header-actions">

                    <button
                        className="create-template-btn"
                        onClick={() =>
                            setShowCreateTemplate(true)
                        }
                    >
                        + Create Template
                    </button>
                    {/* 
                    <button
                        className="new-campaign-btn"
                    >
                        + New Campaign
                    </button>*/}

                </div>

            </div>

            <div className="broadcast-stats">

                <div className="broadcast-stat-card">

                    <h2>{broadcasts.length}</h2>

                    <p>Total Campaigns</p>

                </div>

                <div className="broadcast-stat-card success">

                    <h2>98%</h2>

                    <p>Delivered</p>

                </div>

                <div className="broadcast-stat-card info">

                    <h2>74%</h2>

                    <p>Read Rate</p>

                </div>

                <div className="broadcast-stat-card warning">

                    <h2>312</h2>

                    <p>Replies</p>

                </div>

            </div>

            <div className="broadcast-main">

                <div className="campaign-card">

                    <h3 className="new-campaign-btn">New Campaign</h3>

                    <div className="form-group">

                        <label>Campaign Name</label>

                        <input
                            type="text"
                            value={campaign}
                            onChange={(e) => setCampaign(e.target.value)}
                            placeholder="Festival Offer 2026"
                        />

                    </div>

                    <div className="form-group">

                        <label>Audience</label>

                        <select

                            value={audience}

                            onChange={(e) => setAudience(e.target.value)}

                        >

                            <option value="All Customers">

                                All Customers({customers.length})

                            </option>

                            {audiences.map(label => (
                                <option
                                    key={label.value}
                                    value={label.name}
                                >
                                    {label.name} ({label.count})
                                </option>
                            ))}

                        </select>

                    </div>

                    <div className="form-group">

                        <label>Template</label>

                        <select

                            value={selectedTemplate}

                            onChange={(e) => {

                                const id = e.target.value;

                                setSelectedTemplate(id);

                                const temp = templates.find(t => t.id === id);

                                setSelectedTemplateData(temp);

                            }}

                        >

                            <option value="">

                                Select Template

                            </option>

                            {

                                templates.map(template => (

                                    <option

                                        key={template.id}

                                        value={template.id}

                                    >

                                        {template.name}

                                        ({template.category})

                                        •

                                        {template.language}

                                    </option>

                                ))

                            }

                        </select>

                    </div>

                    {/*<div className="form-group">

                        <label>Message</label>

                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your broadcast message..."
                        ></textarea>

                    </div>*/}

                    <div className="campaign-actions">

                        <button className="attach-btn">

                            📎 Attachment

                        </button>

                        <button className="schedule-btn">

                            📅 Schedule

                        </button>

                    </div>

                    <button
                        className="send-btn"
                        onClick={async () => {

                            if (!selectedTemplateData) {
                                toast.error("Select Template");
                                return;
                            }

                            let recipients = [];

                            if (audience === "All Customers") {

                                recipients = customers
                                    .filter(c => c.phone)
                                    .map(c => String(c.phone).trim())
                                    .map(phone => {

                                        phone = phone.replace(/\s+/g, "");

                                        if (phone.startsWith("0")) {
                                            phone = phone.substring(1);
                                        }

                                        if (!phone.startsWith("91")) {
                                            phone = "91" + phone;
                                        }

                                        return phone;

                                    })
                                    .filter((phone, index, arr) => arr.indexOf(phone) === index);

                            } else {

                                recipients = customers
                                    .filter(c => c.label_name === audience)
                                    .filter(c => c.phone)
                                    .map(c => String(c.phone).trim())
                                    .map(phone => {

                                        phone = phone.replace(/\s+/g, "");

                                        if (phone.startsWith("0")) {
                                            phone = phone.substring(1);
                                        }

                                        if (!phone.startsWith("91")) {
                                            phone = "91" + phone;
                                        }

                                        return phone;

                                    })
                                    .filter((phone, index, arr) => arr.indexOf(phone) === index);

                            }

                            console.log("TENANT ID");
                            console.log(localStorage.getItem("tenantId"));

                            console.log("SELECTED TEMPLATE");
                            console.log(selectedTemplateData);

                            console.log("RECIPIENTS");
                            console.log(recipients);

                            console.log("Recipients =", recipients);

                            try {

                                const response = await sendBroadcast({

                                    tenantId:
                                        localStorage.getItem("tenantId"),

                                    audience,

                                    campaignName: campaign,

                                    templateName:
                                        selectedTemplateData.name,

                                    recipients,

                                    language:
                                        selectedTemplateData.language || "en_US"

                                });

                                console.log(response);

                                toast.success("Broadcast Sent");
                                await loadBroadcasts();

                            }

                            catch (err) {

                                console.log(err);

                                toast.error("Broadcast Failed");

                            }

                        }}
                    >

                        🚀 Send Broadcast

                    </button>

                </div>

                <div className="preview-card">

                    <h3>WhatsApp Preview</h3>

                    <div className="audience-preview">

                        <h4>Recipients</h4>

                        <p>

                            👥 {recipientCount} Customer{recipientCount !== 1 ? "s" : ""}

                        </p>

                    </div>

                    <div className="broadcast-phone">

                        <div className="broadcast-phone-header">

                            {campaign || "New Campaign"}

                        </div>

                        <div className="broadcast-phone-body">

                            <div className="broadcast-preview-message">

                                {

                                    selectedTemplateData ?

                                        selectedTemplateData.components.map((component, index) => (

                                            <div key={index}>

                                                {

                                                    component.type === "HEADER" && (

                                                        <>

                                                            <strong>

                                                                {

                                                                    component.text ||

                                                                    "[Image Header]"

                                                                }

                                                            </strong>

                                                            <br /><br />

                                                        </>

                                                    )

                                                }

                                                {

                                                    component.type === "BODY" && (

                                                        <>

                                                            {component.text}

                                                            <br /><br />

                                                        </>

                                                    )

                                                }

                                                {

                                                    component.type === "FOOTER" && (

                                                        <>

                                                            <small>

                                                                {component.text}

                                                            </small>

                                                            <br /><br />

                                                        </>

                                                    )

                                                }

                                                {

                                                    component.type === "BUTTONS" && (

                                                        component.buttons.map((btn, i) => (

                                                            <button

                                                                key={i}

                                                                style={{

                                                                    marginTop: "6px",

                                                                    marginRight: "6px"

                                                                }}

                                                            >

                                                                {btn.text}

                                                            </button>

                                                        ))

                                                    )

                                                }

                                            </div>

                                        ))

                                        :

                                        "Select a template"

                                }

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <div className="campaign-history">

                <div className="history-header">

                    <h3>Campaign Insights</h3>

                    <button>View All</button>

                </div>

                <table>

                    <thead>

                        <tr>

                            <th>Campaign</th>

                            <th>Audience</th>

                            <th>Status</th>

                            <th>Sent</th>

                            <th>Reach</th>

                            <th>Action</th>

                        </tr>

                    </thead>
                    <tbody>

                        {

                            broadcasts.length === 0 ?

                                (

                                    <tr>

                                        <td colSpan="6">

                                            No Broadcasts Found

                                        </td>

                                    </tr>

                                )

                                :

                                (

                                    broadcasts.map((item) => (

                                        <tr key={item.id}>

                                            <td>

                                                {item.campaign_name}

                                            </td>

                                            <td>

                                                {item.audience}

                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        item.failed_count > 0
                                                            ? "status draft"
                                                            : "status sent"
                                                    }
                                                >

                                                    {

                                                        item.failed_count > 0

                                                            ? "Completed"

                                                            : "Success"

                                                    }

                                                </span>

                                            </td>

                                            <td>

                                                {

                                                    new Date(item.created_at)

                                                        .toLocaleDateString()

                                                }

                                            </td>

                                            <td>

                                                {

                                                    item.success_count

                                                }

                                                /

                                                {

                                                    item.total_recipients

                                                }

                                            </td>

                                            <td>

                                                <button
                                                    className="table-btn"
                                                    onClick={() => {

                                                        console.log(
                                                            "CLICKED = ",
                                                            item.id
                                                        );

                                                        loadBroadcastDetails(
                                                            item.id
                                                        );

                                                    }}
                                                >
                                                    View
                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                )

                        }

                    </tbody>

                </table>

            </div>

            {
                selectedBroadcast && (

                    <div
                        style={{
                            background: "red",
                            color: "white",
                            padding: "20px"
                        }}
                    >

                        <h1>
                            DETAILS OPENED
                        </h1>

                        <h2>
                            {selectedBroadcast.campaign_name}
                        </h2>

                    </div>

                )
            }

            <CreateTemplateModal

                open={showCreateTemplate}

                onClose={() =>

                    setShowCreateTemplate(false)

                }

            />

        </div>



    );

}



export default Broadcast;