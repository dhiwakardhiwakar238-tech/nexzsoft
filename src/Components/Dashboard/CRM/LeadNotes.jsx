import "./LeadNotes.css";

function LeadNotes() {
  return (
    <div className="notes-wrapper">

      <h3>📝 Activity Timeline</h3>

      <div className="timeline">

        <div className="timeline-item">
          <div className="timeline-dot"></div>

          <div className="timeline-content">
            <h4>Lead Created</h4>
            <p>
              Customer submitted demo request.
            </p>
            <span>Today</span>
          </div>
        </div>

        <div className="timeline-item">
          <div className="timeline-dot"></div>

          <div className="timeline-content">
            <h4>Sales Follow-up</h4>
            <p>
              Initial contact completed.
            </p>
            <span>2 Hours Ago</span>
          </div>
        </div>

      </div>

    </div>
  );
}

export default LeadNotes;