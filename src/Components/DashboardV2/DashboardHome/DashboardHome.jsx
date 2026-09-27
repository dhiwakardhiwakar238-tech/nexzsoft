import React, { useState, useEffect } from "react";
import "./DashboardHome.css";
import { 
  getCustomers, 
  getConversations 
} from "../../../services/api"; // Adjust import path if needed

import {
  MessageSquare,
  Users,
  CheckCircle2,
  Clock,
  Radio,
  Bot,
  Plus,
  Send,
  UserPlus,
  Settings,
  ArrowUpRight,
  RefreshCw,
  SlidersHorizontal,
  ExternalLink,
  ChevronRight
} from "lucide-react";

export default function DashboardHome() {
  const [userName, setUserName] = useState("User");
  const [greeting, setGreeting] = useState("Welcome");
  const [loading, setLoading] = useState(false);

  // Filter & Search states
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedChannel, setSelectedChannel] = useState("all");

  // Live Stats State
  const [stats, setStats] = useState({
    totalCustomers: 1240,
    openChats: 18,
    closedToday: 42,
    webhookCalls: 14250,
    activeChannelsCount: 5,
    aiResolutionRate: "94.2%"
  });

  // Dynamic Channels State
  const [channels, setChannels] = useState([
    { id: "wa", name: "WhatsApp", icon: "💬", color: "#25D366", status: "connected", activeChats: 12 },
    { id: "ig", name: "Instagram", icon: "📸", color: "#E4405F", status: "connected", activeChats: 4 },
    { id: "fb", name: "Facebook", icon: "📘", color: "#1877F2", status: "connected", activeChats: 2 },
    { id: "web", name: "WebChat", icon: "🌐", color: "#6366F1", status: "connected", activeChats: 5 },
    { id: "rcs", name: "RCS", icon: "📱", color: "#0088CC", status: "disconnected", activeChats: 0 },
    { id: "tg", name: "Telegram", icon: "✈️", color: "#229ED9", status: "connected", activeChats: 1 }
  ]);

  // Conversations List State
  const [conversations, setConversations] = useState([
    { id: 1, name: "Rahul Sharma", phone: "+91 98765 43210", channel: "WhatsApp", channelColor: "#25D366", status: "open", lastMsg: "Need quote for enterprise API integration", time: "10:42 AM", unread: 2 },
    { id: 2, name: "Priya Patel", phone: "+91 98123 45678", channel: "Instagram", channelColor: "#E4405F", status: "open", lastMsg: "When will my order arrive?", time: "10:38 AM", unread: 1 },
    { id: 3, name: "Amit Kumar", phone: "+91 99887 76655", channel: "WebChat", channelColor: "#6366F1", status: "closed", lastMsg: "Thank you for the quick support!", time: "09:15 AM", unread: 0 },
    { id: 4, name: "Sneha Reddy", phone: "+91 97654 32109", channel: "WhatsApp", channelColor: "#25D366", status: "open", lastMsg: "Is demo available today?", time: "08:50 AM", unread: 0 },
    { id: 5, name: "Vikram Singh", phone: "+91 91234 56789", channel: "Telegram", channelColor: "#229ED9", status: "closed", lastMsg: "Resolved by AI Bot", time: "Yesterday", unread: 0 }
  ]);

  // Load user info & API Data
  const loadDashboard = async () => {
    setLoading(true);
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);

    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good Morning");
    else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon");
    else if (hour >= 17 && hour < 21) setGreeting("Good Evening");
    else setGreeting("Good Night");

    try {
      const tenantId = localStorage.getItem("tenantId");
      if (tenantId) {
        const custData = await getCustomers(tenantId);
        const convData = await getConversations(tenantId);
        if (Array.isArray(custData)) setStats(prev => ({ ...prev, totalCustomers: custData.length }));
        if (Array.isArray(convData)) setConversations(convData);
      }
    } catch (err) {
      console.log("Using default fallback data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Filter logic
  const filteredConversations = conversations.filter(conv => {
    const matchesStatus = filterStatus === "all" || conv.status === filterStatus;
    const matchesChannel = selectedChannel === "all" || conv.channel.toLowerCase() === selectedChannel.toLowerCase();
    return matchesStatus && matchesChannel;
  });

  return (
    <div className="dashboard-home">
      
      {/* 1. COMPACT HEADER */}
      <div className="dashboard-header">
        <div className="header-title">
          <h1>{greeting}, {userName} 👋</h1>
          <div className="header-subtitle">
            <span>Omnichannel Overview</span>
            <span>•</span>
            <span className="badge-pill badge-green">
              <Radio size={12} /> {channels.filter(c => c.status === "connected").length}/{channels.length} Channels Live
            </span>
          </div>
        </div>

        <div className="header-actions">
          <button className="secondary-btn" onClick={loadDashboard}>
            <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh
          </button>
          <button className="primary-btn">
            <Plus size={14} /> New Campaign
          </button>
        </div>
      </div>

      {/* 2. CONNECTED CHANNELS BAR */}
      <div className="dashboard-card channels-section">
        <div className="card-title">
          <span>Ecosystem Channel Connections</span>
          <span className="badge-pill badge-blue">Real-time Sync</span>
        </div>
        <div className="channels-grid">
          {channels.map((ch) => (
            <div key={ch.id} className="channel-card">
              <div className="channel-info">
                <div className="channel-icon-wrapper" style={{ backgroundColor: `${ch.color}15` }}>
                  {ch.icon}
                </div>
                <div>
                  <p className="channel-name">{ch.name}</p>
                  <p className="channel-status">
                    <span className={`status-dot ${ch.status === "connected" ? "dot-connected" : "dot-disconnected"}`}></span>
                    {ch.status === "connected" ? `${ch.activeChats} active` : "Offline"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. KEY METRICS GRID */}
      <div className="kpi-grid">
        <div className="dashboard-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Open / Active Chats</span>
            <MessageSquare size={18} color="#2563eb" />
          </div>
          <p className="kpi-value">{stats.openChats}</p>
          <div className="kpi-footer">
            <span className="kpi-trend-positive">Live</span> requiring agent/AI action
          </div>
        </div>

        <div className="dashboard-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Closed Today</span>
            <CheckCircle2 size={18} color="#16a34a" />
          </div>
          <p className="kpi-value">{stats.closedToday}</p>
          <div className="kpi-footer">
            <span className="kpi-trend-positive">+12%</span> vs yesterday
          </div>
        </div>

        <div className="dashboard-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Webhook Calls Today</span>
            <Radio size={18} color="#ea580c" />
          </div>
          <p className="kpi-value">{stats.webhookCalls.toLocaleString()}</p>
          <div className="kpi-footer">
            <span className="kpi-trend-neutral">99.9%</span> delivery rate
          </div>
        </div>

        <div className="dashboard-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Total Customers</span>
            <Users size={18} color="#6366f1" />
          </div>
          <p className="kpi-value">{stats.totalCustomers}</p>
          <div className="kpi-footer">
            <span className="kpi-trend-positive">+24 new</span> added today
          </div>
        </div>
      </div>

      {/* 4. MAIN CONTENT (2-COLUMN) */}
      <div className="dashboard-content-grid">
        
        {/* LEFT COLUMN: Recent Conversations Table */}
        <div className="dashboard-card">
          <div className="table-toolbar">
            <span className="card-title" style={{ margin: 0 }}>Recent Conversations</span>
            
            <div className="filter-group">
              <button 
                className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
                onClick={() => setFilterStatus("all")}
              >
                All
              </button>
              <button 
                className={`filter-btn ${filterStatus === "open" ? "active" : ""}`}
                onClick={() => setFilterStatus("open")}
              >
                Open
              </button>
              <button 
                className={`filter-btn ${filterStatus === "closed" ? "active" : ""}`}
                onClick={() => setFilterStatus("closed")}
              >
                Closed
              </button>

              <select 
                className="select-compact"
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
              >
                <option value="all">All Channels</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram</option>
                <option value="webchat">WebChat</option>
                <option value="telegram">Telegram</option>
              </select>
            </div>
          </div>

          <div className="conversations-table-wrapper">
            <table className="conversations-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Channel</th>
                  <th>Last Message</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredConversations.map((conv) => (
                  <tr key={conv.id}>
                    <td>
                      <div className="customer-cell">
                        <img 
                          src={`https://ui-avatars.com/api/?background=6366F1&color=fff&name=${conv.name}`} 
                          alt="" 
                          className="customer-avatar"
                        />
                        <div>
                          <p className="customer-name">{conv.name}</p>
                          <p className="customer-phone">{conv.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge-pill" style={{ backgroundColor: `${conv.channelColor}15`, color: conv.channelColor }}>
                        {conv.channel}
                      </span>
                    </td>
                    <td>
                      <p className="last-message">{conv.lastMsg}</p>
                    </td>
                    <td style={{ color: "var(--dash-text-muted)" }}>{conv.time}</td>
                    <td>
                      <span className={`badge-pill ${conv.status === "open" ? "badge-green" : "badge-blue"}`}>
                        {conv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: Quick Actions & Live Stream */}
        <div className="side-column">
          
          {/* Quick Actions */}
          <div className="dashboard-card">
            <div className="card-title">Quick Actions</div>
            <div className="quick-actions-grid">
              <button className="action-tile">
                <MessageSquare size={16} color="#2563eb" />
                <span>Open Inbox</span>
              </button>
              <button className="action-tile">
                <Send size={16} color="#16a34a" />
                <span>Broadcast</span>
              </button>
              <button className="action-tile">
                <UserPlus size={16} color="#ea580c" />
                <span>Add Lead</span>
              </button>
              <button className="action-tile">
                <Bot size={16} color="#6366f1" />
                <span>AI Rules</span>
              </button>
            </div>
          </div>

          {/* Live Activity Stream */}
          <div className="dashboard-card">
            <div className="card-title">
              <span>Live Feed</span>
              <span className="status-dot dot-connected"></span>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-icon">💬</span>
                <div>
                  <p className="activity-text">New WhatsApp message from <strong>Rahul Sharma</strong></p>
                  <span className="activity-time">2 mins ago</span>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-icon">🤖</span>
                <div>
                  <p className="activity-text">AI replied to query on <strong>WebChat</strong></p>
                  <span className="activity-time">5 mins ago</span>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-icon">⚡</span>
                <div>
                  <p className="activity-text">Webhook payload processed (200 OK)</p>
                  <span className="activity-time">8 mins ago</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
