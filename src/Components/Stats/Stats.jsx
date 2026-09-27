import "./Stats.css";
import {
  MessageCircle,
  Globe,
  Database,
  Cloud,
  Bot,
  Mail,
  Smartphone,
  CreditCard,
  ShoppingCart,
  Workflow,
  BarChart3,
  Settings,
  Users,
  Shield,
  Server,
  Bell,
  Package,
  FileText,
  Monitor,
  Link,
} from "lucide-react";

const integrations = [
  { icon: <MessageCircle size={36} />, name: "WhatsApp" },
  { icon: <Globe size={36} />, name: "Google" },
  { icon: <Database size={36} />, name: "CRM" },
  { icon: <Cloud size={36} />, name: "Cloud" },
  { icon: <Bot size={36} />, name: "OpenAI" },
  { icon: <Mail size={36} />, name: "Email" },
  { icon: <Smartphone size={36} />, name: "SMS" },
  { icon: <CreditCard size={36} />, name: "Payments" },
  { icon: <ShoppingCart size={36} />, name: "Shopify" },
  { icon: <Workflow size={36} />, name: "Zapier" },
  { icon: <BarChart3 size={36} />, name: "Analytics" },
  { icon: <Settings size={36} />, name: "API" },
  { icon: <Users size={36} />, name: "HubSpot" },
  { icon: <Shield size={36} />, name: "Security" },
  { icon: <Server size={36} />, name: "Server" },
  { icon: <Bell size={36} />, name: "Notifications" },
  { icon: <Package size={36} />, name: "ERP" },
  { icon: <FileText size={36} />, name: "Documents" },
  { icon: <Monitor size={36} />, name: "Dashboard" },
  { icon: <Link size={36} />, name: "Integrations" },
];

function Stats() {
  return (
    <section className="integrations">
      <div className="container">
        
        {/* Header Block */}
        <div className="header-block">
          <div className="badge">
            <span>⚡ Ecosystem</span>
          </div>
          <h2>Integrate with Your Business Ecosystem</h2>
          <p className="subtitle">
            Connect Nexzsoft with your favorite business applications and
            automate everything from one powerful platform.
          </p>
        </div>

        {/* First Marquee Row */}
        <div className="marquee">
          <div className="track">
            {[...integrations, ...integrations].map((item, index) => (
              <div className="logo-card" key={index}>
                <div className="icon-box">{item.icon}</div>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Second Marquee Row (Reverse) */}
        <div className="marquee reverse">
          <div className="track">
            {[...integrations, ...integrations].map((item, index) => (
              <div className="logo-card" key={`rev-${index}`}>
                <div className="icon-box">{item.icon}</div>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default Stats;