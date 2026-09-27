import { useEffect, useState } from "react";
import { getCustomers } from "../../../services/api";

import "./Contacts.css";

function Contacts() {

  const [contacts, setContacts] =
    useState([]);

  useEffect(() => {


    loadContacts();


  }, []);

  const loadContacts =
    async () => {


      const data =
        await getCustomers();

      if (data)
        setContacts(data);

    };


  return (<div className="contacts-page">


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
        <span>Created</span>
        <span>Action</span>
      </div>

      {contacts.map((contact) => (

        <div
          key={contact.id}
          className="table-row"
        >

          <span>
            {contact.name || "Customer"}
          </span>

          <span>
            {contact.phone}
          </span>

          <span>
            {new Date(
              contact.created_at
            ).toLocaleDateString()}
          </span>

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
