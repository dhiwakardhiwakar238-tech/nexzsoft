import "./MeetingScheduler.css";
import { useState } from "react";

function MeetingScheduler() {

  const [meeting, setMeeting] =
    useState({
      type: "",
      date: "",
      time: "",
    });

  const scheduleMeeting = () => {

    if (
      !meeting.type ||
      !meeting.date ||
      !meeting.time
    ) {
      alert("Fill all fields");
      return;
    }

    alert(
      `${meeting.type} scheduled successfully`
    );
  };

  return (
    <div className="meeting-card">

      <h3>📅 Meeting Scheduler</h3>

      <select
        value={meeting.type}
        onChange={(e) =>
          setMeeting({
            ...meeting,
            type: e.target.value,
          })
        }
      >
        <option value="">
          Select Meeting Type
        </option>

        <option>
          Product Demo
        </option>

        <option>
          Sales Call
        </option>

        <option>
          Follow Up
        </option>

        <option>
          Technical Discussion
        </option>
      </select>

      <input
        type="date"
        value={meeting.date}
        onChange={(e) =>
          setMeeting({
            ...meeting,
            date: e.target.value,
          })
        }
      />

      <input
        type="time"
        value={meeting.time}
        onChange={(e) =>
          setMeeting({
            ...meeting,
            time: e.target.value,
          })
        }
      />

      <button
        className="schedule-btn"
        onClick={scheduleMeeting}
      >
        Schedule Meeting
      </button>

    </div>
  );
}

export default MeetingScheduler;