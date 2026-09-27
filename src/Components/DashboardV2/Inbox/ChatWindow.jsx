import "./ChatWindow.css";

import EmojiPicker from "emoji-picker-react";

import {
    RiSendPlaneFill,
    RiAttachment2,
    RiEmotionHappyLine,
    RiArrowDownSLine,
    RiArrowUpSLine,
    RiPhoneLine,
    RiVideoLine,
    RiSearchLine,
    RiCloseLine,
    RiMore2Fill,
    RiPauseCircleLine,
    RiPlayCircleLine,
    RiTicket2Line
} from "react-icons/ri";

import { MessageCircle } from "lucide-react";

import { Fragment, useEffect, useRef, useState } from "react";


function ChatWindow({
    chat,
    message,
    setMessage,
    sendMessage,
    selectedCustomer,
    tickets = [],
    aiPaused,
    onToggleAiPause,
    onCreateTicket,
    onOpenTicket
}) {

    console.log("🔥 ChatWindow rendered", chat);
    console.log("SELECTED CUSTOMER:", selectedCustomer);
    console.log("TICKETS:", tickets);

    tickets.forEach((ticket) => {
        console.log({
            ticket_number: ticket.ticket_number,
            customer_phone: ticket.customer_phone,
            status: ticket.status,
            selectedCustomer: selectedCustomer,
            phoneMatch:
                String(ticket.customer_phone) ===
                String(selectedCustomer),
        });
    });

    const bottomRef = useRef(null);

    const chatBodyRef = useRef(null);

    const inputRef = useRef(null);

    const searchInputRef = useRef(null);

    const messageRefs = useRef({});


    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const [showScrollButton, setShowScrollButton] = useState(false);


    // ==========================================
    // SEARCH STATE
    // ==========================================

    const [showSearch, setShowSearch] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");

    const [currentSearchIndex, setCurrentSearchIndex] = useState(0);


    // ==========================================
    // EMOJI
    // ==========================================

    const handleEmojiClick = (emojiData) => {

        const emoji = emojiData.emoji;

        const input = inputRef.current;

        if (!input) {

            setMessage((prev) => prev + emoji);

            return;
        }

        const start = input.selectionStart;

        const end = input.selectionEnd;

        const newMessage =
            message.substring(0, start) +
            emoji +
            message.substring(end);

        setMessage(newMessage);

        setShowEmojiPicker(false);

        requestAnimationFrame(() => {

            const newCursorPosition =
                start + emoji.length;

            input.focus();

            input.setSelectionRange(
                newCursorPosition,
                newCursorPosition
            );

        });

    };


    // ==========================================
    // SEARCH RESULTS
    // ==========================================

    const normalizedSearchTerm =
        searchTerm.trim().toLowerCase();


    const searchResults = normalizedSearchTerm
        ? chat.reduce((results, msg, index) => {

            const text = msg.text || "";

            if (
                text
                    .toLowerCase()
                    .includes(normalizedSearchTerm)
            ) {
                results.push(index);
            }

            return results;

        }, [])
        : [];


    const searchResultCount =
        searchResults.length;


    // ==========================================
    // RESET SEARCH WHEN CUSTOMER CHANGES
    // ==========================================

    useEffect(() => {

        setShowSearch(false);

        setSearchTerm("");

        setCurrentSearchIndex(0);

        messageRefs.current = {};

    }, [selectedCustomer]);


    // ==========================================
    // RESET SEARCH POSITION WHEN SEARCH CHANGES
    // ==========================================

    useEffect(() => {

        setCurrentSearchIndex(0);

    }, [normalizedSearchTerm]);


    // ==========================================
    // FOCUS SEARCH INPUT
    // ==========================================

    useEffect(() => {

        if (showSearch) {

            requestAnimationFrame(() => {

                searchInputRef.current?.focus();

            });

        }

    }, [showSearch]);


    // ==========================================
    // ESCAPE TO CLOSE SEARCH
    // ==========================================

    useEffect(() => {

        const handleKeyDown = (event) => {

            if (
                event.key === "Escape" &&
                showSearch
            ) {

                closeSearch();

            }

        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, [showSearch]);


    // ==========================================
    // SCROLL TO SEARCH RESULT
    // ==========================================

    const scrollToSearchResult = (resultIndex) => {

        if (
            !searchResults.length ||
            resultIndex < 0 ||
            resultIndex >= searchResults.length
        ) {
            return;
        }

        const messageIndex =
            searchResults[resultIndex];

        const element =
            messageRefs.current[messageIndex];

        if (!element) {
            return;
        }

        element.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    };


    // ==========================================
    // PREVIOUS SEARCH RESULT
    // ==========================================

    const goToPreviousSearchResult = () => {

        if (!searchResults.length) {
            return;
        }

        const previousIndex =
            currentSearchIndex === 0
                ? searchResults.length - 1
                : currentSearchIndex - 1;

        setCurrentSearchIndex(previousIndex);

        requestAnimationFrame(() => {

            scrollToSearchResult(previousIndex);

        });

    };


    // ==========================================
    // NEXT SEARCH RESULT
    // ==========================================

    const goToNextSearchResult = () => {

        if (!searchResults.length) {
            return;
        }

        const nextIndex =
            currentSearchIndex ===
            searchResults.length - 1
                ? 0
                : currentSearchIndex + 1;

        setCurrentSearchIndex(nextIndex);

        requestAnimationFrame(() => {

            scrollToSearchResult(nextIndex);

        });

    };


    // ==========================================
    // OPEN SEARCH
    // ==========================================

    const openSearch = () => {

        setShowSearch(true);

    };


    // ==========================================
    // CLOSE SEARCH
    // ==========================================

    const closeSearch = () => {

        setShowSearch(false);

        setSearchTerm("");

        setCurrentSearchIndex(0);

    };


    // ==========================================
    // SEARCH INPUT
    // ==========================================

    const handleSearchChange = (event) => {

        setSearchTerm(event.target.value);

    };


    // ==========================================
    // SEARCH KEYBOARD NAVIGATION
    // ==========================================

    const handleSearchKeyDown = (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            if (event.shiftKey) {

                goToPreviousSearchResult();

            } else {

                goToNextSearchResult();

            }

        }

    };


    // ==========================================
    // HIGHLIGHT SEARCH TEXT
    // ==========================================

    const highlightText = (text) => {

        if (!normalizedSearchTerm) {
            return text;
        }

        const escapedSearchTerm =
            normalizedSearchTerm.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

        const parts = text.split(
            new RegExp(
                `(${escapedSearchTerm})`,
                "gi"
            )
        );

        return parts.map((part, index) => {

            if (
                part.toLowerCase() ===
                normalizedSearchTerm
            ) {

                return (
                    <mark key={index}>
                        {part}
                    </mark>
                );

            }

            return (
                <Fragment key={index}>
                    {part}
                </Fragment>
            );

        });

    };


    // ==========================================
    // AUTO SCROLL TO BOTTOM WHEN CHAT CHANGES
    // ==========================================

    useEffect(() => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [chat]);


    // ==========================================
    // CHAT SCROLL DETECTION
    // ==========================================

    useEffect(() => {

        const body = chatBodyRef.current;

        if (!body) return;

        const handleScroll = () => {

            const distance =
                body.scrollHeight -
                body.scrollTop -
                body.clientHeight;

            setShowScrollButton(
                distance > 250
            );

        };

        body.addEventListener(
            "scroll",
            handleScroll
        );

        return () =>
            body.removeEventListener(
                "scroll",
                handleScroll
            );

    }, []);


    // ==========================================
    // SCROLL TO BOTTOM
    // ==========================================

    const scrollToBottom = () => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    };


    // ==========================================
    // FORMAT MESSAGE DATE
    // ==========================================

    const formatMessageDate = (date) => {

        const messageDate =
            new Date(date);

        const today =
            new Date();

        const yesterday =
            new Date();

        yesterday.setDate(
            today.getDate() - 1
        );

        const isToday =
            messageDate.toDateString() ===
            today.toDateString();

        const isYesterday =
            messageDate.toDateString() ===
            yesterday.toDateString();

        if (isToday) {
            return "Today";
        }

        if (isYesterday) {
            return "Yesterday";
        }

        return messageDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    };

    const currentCustomerPhone = selectedCustomer
        ? String(selectedCustomer)
        : null;
    
    const nonClosedTickets = tickets.filter(
        (ticket) =>
            currentCustomerPhone &&
            String(ticket.customer_phone) === currentCustomerPhone &&
            ticket.status !== "Closed"
    );
    
    const activeTicket =
        nonClosedTickets.length > 0
            ? [...nonClosedTickets].sort(
                (a, b) =>
                    new Date(b.updated_at) -
                    new Date(a.updated_at)
            )[0]
            : null;
    
    const getTicketStatusClass = (status) => {
        switch (status) {
            case "Open":
                return "open";
    
            case "In Progress":
                return "in-progress";
    
            case "Waiting for Customer":
                return "waiting";
    
            case "Resolved":
                return "resolved";
    
            case "Closed":
                return "closed";
    
            default:
                return "default";
        }
    };

    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="chat-window">

            {/* ==========================================
                HEADER
            ========================================== */}
            {selectedCustomer && (
                <div className="chat-header">
    
                    <div className="chat-user">
    
                        <div className="chat-avatar">
    
                            {selectedCustomer
                                ? selectedCustomer[0].toUpperCase()
                                : "C"}
    
                        </div>
    
                        <div>
    
                            <h3>
                                {selectedCustomer}
                            </h3>
    
                            <div className="chat-user-meta">

                                <span className="chat-status">
                                    <span className="status-dot"></span>
                                    Active Customer
                                </span>
                                                        
                            </div>
    
                        </div>
    
                    </div>

                    <div className="chat-user-meta">
                        {activeTicket && (
                                    <button
                                        type="button"
                                        className={`chat-ticket-context status-${getTicketStatusClass(activeTicket.status)}`}
                                        onClick={() => {
                                    
                                            if (!activeTicket) {
                                                return;
                                            }
                                    
                                            onOpenTicket?.(
                                                activeTicket.ticket_number ||
                                                activeTicket.ticketNumber
                                            );
                                    
                                        }}
                                    >
                                        <span className="chat-ticket-icon">
                                            <RiTicket2Line />
                                        </span>
                            
                                        <span className="chat-ticket-number">
                                            {activeTicket.ticket_number}
                                        </span>
                            
                                        <span className="chat-ticket-separator">
                                            ·
                                        </span>
                            
                                        <span className="chat-ticket-status">
                                            {activeTicket.status}
                                        </span>
                            
                                        {nonClosedTickets.length > 1 && (
                                            <span className="chat-ticket-count">
                                                +{nonClosedTickets.length - 1}
                                            </span>
                                        )}
                                    </button>
                                )}
                            
                                {!activeTicket && (
                                    <button
                                        type="button"
                                        className="chat-create-ticket"
                                        onClick={() => {
                                    
                                            if (!selectedCustomer) {
                                                return;
                                            }
                                    
                                            onCreateTicket?.();
                                    
                                        }}
                                    >
                                        <span>+</span>
                                        Create Ticket
                                    </button>
                                )}
                    </div>
    
    
                    <div className="chat-actions">
    
                        {/* ==========================================
                            SEARCH
                        ========================================== */}
    
                        {showSearch && selectedCustomer && (
    
                            <div className="chat-search-box">
    
                                <RiSearchLine className="chat-search-icon" />
    
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onKeyDown={handleSearchKeyDown}
                                    placeholder="Search..."
                                />
    
                                {normalizedSearchTerm && (
    
                                    <span className="search-result-count">
    
                                        {searchResultCount > 0
                                            ? `${currentSearchIndex + 1}/${searchResultCount}`
                                            : "0/0"}
    
                                    </span>
    
                                )}
    
                                {normalizedSearchTerm &&
                                    searchResultCount > 0 && (
    
                                        <>
    
                                            <button
                                                type="button"
                                                className="search-nav-btn"
                                                onClick={goToPreviousSearchResult}
                                                title="Previous match"
                                            >
                                                <RiArrowUpSLine />
                                            </button>
    
                                            <button
                                                type="button"
                                                className="search-nav-btn"
                                                onClick={goToNextSearchResult}
                                                title="Next match"
                                            >
                                                <RiArrowDownSLine />
                                            </button>
    
                                        </>
    
                                    )}
    
                                <button
                                    type="button"
                                    className="search-close-btn"
                                    onClick={closeSearch}
                                    title="Close search"
                                >
                                    <RiCloseLine />
                                </button>
    
                            </div>
    
                        )} 
    
                        {/* ==========================================
                            PHONE
                        ==========================================
    
                        <button
                            type="button"
                            className="action-btn"
                        >
                            <RiPhoneLine />
                        </button>*/}
    
    
                        {/* ==========================================
                            VIDEO
                        ==========================================
    
                        <button
                            type="button"
                            className="action-btn"
                        >
                            <RiVideoLine />
                        </button>*/}
    
    
                        {/* ==========================================
                            SEARCH BUTTON
                        ========================================== */}
    
                        <button
                            type="button"
                            className={
                                showSearch
                                    ? "action-btn search-active"
                                    : "action-btn"
                            }
                            onClick={openSearch}
                            title="Search conversation"
                        >
                            <RiSearchLine />
                        </button>

                        {/* ==========================================
                            AI PAUSE / RESUME
                        ========================================== */}
    
                        {selectedCustomer && (
    
                            <button
                                type="button"
                                className={
                                    aiPaused
                                        ? "action-btn ai-pause-btn is-paused"
                                        : "action-btn ai-pause-btn"
                                }
                                onClick={onToggleAiPause}
                                title={
                                    aiPaused
                                        ? "Resume AI replies for this chat"
                                        : "Pause AI replies for this chat"
                                }
                            >
    
                                {aiPaused
                                    ? <RiPlayCircleLine />
                                    : <RiPauseCircleLine />}
    
                            </button>
    
                        )}
    
    
                        {/* ==========================================
                            MORE
                        ==========================================
    
                        <button
                            type="button"
                            className="action-btn"
                        >
                            <RiMore2Fill />
                        </button>*/}
    
                    </div>
    
                </div>

            )}
            
            {/* ==========================================
                MESSAGES
            ========================================== */}

            <div
                className="chat-body"
                ref={chatBodyRef}
            >

                {!selectedCustomer ? (

                    <div className="empty-chat">

                        <div className="empty-chat-icon">

                            <MessageCircle
                                size={22}
                                strokeWidth={1.8}
                            />

                        </div>

                        <h3>
                            Select a conversation
                        </h3>

                        <p>
                            Choose a customer from the list to
                            view and manage their conversation.
                        </p>

                    </div>

                ) : chat.length === 0 ? (

                    <div className="empty-chat">

                        <div className="empty-chat-icon">

                            <MessageCircle
                                size={22}
                                strokeWidth={1.8}
                            />

                        </div>

                        <h3>
                            No messages yet
                        </h3>

                        <p>
                            Start the conversation by sending
                            a message below.
                        </p>

                    </div>

                ) : (

                    <>

                        {chat.map((msg, index) => {

                            const isSearchMatch =
                                searchResults.includes(index);

                            const isCurrentSearchMatch =
                                searchResults[
                                    currentSearchIndex
                                ] === index;

                            return (

                                <Fragment key={index}>

                                    {/* DATE DIVIDER */}

                                    {
                                        (
                                            index === 0 ||
                                            new Date(
                                                chat[index - 1].created_at
                                            ).toDateString() !==
                                            new Date(
                                                msg.created_at
                                            ).toDateString()
                                        ) && (

                                            <div className="date-divider">

                                                {formatMessageDate(
                                                    msg.created_at
                                                )}

                                            </div>

                                        )
                                    }


                                    {/* MESSAGE */}

                                    <div
                                        ref={(element) => {

                                            if (element) {

                                                messageRefs.current[index] =
                                                    element;

                                            } else {

                                                delete messageRefs.current[index];

                                            }

                                        }}
                                        className={`
                                            ${["assistant", "agent"].includes(msg.sender)
                                                ? "msg right"
                                                : "msg left"
                                            }
                                            ${isSearchMatch
                                                ? "search-match-message"
                                                : ""
                                            }
                                            ${isCurrentSearchMatch
                                                ? "active-search-message"
                                                : ""
                                            }
                                        `}
                                    >

                                        <div
                                            className={
                                                msg.sender === "assistant"
                                                    ? "bubble outgoing ai-message"
                                                    : msg.sender === "agent"
                                                        ? "bubble outgoing agent-message"
                                                        : "bubble incoming"
                                            }
                                        >

                                            {/* AI LABEL */}

                                            {msg.sender === "assistant" && (

                                                <div className="message-sender ai-sender">
                                                    AI Assistant
                                                </div>

                                            )}


                                            {/* AGENT LABEL */}

                                            {msg.sender === "agent" && (

                                                <div className="message-sender agent-sender">
                                                    Agent
                                                </div>

                                            )}


                                            {/* MESSAGE TEXT */}

                                            <p>
                                                {highlightText(
                                                    msg.text || ""
                                                )}
                                            </p>


                                            {/* MESSAGE FOOTER */}

                                            <div className="msg-footer">

                                                <small>

                                                    {msg.created_at
                                                        ? new Date(
                                                            msg.created_at
                                                        ).toLocaleTimeString(
                                                            [],
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )
                                                        : ""}

                                                </small>


                                                {["assistant", "agent"].includes(
                                                    msg.sender
                                                ) && (

                                                    <span className="ticks">

                                                        {msg.status === "sent" && (

                                                            <span
                                                                style={{
                                                                    color: "#000000"
                                                                }}
                                                            >
                                                                <b>✓</b>
                                                            </span>

                                                        )}

                                                        {msg.status === "delivered" && (

                                                            <span
                                                                style={{
                                                                    color: "#000000"
                                                                }}
                                                            >
                                                                <b>✓✓</b>
                                                            </span>

                                                        )}

                                                        {msg.status === "read" && (

                                                            <span
                                                                style={{
                                                                    color: "#53bdeb"
                                                                }}
                                                            >
                                                                <b>✓✓</b>
                                                            </span>

                                                        )}

                                                        {msg.status === "failed" &&
                                                            "❌"}

                                                    </span>

                                                )}

                                            </div>

                                        </div>

                                    </div>

                                </Fragment>

                            );

                        })}


                        {/* TYPING INDICATOR */}

                        {/*
                        <div className="typing-bubble">
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <small>AI is typing...</small>
                        </div>
                        */}


                        <div ref={bottomRef}></div>


                        {/* SCROLL TO BOTTOM */}

                        {showScrollButton && (

                            <button
                                type="button"
                                className="scroll-bottom-btn"
                                onClick={scrollToBottom}
                            >
                                <RiArrowDownSLine />
                            </button>

                        )}

                    </>

                )}

            </div>


            {/* ==========================================
                FOOTER
            ========================================== */}

            {selectedCustomer && (

                <div className="chat-footer">

                    {/* EMOJI */}

                    <div className="emoji-picker-wrapper">

                        <button
                            type="button"
                            className="chat-tool"
                            onClick={() =>
                                setShowEmojiPicker(
                                    (prev) => !prev
                                )
                            }
                        >

                            <RiEmotionHappyLine />

                        </button>


                        {showEmojiPicker && (

                            <div className="emoji-picker-popup">

                                <EmojiPicker
                                    onEmojiClick={handleEmojiClick}
                                    width={320}
                                    height={400}
                                    previewConfig={{
                                        showPreview: false
                                    }}
                                />

                            </div>

                        )}

                    </div>


                    {/* ATTACHMENT */}

                    <button
                        type="button"
                        className="chat-tool"
                    >
                        <RiAttachment2 />
                    </button>


                    {/* MESSAGE INPUT */}

                    <input
                        ref={inputRef}
                        className="chat-input"
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        placeholder="Type a message..."
                        onKeyDown={(e) => {

                            if (e.key === "Enter") {

                                sendMessage();

                            }

                        }}
                    />


                    {/* SEND */}

                    <button
                        type="button"
                        className="send-circle"
                        onClick={sendMessage}
                    >
                        <RiSendPlaneFill />
                    </button>

                </div>

            )}

        </div>

    );

}


export default ChatWindow;
