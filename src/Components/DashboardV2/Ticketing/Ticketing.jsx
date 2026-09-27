import {
    useMemo,
    useState
} from "react";

import {
    Plus,
    Pencil,
    Search,
    X,
    Ticket,
    Clock3,
    CheckCircle2,
    AlertCircle,
    UserRound,
    MessageSquareText
} from "lucide-react";

import "./Ticketing.css";


function Ticketing({
    tickets = [],
    onCreateTicket,
    onOpenTicket
}) {

    /* =====================================================
       STATE
    ===================================================== */

    const [search, setSearch] =
        useState("");


    /* =====================================================
       SUMMARY
    ===================================================== */

    const summary = useMemo(() => {

        return {

            open:
                tickets.filter(
                    ticket =>
                        ticket.status === "Open"
                ).length,

            inProgress:
                tickets.filter(
                    ticket =>
                        ticket.status ===
                        "In Progress"
                ).length,

            waiting:
                tickets.filter(
                    ticket =>
                        ticket.status ===
                        "Waiting for Customer"
                ).length,

            resolved:
                tickets.filter(
                    ticket =>
                        ticket.status ===
                            "Resolved" ||
                        ticket.status ===
                            "Closed"
                ).length

        };

    }, [tickets]);


    /* =====================================================
       SEARCH + STATUS PRIORITY SORT
    ===================================================== */

    const filteredTickets =
        useMemo(() => {

            const value =
                search
                    .trim()
                    .toLowerCase();


            /*
             * First filter by search.
             */

            const filtered =
                !value
                    ? [...tickets]
                    : tickets.filter(ticket => {

                        return [

                            ticket.ticket_number,
                            ticket.ticketNumber,

                            ticket.title,

                            ticket.description,

                            ticket.status,

                            ticket.assigned_to,
                            ticket.assignedTo,

                            ticket.customer_phone,
                            ticket.customerPhone,

                            ticket.channel,

                            ticket.note

                        ]
                            .filter(Boolean)
                            .join(" ")
                            .toLowerCase()
                            .includes(value);

                    });


            /*
             * Status priority:
             *
             * 1. Open
             * 2. In Progress
             * 3. Waiting for Customer
             * 4. Resolved
             * 5. Closed
             */

            const statusPriority = {

                "Open": 1,

                "In Progress": 2,

                "Waiting for Customer": 3,

                "Resolved": 4,

                "Closed": 5

            };


            /*
             * Sort by:
             *
             * 1. Status priority
             * 2. Ticket number descending
             */

            filtered.sort(
                (a, b) => {

                    const statusA =
                        statusPriority[
                            a.status
                        ] ?? 99;

                    const statusB =
                        statusPriority[
                            b.status
                        ] ?? 99;


                    /*
                     * Different statuses:
                     * status priority decides.
                     */

                    if (
                        statusA !==
                        statusB
                    ) {

                        return (
                            statusA -
                            statusB
                        );

                    }


                    /*
                     * Same status:
                     * highest ticket number first.
                     *
                     * Example:
                     * TKT-000010 before TKT-000007
                     */

                    const numberA =
                        parseInt(
                            String(
                                a.ticket_number ||
                                a.ticketNumber ||
                                ""
                            ).match(/\d+$/)?.[0] ||
                            "0",
                            10
                        );

                    const numberB =
                        parseInt(
                            String(
                                b.ticket_number ||
                                b.ticketNumber ||
                                ""
                            ).match(/\d+$/)?.[0] ||
                            "0",
                            10
                        );


                    return (
                        numberB -
                        numberA
                    );

                }
            );


            return filtered;

        }, [
            tickets,
            search
        ]);


    /* =====================================================
       HELPERS
    ===================================================== */

    const getTicketNumber = (
        ticket
    ) => {

        return (
            ticket.ticket_number ||
            ticket.ticketNumber ||
            "-"
        );

    };


    const getAssignedTo = (
        ticket
    ) => {

        return (
            ticket.assigned_to ||
            ticket.assignedTo ||
            "Unassigned"
        );

    };


    const getStatusClass = (
        status
    ) => {

        switch (status) {

            case "Open":
                return "status-open";

            case "In Progress":
                return "status-progress";

            case "Waiting for Customer":
                return "status-waiting";

            case "Resolved":
                return "status-resolved";

            case "Closed":
                return "status-closed";

            default:
                return "";

        }

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="ticketing-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="ticketing-header">

                <div>

                    <h1>
                        Ticketing
                    </h1>

                    <p>
                        Track unresolved customer issues
                        and follow them through to closure.
                    </p>

                </div>


                <button
                    className="ticketing-primary-btn"
                    onClick={() =>
                        onCreateTicket?.()
                    }
                >

                    <Plus size={17} />

                    New Ticket

                </button>

            </div>


            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="ticketing-summary">

                <div className="ticket-summary-card">

                    <div className="ticket-summary-icon open">
                        <AlertCircle size={18} />
                    </div>

                    <div>

                        <span>
                            Open
                        </span>

                        <strong>
                            {summary.open}
                        </strong>

                    </div>

                </div>


                <div className="ticket-summary-card">

                    <div className="ticket-summary-icon progress">
                        <Clock3 size={18} />
                    </div>

                    <div>

                        <span>
                            In Progress
                        </span>

                        <strong>
                            {summary.inProgress}
                        </strong>

                    </div>

                </div>


                <div className="ticket-summary-card">

                    <div className="ticket-summary-icon waiting">
                        <MessageSquareText size={18} />
                    </div>

                    <div>

                        <span>
                            Waiting
                        </span>

                        <strong>
                            {summary.waiting}
                        </strong>

                    </div>

                </div>


                <div className="ticket-summary-card">

                    <div className="ticket-summary-icon resolved">
                        <CheckCircle2 size={18} />
                    </div>

                    <div>

                        <span>
                            Resolved
                        </span>

                        <strong>
                            {summary.resolved}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================================
                TICKETS
            ================================================= */}

            <div className="ticketing-card">

                <div className="ticketing-card-header">

                    <div>

                        <h2>
                            Tickets
                        </h2>

                        <span>
                            {filteredTickets.length} ticket
                            {filteredTickets.length !== 1
                                ? "s"
                                : ""}
                        </span>

                    </div>


                    <div className="ticket-search">

                        <Search size={16} />
                    
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={search}
                            onChange={e =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />
                    
                        {search && (
                            <button
                                type="button"
                                className="ticket-search-clear"
                                onClick={() => setSearch("")}
                                title="Clear search"
                            >
                                <X size={15} />
                            </button>
                        )}
                    
                    </div>

                </div>


                <div className="ticket-table-wrapper">

                    <table className="ticket-table">

                        <thead>

                            <tr>

                                <th>
                                    Ticket Number
                                </th>

                                <th>
                                    Title
                                </th>

                                <th>
                                    Description
                                </th>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Assigned To
                                </th>

                                <th>
                                    WhatsApp Number
                                </th>

                                <th>
                                    Note
                                </th>

                                <th>
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredTickets.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="9"
                                        className="ticket-empty"
                                    >

                                        <Ticket size={28} />

                                        <strong>
                                            No tickets found
                                        </strong>

                                        <span>
                                            Create a ticket when
                                            a customer issue needs
                                            follow-up.
                                        </span>

                                    </td>

                                </tr>

                            ) : (

                                filteredTickets.map(
                                    ticket => (

                                        <tr
                                            key={`${ticket.tenant_id}-${getTicketNumber(ticket)}`}
                                        >

                                            {/* =========================
                                                TICKET NUMBER
                                            ========================= */}

                                            <td>

                                                <button
                                                    className="ticket-number"
                                                    onClick={() =>
                                                        onOpenTicket?.(
                                                            ticket
                                                        )
                                                    }
                                                >

                                                    {getTicketNumber(
                                                        ticket
                                                    )}

                                                </button>

                                            </td>


                                            {/* =========================
                                                TITLE
                                            ========================= */}

                                            <td>

                                                <div className="ticket-title">

                                                    {ticket.title || "-"}

                                                </div>

                                            </td>


                                            {/* =========================
                                                DESCRIPTION
                                            ========================= */}

                                            <td>

                                                <div
                                                    className="ticket-description"
                                                    title={
                                                        ticket.description ||
                                                        ""
                                                    }
                                                >

                                                    {
                                                        ticket.description ||
                                                        "-"
                                                    }

                                                </div>

                                            </td>


                                            {/* =========================
                                                DATE
                                            ========================= */}

                                            <td>

                                                {formatDate(
                                                    ticket.created_at ||
                                                    ticket.date
                                                )}

                                            </td>


                                            {/* =========================
                                                STATUS
                                            ========================= */}

                                            <td>

                                                <span
                                                    className={`ticket-status ${getStatusClass(
                                                        ticket.status
                                                    )}`}
                                                >

                                                    {ticket.status || "-"}

                                                </span>

                                            </td>


                                            {/* =========================
                                                ASSIGNED TO
                                            ========================= */}

                                            <td>

                                                <div className="ticket-assignee">

                                                    <UserRound
                                                        size={14}
                                                    />

                                                    {
                                                        getAssignedTo(
                                                            ticket
                                                        )
                                                    }

                                                </div>

                                            </td>


                                            {/* =========================
                                                CHANNEL
                                            ========================= 

                                            <td>

                                                <span className="ticket-channel">

                                                    {
                                                        ticket.channel ||
                                                        "-"
                                                    }

                                                </span>

                                            </td>*/}

                                            {/* =========================
                                                WhatsApp Number
                                            ========================= */}

                                            <td>

                                                <span className="ticket-whatsapp-number">

                                                    {
                                                        ticket.customer_phone ||
                                                        "-"
                                                    }

                                                </span>

                                            </td>


                                            {/* =========================
                                                NOTE
                                            ========================= */}

                                            <td>

                                                <div
                                                    className="ticket-note"
                                                    title={
                                                        ticket.note ||
                                                        ""
                                                    }
                                                >

                                                    {
                                                        ticket.note ||
                                                        "-"
                                                    }

                                                </div>

                                            </td>


                                            {/* =========================
                                                EDIT
                                            ========================= */}

                                            <td>

                                                <button
                                                    className="ticket-edit-btn"
                                                    title="Edit ticket"
                                                    onClick={() =>
                                                        onOpenTicket?.(
                                                            ticket
                                                        )
                                                    }
                                                >

                                                    <Pencil
                                                        size={16}
                                                    />

                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}


/* =====================================================
   DATE FORMAT
===================================================== */

function formatDate(value) {

    if (!value) {
        return "-";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return value;
    }


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];


    return `${day}-${months[date.getMonth()]}-${date.getFullYear()}`;

}


export default Ticketing;
