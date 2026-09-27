import "./Inbox.css";

import CustomerList from "./CustomerList";
import ChatWindow from "./ChatWindow";

function Inbox({
    customers,
    conversations,
    selectedCustomer,
    setSelectedCustomer,
    chat,
    openChat,
    message,
    setMessage,
    sendMessage,
    aiPaused,
    onToggleAiPause,
    tickets,
    onCreateTicket,
    onOpenTicket
}) {

    return (

        <div className="inbox-layout">
            <CustomerList

                customers={customers}

                conversations={conversations}

                selectedCustomer={selectedCustomer}

                setSelectedCustomer={setSelectedCustomer}

                openChat={openChat}

                tickets={tickets}

            />
            <ChatWindow
                chat={chat}
                selectedCustomer={selectedCustomer}
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
                aiPaused={aiPaused}
                onToggleAiPause={onToggleAiPause}
                tickets={tickets}
                onCreateTicket={onCreateTicket}
                onOpenTicket={onOpenTicket}
            />

        </div>

    );

}

export default Inbox;
