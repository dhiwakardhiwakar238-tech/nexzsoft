
import {
    useEffect,
    useState
} from "react";

import {
    Plus,
    X,
    Ticket,
    CheckCircle2
} from "lucide-react";

import toast from "react-hot-toast";

import "./TicketModal.css";

import {
    createTicket,
    saveTicket
} from "../../../services/api";


function TicketModal({
    mode = null,
    ticket = null,
    customerPhone = "",
    onClose = null,
    onSaved = null
}) {

    const [saving, setSaving] =
        useState(false);


    /* =====================================================
       CREATE FORM
    ===================================================== */

    const [newTicket, setNewTicket] =
        useState({
            customerPhone: "",
            title: "",
            description: ""
        });


    /* =====================================================
       EDIT FORM
    ===================================================== */

    const [editForm, setEditForm] =
        useState({
            title: "",
            description: "",
            status: "",
            assignedTo: "",
            channel: "",
            note: ""
        });


    /* =====================================================
       INITIALIZE MODAL
    ===================================================== */

    useEffect(() => {

        if (mode === "create") {

            setNewTicket({
                customerPhone:
                    customerPhone || "",
                title: "",
                description: ""
            });

            return;
        }


        if (mode === "edit" && ticket) {

            setEditForm({

                title:
                    ticket.title || "",

                description:
                    ticket.description || "",

                status:
                    ticket.status || "Open",

                assignedTo:
                    ticket.assigned_to ||
                    ticket.assignedTo ||
                    "",

                channel:
                    ticket.channel ||
                    "WhatsApp",

                note:
                    ticket.note || ""

            });

        }

    }, [
        mode,
        ticket,
        customerPhone
    ]);


    /* =====================================================
       CLOSE
    ===================================================== */

    const closeModal = () => {

        if (saving) {
            return;
        }

        onClose?.();

    };


    /* =====================================================
       CREATE CHANGE
    ===================================================== */

    const handleNewTicketChange = (
        field,
        value
    ) => {

        setNewTicket(prev => ({
            ...prev,
            [field]: value
        }));

    };


    /* =====================================================
       EDIT CHANGE
    ===================================================== */

    const handleEditChange = (
        field,
        value
    ) => {

        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));

    };


    /* =====================================================
       CREATE TICKET
    ===================================================== */

    const handleCreateTicket = async () => {

        const customerPhoneValue =
            newTicket.customerPhone.trim();

        const title =
            newTicket.title.trim();

        const description =
            newTicket.description.trim();


        if (!customerPhoneValue) {

            toast.error(
                "Please enter customer phone number"
            );

            return;
        }


        if (!title) {

            toast.error(
                "Please enter a ticket title"
            );

            return;
        }


        if (!description) {

            toast.error(
                "Please enter a description"
            );

            return;
        }


        try {

            setSaving(true);


            const tenantId =
                localStorage.getItem("tenantId");


            if (!tenantId) {

                toast.error(
                    "Unable to identify tenant"
                );

                return;
            }


            await createTicket(
                tenantId,
                {
                    customerPhone:
                        customerPhoneValue,

                    title,

                    description
                }
            );


            toast.success(
                "Ticket created successfully"
            );


            onSaved?.({
                action: "created"
            });


        } catch (error) {

            console.error(
                "Failed to create ticket:",
                error
            );


            toast.error(
                error?.response?.data?.message ||
                "Failed to create ticket"
            );

        } finally {

            setSaving(false);

        }

    };


    /* =====================================================
       SAVE TICKET
    ===================================================== */

    const handleSaveUpdate = async () => {

        if (!ticket) {
            return;
        }


        try {

            setSaving(true);


            const tenantId =
                localStorage.getItem("tenantId");


            if (!tenantId) {

                toast.error(
                    "Unable to identify tenant"
                );

                return;
            }


            const ticketNumber =
                ticket.ticket_number ||
                ticket.ticketNumber;


            if (!ticketNumber) {

                toast.error(
                    "Unable to identify ticket"
                );

                return;
            }


            await saveTicket(
                tenantId,
                ticketNumber,
                {
                    title:
                        editForm.title.trim(),

                    description:
                        editForm.description.trim(),

                    status:
                        editForm.status,

                    assignedTo:
                        editForm.assignedTo ||
                        null,

                    channel:
                        editForm.channel ||
                        "WhatsApp",

                    note:
                        editForm.note.trim() ||
                        null
                }
            );


            toast.success(
                "Ticket updated successfully"
            );


            onSaved?.({
                action: "updated",
                ticketNumber
            });


        } catch (error) {

            console.error(
                "Failed to save ticket:",
                error
            );


            toast.error(
                error?.response?.data?.message ||
                "Failed to save ticket"
            );

        } finally {

            setSaving(false);

        }

    };


    /* =====================================================
       NOTHING OPEN
    ===================================================== */

    if (
        mode !== "create" &&
        mode !== "edit"
    ) {

        return null;

    }


    /* =====================================================
       CREATE MODAL
    ===================================================== */

    if (mode === "create") {

        return (

            <div
                className="ticket-modal-overlay"
                onMouseDown={e => {

                    if (
                        e.target ===
                        e.currentTarget &&
                        !saving
                    ) {

                        closeModal();

                    }

                }}
            >

                <div className="ticket-modal">

                    <div className="ticket-modal-header">

                        <div>

                            <h2>
                                New Ticket
                            </h2>

                            <p>
                                Create a ticket for an
                                unresolved customer issue.
                            </p>

                        </div>


                        <button
                            className="ticket-modal-close"
                            disabled={saving}
                            onClick={closeModal}
                        >

                            <X size={19} />

                        </button>

                    </div>


                    <div className="ticket-form">

                        <div className="ticket-form-group">

                            <label>
                                Customer Phone
                            </label>

                            <input
                                type="text"
                                placeholder="Enter customer phone number"
                                value={
                                    newTicket.customerPhone
                                }
                                disabled={saving}
                                onChange={e =>
                                    handleNewTicketChange(
                                        "customerPhone",
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="ticket-form-group">

                            <label>
                                Title
                            </label>

                            <input
                                type="text"
                                placeholder="Enter ticket title"
                                value={
                                    newTicket.title
                                }
                                disabled={saving}
                                onChange={e =>
                                    handleNewTicketChange(
                                        "title",
                                        e.target.value
                                    )
                                }
                                autoFocus
                            />

                        </div>


                        <div className="ticket-form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                placeholder="Describe the customer issue..."
                                value={
                                    newTicket.description
                                }
                                disabled={saving}
                                onChange={e =>
                                    handleNewTicketChange(
                                        "description",
                                        e.target.value
                                    )
                                }
                                rows="6"
                            />

                        </div>

                    </div>


                    <div className="ticket-modal-footer">

                        <button
                            className="ticket-secondary-btn"
                            disabled={saving}
                            onClick={closeModal}
                        >
                            Cancel
                        </button>


                        <button
                            className="ticketing-primary-btn"
                            disabled={
                                saving ||
                                !newTicket.customerPhone.trim() ||
                                !newTicket.title.trim() ||
                                !newTicket.description.trim()
                            }
                            onClick={
                                handleCreateTicket
                            }
                        >

                            <Plus size={17} />

                            {saving
                                ? "Creating..."
                                : "Create Ticket"}

                        </button>

                    </div>

                </div>

            </div>

        );

    }


    /* =====================================================
       EDIT MODAL
    ===================================================== */

    return (

        <div
            className="ticket-modal-overlay"
            onMouseDown={e => {

                if (
                    e.target ===
                    e.currentTarget &&
                    !saving
                ) {

                    closeModal();

                }

            }}
        >

            <div className="ticket-modal ticket-edit-modal">

                <div className="ticket-modal-header">

                    <div>

                        <div className="ticket-edit-number">

                            <Ticket size={16} />

                            {
                                ticket.ticket_number ||
                                ticket.ticketNumber ||
                                "-"
                            }

                        </div>

                        <h2>
                            Edit Ticket
                        </h2>

                        <p>
                            Update ticket details,
                            assignment and status.
                        </p>

                    </div>


                    <button
                        className="ticket-modal-close"
                        disabled={saving}
                        onClick={closeModal}
                    >

                        <X size={19} />

                    </button>

                </div>


                <div className="ticket-form">

                    <div className="ticket-form-group">

                        <label>
                            Title
                        </label>

                        <input
                            type="text"
                            value={
                                editForm.title
                            }
                            disabled={saving}
                            onChange={e =>
                                handleEditChange(
                                    "title",
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <div className="ticket-form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            rows="5"
                            value={
                                editForm.description
                            }
                            disabled={saving}
                            onChange={e =>
                                handleEditChange(
                                    "description",
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <div className="ticket-form-grid">

                        <div className="ticket-form-group">

                            <label>
                                Status
                            </label>

                            <select
                                value={
                                    editForm.status
                                }
                                disabled={saving}
                                onChange={e =>
                                    handleEditChange(
                                        "status",
                                        e.target.value
                                    )
                                }
                            >

                                <option>
                                    Open
                                </option>

                                <option>
                                    In Progress
                                </option>

                                <option>
                                    Waiting for Customer
                                </option>

                                <option>
                                    Resolved
                                </option>

                                <option>
                                    Closed
                                </option>

                            </select>

                        </div>


                        <div className="ticket-form-group">

                            <label>
                                Assigned To
                            </label>

                            <select
                                value={
                                    editForm.assignedTo
                                }
                                disabled={saving}
                                onChange={e =>
                                    handleEditChange(
                                        "assignedTo",
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Unassigned
                                </option>

                            </select>

                        </div>


                        <div className="ticket-form-group">

                            <label>
                                Channel
                            </label>

                            <select
                                value={
                                    editForm.channel
                                }
                                disabled={saving}
                                onChange={e =>
                                    handleEditChange(
                                        "channel",
                                        e.target.value
                                    )
                                }
                            >

                                <option>
                                    WhatsApp
                                </option>

                                <option>
                                    Instagram
                                </option>

                                <option>
                                    Facebook
                                </option>

                                <option>
                                    Messenger
                                </option>

                                <option>
                                    Website
                                </option>

                                <option>
                                    Email
                                </option>

                                <option>
                                    Phone
                                </option>

                                <option>
                                    Other
                                </option>

                            </select>

                        </div>

                    </div>


                    <div className="ticket-form-group">

                        <label>
                            Note
                        </label>

                        <textarea
                            rows="4"
                            placeholder="Add an internal note..."
                            value={
                                editForm.note
                            }
                            disabled={saving}
                            onChange={e =>
                                handleEditChange(
                                    "note",
                                    e.target.value
                                )
                            }
                        />

                        <span className="ticket-field-help">
                            Internal note visible to agents.
                        </span>

                    </div>

                </div>


                <div className="ticket-modal-footer">

                    <button
                        className="ticket-secondary-btn"
                        disabled={saving}
                        onClick={closeModal}
                    >
                        Cancel
                    </button>


                    <button
                        className="ticketing-primary-btn"
                        disabled={saving}
                        onClick={
                            handleSaveUpdate
                        }
                    >

                        <CheckCircle2 size={17} />

                        {saving
                            ? "Saving..."
                            : "Save Update"}

                    </button>

                </div>

            </div>

        </div>

    );

}


export default TicketModal;
