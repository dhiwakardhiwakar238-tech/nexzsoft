import { useState } from "react";

import "./CustomerList.css";

import {
    RiSearchLine,
    RiChatSmile3Fill
} from "react-icons/ri";

function CustomerList({

    customers,

    conversations,

    selectedCustomer,

    openChat

}) {

    const [search, setSearch] = useState("");

    const filteredCustomers = customers.filter((customer) => {

        const value =
            `${customer.name || ""} ${customer.phone || ""}`
                .toLowerCase();

        return value.includes(search.toLowerCase());

    });

    return (

        <div className="customer-list">

            <div className="customer-header">

                <div className="header-title">

                    <RiChatSmile3Fill />

                    <h3>Inbox</h3>

                    <span className="chat-count-badge">
                        {chatCustomers.length}
                    </span>

                </div>

                <div className="customer-search">

                    <RiSearchLine />

                    <input
                        type="text"
                        placeholder="Search customer..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

            </div>

            <div className="customer-scroll">

                {filteredCustomers.length === 0 && (

                    <div className="empty-customers">

                        No customers found

                    </div>

                )}

                {filteredCustomers.map((customer) => {

                    const conversation = conversations.find(
                        (c) => c.customer_number === customer.phone
                    );

                    const lastMessage =
                        conversation?.last_message ||
                        "No messages yet";

                    return (

                        <div

                            key={customer.id}

                            className={`customer-card ${
                                selectedCustomer === customer.phone
                                    ? "active"
                                    : ""
                            }`}

                            onClick={() =>
                                openChat(customer.phone)
                            }

                        >

                            <div className="customer-avatar">

                                {customer.name
                                    ? customer.name[0].toUpperCase()
                                    : "C"}

                            </div>

                            <div className="customer-info">

                                <h4>

                                    {customer.name ||
                                        customer.phone}

                                </h4>

                                <p>

                                    {lastMessage}

                                </p>

                            </div>

                            <div className="customer-meta">

                                <span className="customer-time">

                                    2m

                                </span>

                                <span className="customer-badge">

                                    2

                                </span>

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}

export default CustomerList;