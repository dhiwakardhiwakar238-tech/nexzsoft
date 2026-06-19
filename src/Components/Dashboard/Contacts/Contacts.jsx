import "./Contacts.css";

function Contacts() {
  const contacts = [
    {
      id: 1,
      name: "Customer A",
      phone: "+91 9876543210",
      source: "WhatsApp",
    },
    {
      id: 2,
      name: "Customer B",
      phone: "+91 9876543211",
      source: "Facebook",
    },
    {
      id: 3,
      name: "Customer C",
      phone: "+91 9876543212",
      source: "Instagram",
    },
  ];

  return (
    <div className="contacts-page">

      <div className="contacts-header">
        <h1>👥 Contacts</h1>

        <button className="add-contact-btn">
          + Add Contact
        </button>
      </div>

      <div className="contacts-table">

        <div className="table-head">
          <span>Name</span>
          <span>Phone</span>
          <span>Source</span>
          <span>Action</span>
        </div>

        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="table-row"
          >
            <span>{contact.name}</span>
            <span>{contact.phone}</span>
            <span>{contact.source}</span>

            <button>
              View
            </button>
          </div>
        ))}

      </div>

    </div>
  );
}

export default Contacts;