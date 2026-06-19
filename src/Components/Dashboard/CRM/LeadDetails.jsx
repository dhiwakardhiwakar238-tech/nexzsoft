import "./LeadDetails.css";
import LeadNotes from "./LeadNotes";
import LeadTimeline from "./LeadTimeline";
import LeadChat from "./LeadChat";
import LeadTasks from "./LeadTasks";
import DealValue from "./DealValue";
import LeadOwner from "./LeadOwner";
import AILeadScore from "./AILeadScore";
import MeetingScheduler from "./MeetingScheduler";
import Customer360 from "./Customer360";
import Documents from "./Documents";
import AISalesCopilot from "./AISalesCopilot";
import AIFollowUp from "./AIFollowUp";
import AIProposal from "./AIProposal";
import TicketSystem from "./TicketSystem";
import CallAnalytics from "./CallAnalytics";
import CustomerSuccess from "./CustomerSuccess";
import RevenueIntelligence from "./RevenueIntelligence";




function LeadDetails({ lead, closeDrawer }) {
  if (!lead) return null;

  return (
    <div className="lead-drawer-overlay">

      <div className="lead-drawer">

        <button
          className="drawer-close"
          onClick={closeDrawer}
        >
          ✖
        </button>

        {/* HEADER */}
        <div className="lead-profile-header">

          <div className="lead-avatar">
            {lead.name?.charAt(0)}
          </div>

          <div>
            <h2>{lead.name}</h2>
            <p className="lead-company">
              {lead.company}
            </p>
          </div>

        </div>

        {/* SCORE + STATUS */}

        <div className="lead-stats">

          <div className="stat-card">
            <h4>Lead Score</h4>
            <span>92%</span>
          </div>

          <div className="stat-card">
            <h4>Status</h4>
            <span className="status-badge">
              New Lead
            </span>
          </div>

        </div>

        {/* CUSTOMER DETAILS */}

        <div className="lead-section">
          <h3>Email</h3>
          <p>
            {lead.email ||
              "contact@samsung.com"}
          </p>
        </div>

        <div className="lead-section">
          <h3>Phone</h3>
          <p>
            {lead.phone ||
              "+91 9876543210"}
          </p>
        </div>

        <div className="lead-section">
          <h3>Lead Source</h3>
          <p>Demo Request</p>
        </div>

        <div className="lead-section">
          <h3>Assigned Agent</h3>
          <p>Arun Kumar</p>
        </div>

        <div className="lead-section">
          <h3>Deal Value</h3>
          <p>
            ₹ {lead.value || "450000"}
          </p>
        </div>

        <div className="lead-section">
          <h3>Next Follow Up</h3>
          <p>25 June 2026</p>
        </div>

        {/* NOTES */}

        <div className="lead-section">
          <h3>Internal Notes</h3>

          <p>
            Customer interested in
            WhatsApp Business API,
            CRM Automation and AI
            Knowledge Base.
          </p>
        </div>

        <LeadNotes />
        <LeadTimeline />
        <LeadChat/>
        <LeadTasks/>
        <DealValue/>
        <LeadOwner/>
        <AILeadScore/>
        <MeetingScheduler/>
        <Customer360/>
        <Documents/>
        <AISalesCopilot/>
        <AIFollowUp/>
        <AIProposal/>
        <TicketSystem/>
        <CallAnalytics/>
        <CustomerSuccess/>
        <RevenueIntelligence/>
        

        {/* TIMELINE */}

        <div className="timeline-section">

          <h3>Activity Timeline</h3>

          <div className="timeline-item">
            <span>09:30 AM</span>
            <p>Demo Request Submitted</p>
          </div>

          <div className="timeline-item">
            <span>10:15 AM</span>
            <p>Sales Team Assigned</p>
          </div>

          <div className="timeline-item">
            <span>11:00 AM</span>
            <p>Customer Contacted</p>
          </div>

          <div className="timeline-item">
            <span>12:30 PM</span>
            <p>Proposal Sent</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default LeadDetails;