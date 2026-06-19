import { useState } from "react";
import "./AddLeadModal.css";

function AddLeadModal({ closeModal }) {

  const [lead, setLead] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    value: ""
  });

  const handleChange = (e) => {
    setLead({
      ...lead,
      [e.target.name]: e.target.value
    });
  };

  const saveLead = () => {

    const oldLeads =
      JSON.parse(
        localStorage.getItem("crmLeads")
      ) || [];

    oldLeads.push(lead);

    localStorage.setItem(
      "crmLeads",
      JSON.stringify(oldLeads)
    );

    alert("Lead Added Successfully");

    closeModal();
  };

  return (
    <div className="lead-overlay">

      <div className="lead-modal">

        <button
          className="close-modal"
          onClick={closeModal}
        >
          ✖
        </button>

        <h2>Add New Lead</h2>

        <input
          name="name"
          placeholder="Lead Name"
          onChange={handleChange}
        />

        <input
          name="company"
          placeholder="Company"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
        />

        <input
          name="value"
          placeholder="Deal Value ₹"
          onChange={handleChange}
        />

        <button
          className="save-lead-btn"
          onClick={saveLead}
        >
          Save Lead
        </button>

      </div>

    </div>
  );
}

export default AddLeadModal;