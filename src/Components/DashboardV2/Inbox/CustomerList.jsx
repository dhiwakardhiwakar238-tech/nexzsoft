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
    const [filter, setFilter] = useState("all");


    /*
        Create quick lookup map

        Example:
        {
            "919999999999": {
                last_message: "Hello",
                updated_at: "2026-08-05T10:30:00Z"
            }
        }
    */
    const conversationMap = Object.fromEntries(

        conversations.map((conversation) => [

            conversation.customer_number,

            conversation

        ])

    );


    /*
        Only customers who have conversations
        will appear in inbox
    */
    const chatCustomers = customers
    .filter(
        (customer) => conversationMap[customer.phone]
    )
    .sort((a, b) => {

        const aTime =
            new Date(
                conversationMap[a.phone]?.updated_at || 0
            );

        const bTime =
            new Date(
                conversationMap[b.phone]?.updated_at || 0
            );

        return bTime - aTime;

    });


    /*
        Search only inside active chats
    */
    const filteredCustomers = chatCustomers.filter((customer) => {

        const value =
            `${customer.name || ""} ${customer.phone || ""}`
                .toLowerCase();


        return value.includes(search.toLowerCase());

    });

    const displayedCustomers = filteredCustomers.filter((customer) => {

        const conversation = conversationMap[customer.phone];

        if (filter === "unread") {
            return (conversation?.unread_count || 0) > 0;
        }

        return true;

    });

    const formatConversationTime = (updatedAt) => {

        if (!updatedAt) return "";

        const date = new Date(updatedAt);
        const now = new Date();

        const diffMs = now - date;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);

        // Same day → show time
        if (date.toDateString() === now.toDateString()) {

            return date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });

        }

        // Within last 7 days → show weekday
        if (diffHours < 24 * 7) {

            return date.toLocaleDateString([], {
                weekday: "short",
            });

        }

        // Older → show date
        return date.toLocaleDateString([], {
            day: "2-digit",
            month: "short",
        });

    };

    return (

        <div className="customer-list">


            <div className="customer-header">


                <div className="header-title">

                    <RiChatSmile3Fill />

                    <h3>
                        Inbox
                    </h3>

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

                <div className="customer-filters">

                    <button
                        className={`filter-chip ${
                            filter === "all" ? "active" : ""
                        }`}
                        onClick={() => setFilter("all")}
                    >
                        All
                        <span>{filteredCustomers.length}</span>
                    </button>

                    <button
                        className={`filter-chip ${
                            filter === "unread" ? "active" : ""
                        }`}
                        onClick={() => setFilter("unread")}
                    >
                        Unread
                        <span>
                            {
                                filteredCustomers.filter(
                                    (customer) =>
                                        (conversationMap[customer.phone]?.unread_count || 0) > 0
                                ).length
                            }
                        </span>
                    </button>

                </div>

            </div>



            <div className="customer-scroll">


                {filteredCustomers.length === 0 && (

                    <div className="empty-customers">

                        No conversations found

                    </div>

                )}



                {displayedCustomers.map((customer) => {

                    const conversation =
                        conversationMap[customer.phone];

                    const lastMessage =
                        conversation?.last_message || "";

                    const lastMessageTime =
                        conversation?.updated_at;

                    const isUnread =
                        (conversation?.unread_count || 0) > 0;

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

                                    : "C"

                                }


                            </div>

                            <div className="customer-info">

                                <h4 className={isUnread ? "unread-text" : ""}>
                                    {customer.name || customer.phone}
                                </h4>

                                <p className={isUnread ? "unread-text" : ""}>
                                    {lastMessage}
                                </p>

                            </div>

                            <div className="customer-meta">

                                <span
                                    className={`customer-time ${
                                        isUnread ? "unread-time" : ""
                                    }`}
                                >

                                    {formatConversationTime(lastMessageTime)}

                                </span>

                                {conversation?.unread_count > 0 && (

                                    <span className="customer-badge">

                                        {conversation.unread_count}

                                    </span>

                                )}

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}

export default CustomerList;