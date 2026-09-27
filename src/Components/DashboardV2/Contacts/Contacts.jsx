import "./Contacts.css";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

import {
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomers,
    getCustomerDetails,
    getConversations,
    getCustomerLabels,
    createCustomerLabel,
    deleteCustomerLabel,
    addCustomerNote,
    importCustomers,
    exportCustomers
} from "../../../services/api";

import { getErrorMessage } from "../../../config/apiConfig";
import { COUNTRIES } from "../../../constants/countries";

function Contacts({ openChat }) {

    // ======================================================
    // BASIC STATE
    // ======================================================

    const [newNote, setNewNote] = useState("");
    const [search, setSearch] = useState("");

    const [customers, setCustomers] = useState([]);
    const [conversations, setConversations] = useState([]);

    const [contactsSelected, setContactsSelected] =
        useState(null);

    const [customerDetails, setCustomerDetails] =
        useState(null);

    // ======================================================
    // LOADING
    // ======================================================

    const [contactsLoading, setContactsLoading] =
        useState(false);

    // ======================================================
    // IMPORT STATE
    // ======================================================

    const [importedContacts, setImportedContacts] =
        useState([]);

    const [showImportModal, setShowImportModal] =
        useState(false);

    const [importLoading, setImportLoading] =
        useState(false);

    const [importResult, setImportResult] =
        useState(null);

    // ======================================================
    // EXPORT STATE
    // ======================================================

    const [exportLoading, setExportLoading] =
        useState(false);

    // ======================================================
    // CONTACT MODAL
    // ======================================================

    const [contactsShowModal, setContactsShowModal] =
        useState(false);

    const [contactsEditMode, setContactsEditMode] =
        useState(false);

    const [contactsForm, setContactsForm] = useState({
        id: null,
        name: "",
        phone: "",
        email: "",
        labels: [],
        country: "IN"
    });

    // ======================================================
    // SUCCESS MODAL
    // ======================================================

    const [showSuccessModal, setShowSuccessModal] =
        useState(false);

    const [successMessage, setSuccessMessage] =
        useState("");

    // ======================================================
    // DELETE MODAL
    // ======================================================

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [deleteLoading, setDeleteLoading] =
        useState(false);

    // ======================================================
    // LABEL STATE
    // ======================================================

    const [showLabelDropdown, setShowLabelDropdown] =
        useState(false);

    const [labels, setLabels] = useState([]);

    const [newLabel, setNewLabel] = useState("");

    const [showManageLabels, setShowManageLabels] =
        useState(false);

    // ======================================================
    // EXTRA STATE
    // ======================================================

    const [contactsV10List, setContactsV10List] =
        useState([]);

    // ======================================================
    // HELPERS
    // ======================================================

    const getTenantId = () => {
        return localStorage.getItem("tenantId");
    };

    const normalizeWhatsappPhone = (phone, countryCode) => {

        const country =
            COUNTRIES.find(
                (item) =>
                    item.code === countryCode
            );

        let value =
            String(phone || "")
                .trim()
                .replace(/\D/g, "");

        if (!value || !country) {
            return value;
        }

        const dialCode =
            country.dialCode.replace(
                /\D/g, ""
            );

        if (value.startsWith(dialCode)) {
            return value;
        }

        if (value.startsWith("0")) {
            value = value.substring(1);
        }

        return dialCode + value;
    };

    const showMessage = (message) => {
        setSuccessMessage(message);
        setShowSuccessModal(true);
    };

    const normalizeLabels = (customerLabels) => {

        if (Array.isArray(customerLabels)) {

            return customerLabels
                .map((label) => {

                    if (
                        typeof label === "object" &&
                        label !== null
                    ) {
                        return Number(
                            label.id ??
                            label.label_id
                        );
                    }

                    return Number(label);
                })
                .filter(
                    (id) =>
                        Number.isFinite(id)
                );
        }

        if (
            customerLabels !== null &&
            customerLabels !== undefined &&
            customerLabels !== ""
        ) {

            const number =
                Number(customerLabels);

            return Number.isFinite(number)
                ? [number]
                : [];
        }

        return [];
    };

    // ======================================================
    // LOAD CONTACTS
    // ======================================================

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {

        try {

            setContactsLoading(true);

            const tenantId =
                getTenantId();

            if (!tenantId) {

                console.error(
                    "Tenant ID not found."
                );

                return;
            }

            const [
                customerData,
                conversationData
            ] = await Promise.all([
                getCustomers(tenantId),
                getConversations(tenantId)
            ]);

            const safeCustomers =
                Array.isArray(customerData)
                    ? customerData
                    : [];

            const safeConversations =
                Array.isArray(conversationData)
                    ? conversationData
                    : [];

            setCustomers(
                safeCustomers
            );

            setConversations(
                safeConversations
            );

            setContactsV10List(
                safeCustomers
            );

        }
        catch (err) {

            console.error(
                "LOAD CONTACTS ERROR:",
                err
            );

            setCustomers([]);
            setConversations([]);

        }
        finally {

            setContactsLoading(false);

        }

    };

    // ======================================================
    // LOAD LABELS
    // ======================================================

    useEffect(() => {
        loadLabels();
    }, []);

    const loadLabels = async () => {

        try {

            const tenantId =
                getTenantId();

            if (!tenantId) {
                console.log("Contacts: Tenant ID missing");
                return;
            }

            const response =
                await getCustomerLabels(
                    tenantId
                );
            console.log(
                "CUSTOMER LABELS RESPONSE =",
                response
            );

            /*
             * API may return:
             *
             * [
             *   ...
             * ]
             *
             * OR
             *
             * {
             *   labels: [...]
             * }
             */

            const labelData =
                Array.isArray(response)
                    ? response
                    : Array.isArray(response?.data)
                        ? response.data
                        : [];

            console.log(
                "CUSTOMER LABELS DATA =",
                labelData
            );

            setLabels(
                labelData
            );

        }
        catch (err) {

            console.error(
                "LOAD LABELS ERROR:",
                err
            );

            setLabels([]);

        }

    };

    // ======================================================
    // IMPORT FILE
    // ======================================================

    const handleImportFile = async (e) => {

        const file =
            e.target.files?.[0];

        if (!file) {
            return;
        }

        try {

            const extension =
                file.name
                    .split(".")
                    .pop()
                    .toLowerCase();

            let rows = [];

            // ==================================================
            // JSON
            // ==================================================

            if (extension === "json") {

                const text =
                    await file.text();

                const parsed =
                    JSON.parse(text);

                if (!Array.isArray(parsed)) {

                    throw new Error(
                        "JSON file must contain an array of contacts."
                    );
                }

                rows = parsed;

            }

            // ==================================================
            // CSV / XLS / XLSX
            // ==================================================

            else if (
                extension === "csv" ||
                extension === "xls" ||
                extension === "xlsx"
            ) {

                const buffer =
                    await file.arrayBuffer();

                const workbook =
                    XLSX.read(
                        buffer,
                        {
                            type: "array"
                        }
                    );

                const sheetName =
                    workbook.SheetNames[0];

                if (!sheetName) {

                    throw new Error(
                        "No worksheet found in the file."
                    );
                }

                const worksheet =
                    workbook.Sheets[
                        sheetName
                    ];

                rows =
                    XLSX.utils.sheet_to_json(
                        worksheet,
                        {
                            defval: ""
                        }
                    );

            }

            else {

                throw new Error(
                    "Only CSV, Excel or JSON files are supported."
                );

            }

            if (!rows.length) {

                throw new Error(
                    "The selected file does not contain any contacts."
                );

            }

            // ==================================================
            // NORMALIZE
            // ==================================================

            const normalizedContacts =
                rows
                    .map((row) => {

                        const name =
                            row.name ??
                            row.Name ??
                            row.NAME ??
                            row["Customer Name"] ??
                            row["customer_name"] ??
                            "";

                        const phone =
                            row.phone ??
                            row.Phone ??
                            row.PHONE ??
                            row.whatsapp ??
                            row.Whatsapp ??
                            row.WHATSAPP ??
                            row["WhatsApp Number"] ??
                            row["WhatsApp"] ??
                            row["Phone Number"] ??
                            row["phone_number"] ??
                            "";

                        const email =
                            row.email ??
                            row.Email ??
                            row.EMAIL ??
                            row["Email Address"] ??
                            "";

                        return {

                            name:
                                String(name)
                                    .trim(),

                            phone:
                                String(phone)
                                    .trim(),

                            email:
                                String(email)
                                    .trim(),

                            labels: []

                        };

                    })
                    .filter(
                        (contact) =>
                            contact.name ||
                            contact.phone ||
                            contact.email
                    );

            if (!normalizedContacts.length) {

                throw new Error(
                    "No valid contacts were found in the file."
                );

            }

            setImportedContacts(
                normalizedContacts
            );

            setImportResult(null);

            setShowImportModal(true);

        }
        catch (err) {

            console.error(
                "IMPORT FILE ERROR:",
                err
            );

            showMessage(
                err.message ||
                "Unable to read import file."
            );

        }

        e.target.value = "";

    };

    // ======================================================
    // BULK IMPORT
    // ======================================================

    const handleBulkImport = async () => {

        if (
            !importedContacts.length ||
            importLoading
        ) {
            return;
        }

        try {

            setImportLoading(true);

            const tenantId =
                getTenantId();

            if (!tenantId) {

                throw new Error(
                    "Tenant ID not found. Please login again."
                );

            }

            const response =
                await importCustomers({

                    tenantId,

                    contacts:
                        importedContacts

                });

            setImportResult(
                response || {}
            );

            await loadContacts();

        }
        catch (err) {

            console.error(
                "BULK IMPORT ERROR:",
                err
            );

            showMessage(

                getErrorMessage(err)

            );

        }
        finally {

            setImportLoading(false);

        }

    };

    // ======================================================
    // EXPORT CUSTOMERS
    // ======================================================

    const handleExportCustomers = async () => {

        if (exportLoading) {
            return;
        }

        try {

            const tenantId =
                getTenantId();

            if (!tenantId) {

                showMessage(
                    "Tenant ID not found. Please login again."
                );

                return;
            }

            setExportLoading(true);

            console.log(
                "Starting customer export..."
            );

            console.log(
                "Tenant ID:",
                tenantId
            );

            const response =
                await exportCustomers(
                    tenantId
                );

            // ==================================================
            // BLOB
            // ==================================================

            const blob =
                response.data instanceof Blob
                    ? response.data
                    : new Blob(
                        [response.data],
                        {
                            type:
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        }
                    );

            // ==================================================
            // DOWNLOAD URL
            // ==================================================

            const url =
                window.URL.createObjectURL(
                    blob
                );

            const link =
                document.createElement("a");

            link.href = url;

            // ==================================================
            // DEFAULT FILE NAME
            // ==================================================

            const today =
                new Date()
                    .toISOString()
                    .split("T")[0];

            let fileName =
                `customers_${today}.xlsx`;

            // ==================================================
            // SERVER FILE NAME
            // ==================================================

            const contentDisposition =
                response.headers?.[
                    "content-disposition"
                ];

            if (contentDisposition) {

                const match =
                    contentDisposition.match(
                        /filename\*?=(?:UTF-8'')?["']?([^;"']+)["']?/i
                    );

                if (match?.[1]) {

                    try {

                        fileName =
                            decodeURIComponent(
                                match[1]
                            );

                    }
                    catch {

                        fileName =
                            match[1];

                    }

                }

            }

            link.setAttribute(
                "download",
                fileName
            );

            document.body.appendChild(
                link
            );

            link.click();

            link.remove();

            window.URL.revokeObjectURL(
                url
            );

            console.log(
                "Customer export completed successfully."
            );

        }
        catch (err) {

            console.error(
                "CUSTOMER EXPORT ERROR:",
                err
            );

            let errorMessage =
                "Unable to export customers.";

            try {

                const errorData =
                    err.response?.data;

                if (
                    errorData instanceof Blob
                ) {

                    const text =
                        await errorData.text();

                    try {

                        const parsed =
                            JSON.parse(text);

                        errorMessage =
                            parsed?.error?.message ||
                            parsed.message ||
                            parsed.error ||
                            errorMessage;

                    }
                    catch {

                        if (text) {
                            errorMessage =
                                text;
                        }

                    }

                }
                else {

                    errorMessage =
                        err.response?.data?.error?.message ||
                        err.response?.data?.message ||
                        err.response?.data?.error ||
                        err.message ||
                        errorMessage;

                }

            }
            catch (parseError) {

                console.error(
                    "EXPORT ERROR PARSING FAILED:",
                    parseError
                );

            }

            showMessage(
                errorMessage
            );

        }
        finally {

            setExportLoading(false);

        }

    };

    // ======================================================
    // OPEN CUSTOMER DRAWER
    // ======================================================

    const openCustomerDrawer = async (
        customer
    ) => {

        if (!customer?.id) {
            return;
        }

        try {

            const data =
                await getCustomerDetails(
                    customer.id
                );

            setCustomerDetails(
                data
            );

            setContactsSelected(
                customer
            );

        }
        catch (err) {

            console.error(
                "CUSTOMER DETAILS ERROR:",
                err
            );

            showMessage(

                getErrorMessage(err)

            );

        }

    };

    // ======================================================
    // OPEN ADD CUSTOMER MODAL
    // ======================================================

    const openAddCustomerModal = () => {

        setContactsEditMode(
            false
        );

        setContactsForm({

            id: null,

            name: "",

            phone: "",

            email: "",

            labels: [],

            country: "IN"

        });

        setShowLabelDropdown(
            false
        );

        setShowManageLabels(
            false
        );

        setContactsShowModal(
            true
        );

    };

    // ======================================================
    // EDIT CUSTOMER
    // ======================================================

    const handleEditCustomer = () => {

        const customer =
            customerDetails?.customer;

        if (!customer) {
            return;
        }

        setContactsForm({

            id:
                customer.id,

            name:
                customer.name || "",

            phone:
                (() => {
                    const value =
                        String(customer.phone || "");
                    const code =
                        customer.country || "IN";
                    const selectedCountry =
                        COUNTRIES.find(
                            (item) =>
                                item.code === code
                        );
                    const dialCode =
                        selectedCountry?.dialCode?.replace(
                            /\D/g, ""
                        );
                    const digits =
                        value.replace(/\D/g, "");

                    if (
                        dialCode &&
                        digits.startsWith(dialCode)
                    ) {
                        return digits.substring(
                            dialCode.length
                        );
                    }

                    return digits;
                })(),

            email:
                customer.email || "",

            labels:
                normalizeLabels(
                    customer.labels
                ),

            country:
                customer.country || "IN"

        });

        setContactsEditMode(
            true
        );

        setShowLabelDropdown(
            false
        );

        setShowManageLabels(
            false
        );

        setContactsShowModal(
            true
        );

        setCustomerDetails(
            null
        );

        setContactsSelected(
            null
        );

    };

    // ======================================================
    // SAVE CUSTOMER
    // ======================================================

    const handleSaveCustomer = async () => {

        const name =
            contactsForm.name.trim();

        const phone =
            contactsForm.phone.trim();

        const email =
            contactsForm.email.trim();

        const country =
            contactsForm.country || "IN";

        const normalizedPhone =
            normalizeWhatsappPhone(
                phone,
                country
            );

        if (!name || !normalizedPhone) {

            showMessage(
                "Customer name and WhatsApp number are required."
            );

            return;
        }

        try {

            const tenantId =
                getTenantId();

            if (!tenantId) {

                throw new Error(
                    "Tenant ID not found. Please login again."
                );

            }

            const payload = {

                id:
                    contactsForm.id,

                name,

                phone:
                    normalizedPhone,

                email,

                country,

                labels:
                    contactsForm.labels,

                tenantId

            };

            // ==================================================
            // UPDATE
            // ==================================================

            if (contactsEditMode) {

                await updateCustomer(
                    payload
                );

                setSuccessMessage(
                    "Contact updated successfully."
                );

            }

            // ==================================================
            // CREATE
            // ==================================================

            else {

                await createCustomer({

                    name,

                    phone,

                    email,

                    country,

                    labels:
                        contactsForm.labels,

                    tenantId

                });

                setSuccessMessage(
                    "Contact added successfully."
                );

            }

            // ==================================================
            // RESET
            // ==================================================

            setContactsShowModal(
                false
            );

            setContactsEditMode(
                false
            );

            setShowLabelDropdown(
                false
            );

            setShowManageLabels(
                false
            );

            setContactsForm({

                id: null,

                name: "",

                phone: "",

                email: "",

                labels: []

            });

            await loadContacts();

            setShowSuccessModal(
                true
            );

        }
        catch (err) {

            console.error(
                "SAVE CUSTOMER ERROR:",
                err
            );

            showMessage(

                getErrorMessage(err)

            );

        }

    };

    // ======================================================
    // DELETE CUSTOMER
    // ======================================================

    const handleDeleteCustomer = () => {

        const customer =
            customerDetails?.customer;

        if (!customer) {
            return;
        }

        setShowDeleteModal(
            true
        );

    };

    // ======================================================
    // CONFIRM DELETE
    // ======================================================

    const confirmDeleteCustomer = async () => {

        const customer =
            customerDetails?.customer;

        if (
            !customer ||
            deleteLoading
        ) {
            return;
        }

        try {

            setDeleteLoading(
                true
            );

            const tenantId =
                getTenantId();

            if (!tenantId) {

                throw new Error(
                    "Tenant ID not found. Please login again."
                );

            }

            await deleteCustomer({

                id:
                    customer.id,

                tenantId

            });

            setShowDeleteModal(
                false
            );

            setCustomerDetails(
                null
            );

            setContactsSelected(
                null
            );

            await loadContacts();

            showMessage(
                "Contact deleted successfully."
            );

        }
        catch (err) {

            console.error(
                "DELETE CUSTOMER ERROR:",
                err
            );

            setShowDeleteModal(
                false
            );

            showMessage(

                getErrorMessage(err)

            );

        }
        finally {

            setDeleteLoading(
                false
            );

        }

    };

    // ======================================================
    // ADD LABEL
    // ======================================================

    const addLabel = async () => {

        const labelName =
            newLabel.trim();

        if (!labelName) {
            return;
        }

        try {

            const tenantId =
                getTenantId();

            if (!tenantId) {

                throw new Error(
                    "Tenant ID not found."
                );

            }

            await createCustomerLabel({

                tenantId,

                name:
                    labelName

            });

            setNewLabel("");

            await loadLabels();

        }
        catch (err) {

            console.error(
                "ADD LABEL ERROR:",
                err
            );

            showMessage(

                getErrorMessage(err)

            );

        }

    };

    // ======================================================
    // DELETE LABEL
    // ======================================================

    const deleteLabel = async (
        id
    ) => {

        try {

            const tenantId =
                getTenantId();

            if (!tenantId) {

                throw new Error(
                    "Tenant ID not found."
                );

            }

            await deleteCustomerLabel(
                id,
                tenantId
            );

            // Remove deleted label from current form
            setContactsForm(
                (previous) => ({
                    ...previous,
                    labels:
                        previous.labels.filter(
                            (labelId) =>
                                Number(labelId) !==
                                Number(id)
                        )
                })
            );

            await loadLabels();

        }
        catch (err) {

            console.error(
                "DELETE LABEL ERROR:",
                err
            );

            showMessage(

                getErrorMessage(err)

            );

        }

    };

    // ======================================================
    // CLOSE CONTACT MODAL
    // ======================================================

    const closeContactModal = () => {

        setContactsShowModal(
            false
        );

        setContactsEditMode(
            false
        );

        setShowLabelDropdown(
            false
        );

        setShowManageLabels(
            false
        );

        setContactsForm({

            id: null,

            name: "",

            phone: "",

            email: "",

            labels: []

        });

    };

    // ======================================================
    // CLOSE IMPORT MODAL
    // ======================================================

    const closeImportModal = () => {

        if (importLoading) {
            return;
        }

        setShowImportModal(
            false
        );

        setImportedContacts(
            []
        );

        setImportResult(
            null
        );

    };

    // ======================================================
    // STATISTICS
    // ======================================================

    const activeToday =
        conversations?.length || 0;

    const leadsCount =
        customers.filter(
            (customer) =>
                customer?.name
        ).length;

    const blockedCount = 0;

    // ======================================================
    // FILTERED CUSTOMERS
    // ======================================================

    const filteredCustomers =
        customers.filter(
            (customer) => {

                const keyword =
                    search
                        .trim()
                        .toLowerCase();

                if (!keyword) {
                    return true;
                }

                const name =
                    String(
                        customer?.name || ""
                    ).toLowerCase();

                const phone =
                    String(
                        customer?.phone || ""
                    ).toLowerCase();

                const email =
                    String(
                        customer?.email || ""
                    ).toLowerCase();

                const label =
                    String(
                        customer?.label_name || ""
                    ).toLowerCase();

                return (
                    name.includes(keyword) ||
                    phone.includes(keyword) ||
                    email.includes(keyword) ||
                    label.includes(keyword)
                );

            }
        );

    // ======================================================
    // RENDER
    // ======================================================

    return (

        <div className="contacts-page">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="contacts-header">

                <div>

                    <h2 className="contacts-title">
                        👥 Contacts
                    </h2>

                    <p className="contacts-subtitle">
                        Manage all your WhatsApp customers.
                    </p>

                </div>

                <button
                    className="contacts-add-btn"
                    onClick={
                        openAddCustomerModal
                    }
                >
                    + Add Contact
                </button>

            </div>

            {/* ==================================================
                STATS
            ================================================== */}

            <div className="contacts-stats">

                <div className="contacts-stat-card contacts-stat-orange">

                    <h2>
                        {
                            customers.length
                        }
                    </h2>

                    <p>
                        Total Contacts
                    </p>

                </div>

                <div className="contacts-stat-card contacts-stat-green">

                    <h2>
                        {
                            activeToday
                        }
                    </h2>

                    <p>
                        Active Today
                    </p>

                </div>

                <div className="contacts-stat-card contacts-stat-orange">

                    <h2>
                        {
                            leadsCount
                        }
                    </h2>

                    <p>
                        Leads
                    </p>

                </div>

                <div className="contacts-stat-card contacts-stat-green">

                    <h2>
                        {
                            blockedCount
                        }
                    </h2>

                    <p>
                        Blocked
                    </p>

                </div>

            </div>

            {/* ==================================================
                TOOLBAR
            ================================================== */}

            <div className="contacts-toolbar">

                <input
                    className="contacts-search-input"
                    placeholder="Search contacts..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />

                <div className="contacts-toolbar-actions">

                    {/* IMPORT */}

                    <button
                        className="contacts-toolbar-btn"
                        type="button"
                        onClick={() =>
                            document
                                .getElementById(
                                    "contacts-import-file"
                                )
                                ?.click()
                        }
                    >
                        Import
                    </button>

                    <input
                        id="contacts-import-file"
                        type="file"
                        accept=".csv,.xls,.xlsx,.json"
                        style={{
                            display: "none"
                        }}
                        onChange={
                            handleImportFile
                        }
                    />

                    {/* EXPORT */}

                    <button
                        className="contacts-toolbar-btn"
                        type="button"
                        onClick={
                            handleExportCustomers
                        }
                        disabled={
                            exportLoading
                        }
                        title={
                            exportLoading
                                ? "Exporting customers..."
                                : "Export customers to Excel"
                        }
                    >

                        {
                            exportLoading
                                ? "Exporting..."
                                : "Export"
                        }

                    </button>

                </div>

            </div>

            {/* ==================================================
                CONTACT TABLE
            ================================================== */}

            <div className="contacts-table-card">

                <table className="contacts-table">

                    <thead>

                        <tr>

                            <th>
                                Name
                            </th>

                            <th>
                                Phone
                            </th>

                            <th>
                                Label
                            </th>

                            <th>
                                Last Message
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {contactsLoading ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    style={{
                                        textAlign:
                                            "center",
                                        padding:
                                            "30px"
                                    }}
                                >
                                    Loading contacts...
                                </td>

                            </tr>

                        ) : filteredCustomers.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    style={{
                                        textAlign:
                                            "center",
                                        padding:
                                            "30px"
                                    }}
                                >
                                    {
                                        search
                                            ? "No contacts found."
                                            : "No contacts available."
                                    }
                                </td>

                            </tr>

                        ) : (

                            filteredCustomers.map(
                                (customer) => {

                                    const convo =
                                        conversations.find(
                                            (conversation) =>
                                                conversation.customer_number ===
                                                customer.phone
                                        );

                                    return (

                                        <tr
                                            key={
                                                customer.id
                                            }
                                            className="contacts-row"
                                        >

                                            <td>

                                                <div className="contacts-name-cell">

                                                    <div className="contacts-avatar-small">

                                                        {
                                                            customer.name
                                                                ? customer.name
                                                                    .charAt(0)
                                                                    .toUpperCase()
                                                                : "C"
                                                        }

                                                    </div>

                                                    <span>

                                                        {
                                                            customer.name ||
                                                            "Unknown"
                                                        }

                                                    </span>

                                                </div>

                                            </td>

                                            <td>
                                                {
                                                    customer.phone ||
                                                    "-"
                                                }
                                            </td>

                                            <td>

                                                <span className="contacts-label">

                                                    {
                                                        customer.label_name ||
                                                        "All Customers"
                                                    }

                                                </span>

                                            </td>

                                            <td>

                                                {
                                                    convo?.last_message ||
                                                    "-"
                                                }

                                            </td>

                                            <td>

                                                <span className="contacts-status-active">
                                                    Active
                                                </span>

                                            </td>

                                            <td>

                                                <button
                                                    className="contacts-chat-btn"
                                                    type="button"
                                                    onClick={() =>
                                                        openCustomerDrawer(
                                                            customer
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                            </td>

                                        </tr>

                                    );

                                }
                            )

                        )}

                    </tbody>

                </table>

            </div>

            {/* ==================================================
                CUSTOMER DRAWER
            ================================================== */}

            {customerDetails && (

                <div className="contacts-drawer">

                    <button
                        className="contacts-drawer-close"
                        type="button"
                        onClick={() => {

                            setCustomerDetails(
                                null
                            );

                            setContactsSelected(
                                null
                            );

                        }}
                    >
                        ✕
                    </button>

                    <div className="contacts-drawer-body">

                        {/* PROFILE */}

                        <div className="contacts-profile-header">

                            <div className="contacts-profile-avatar">

                                {
                                    customerDetails
                                        ?.customer
                                        ?.name

                                        ? customerDetails.customer.name
                                            .charAt(0)
                                            .toUpperCase()

                                        : "C"
                                }

                                <span className="contacts-online-dot"></span>

                            </div>

                            <h2>
                                {
                                    customerDetails
                                        ?.customer
                                        ?.name ||
                                    "Unknown"
                                }
                            </h2>

                            <p>
                                {
                                    customerDetails
                                        ?.customer
                                        ?.phone ||
                                    "-"
                                }
                            </p>

                        </div>

                        {/* STATS */}

                        <div className="contacts-drawer-stats">

                            <div className="contacts-stat-mini">

                                <h3>
                                    {
                                        customerDetails
                                            ?.analytics
                                            ?.totalMessages ||
                                        0
                                    }
                                </h3>

                                <span>
                                    Messages
                                </span>

                            </div>

                            <div className="contacts-stat-mini">

                                <h3>
                                    {
                                        customerDetails
                                            ?.analytics
                                            ?.customerMessages ||
                                        0
                                    }
                                </h3>

                                <span>
                                    Customer Messages
                                </span>

                            </div>

                            <div className="contacts-stat-mini">

                                <h3>
                                    {
                                        customerDetails
                                            ?.analytics
                                            ?.assistantMessages ||
                                        0
                                    }
                                </h3>

                                <span>
                                    AI Replies
                                </span>

                            </div>

                        </div>

                        {/* CUSTOMER DETAILS */}

                        <div className="contacts-info-card">

                            <h4>
                                Customer Details
                            </h4>

                            <div className="contacts-info-row">

                                <span>
                                    👤 Name
                                </span>

                                <strong>
                                    {
                                        customerDetails
                                            ?.customer
                                            ?.name ||
                                        "-"
                                    }
                                </strong>

                            </div>

                            <div className="contacts-info-row">

                                <span>
                                    📞 Phone
                                </span>

                                <strong>
                                    {
                                        customerDetails
                                            ?.customer
                                            ?.phone ||
                                        "-"
                                    }
                                </strong>

                            </div>

                            <div className="contacts-info-row">

                                <span>
                                    ✉ Email
                                </span>

                                <strong>

                                    {
                                        customerDetails
                                            ?.memory
                                            ?.find(
                                                (memory) =>
                                                    memory.memory_key ===
                                                    "email"
                                            )
                                            ?.memory_value ||

                                        customerDetails
                                            ?.customer
                                            ?.email ||

                                        "Not Available"
                                    }

                                </strong>

                            </div>

                            <div className="contacts-info-row">

                                <span>
                                    📍 City
                                </span>

                                <strong>

                                    {
                                        customerDetails
                                            ?.memory
                                            ?.find(
                                                (memory) =>
                                                    memory.memory_key ===
                                                    "city"
                                            )
                                            ?.memory_value ||

                                        "Not Available"
                                    }

                                </strong>

                            </div>

                            <div className="contacts-info-row">

                                <span>
                                    📅 Joined
                                </span>

                                <strong>

                                    {
                                        customerDetails
                                            ?.customer
                                            ?.created_at

                                            ? new Date(
                                                customerDetails.customer.created_at
                                            ).toLocaleDateString()

                                            : "-"
                                    }

                                </strong>

                            </div>

                        </div>

                        {/* QUICK ACTIONS */}

                        <div className="contacts-actions-card">

                            <h4>
                                Quick Actions
                            </h4>

                            <div className="contacts-actions-grid">

                                <button
                                    className="contacts-action-purple"
                                    type="button"
                                    onClick={() => {

                                        if (
                                            openChat &&
                                            customerDetails
                                                ?.customer
                                                ?.phone
                                        ) {

                                            openChat(
                                                customerDetails
                                                    .customer
                                                    .phone
                                            );

                                        }

                                        setCustomerDetails(
                                            null
                                        );

                                        setContactsSelected(
                                            null
                                        );

                                    }}
                                >
                                    💬 Open Chat
                                </button>

                                <button
                                    className="contacts-action-blue"
                                    type="button"
                                >
                                    📢 Broadcast
                                </button>

                                <button
                                    className="contacts-action-white"
                                    type="button"
                                    onClick={
                                        handleEditCustomer
                                    }
                                >
                                    ✏ Edit
                                </button>

                                <button
                                    className="contacts-action-red"
                                    type="button"
                                    onClick={
                                        handleDeleteCustomer
                                    }
                                >
                                    🗑 Delete
                                </button>

                            </div>

                        </div>

                        {/* ANALYTICS */}

                        <div className="contacts-analytics-card">

                            <h4>
                                Customer Analytics
                            </h4>

                            <div className="contacts-analytics-item">

                                <span>
                                    Total Messages
                                </span>

                                <strong>
                                    {
                                        customerDetails
                                            ?.analytics
                                            ?.totalMessages ||
                                        0
                                    }
                                </strong>

                            </div>

                            <div className="contacts-analytics-item">

                                <span>
                                    Customer Messages
                                </span>

                                <strong>
                                    {
                                        customerDetails
                                            ?.analytics
                                            ?.customerMessages ||
                                        0
                                    }
                                </strong>

                            </div>

                            <div className="contacts-analytics-item">

                                <span>
                                    AI Messages
                                </span>

                                <strong>
                                    {
                                        customerDetails
                                            ?.analytics
                                            ?.assistantMessages ||
                                        0
                                    }
                                </strong>

                            </div>

                            <div className="contacts-progress">

                                <div
                                    className="contacts-progress-fill"
                                    style={{
                                        width: `${
                                            customerDetails
                                                ?.analytics
                                                ?.totalMessages

                                                ?

                                                (
                                                    customerDetails.analytics.customerMessages /
                                                    customerDetails.analytics.totalMessages
                                                ) * 100

                                                : 0
                                        }%`
                                    }}
                                ></div>

                            </div>

                        </div>

                        {/* CRM NOTES */}

                        <div className="contacts-notes-card">

                            <div className="contacts-notes-header">

                                <h4>
                                    CRM Notes
                                </h4>

                                <button
                                    className="contacts-note-add"
                                    type="button"
                                    onClick={async () => {

                                        if (
                                            !newNote.trim()
                                        ) {
                                            return;
                                        }

                                        try {

                                            await addCustomerNote(

                                                customerDetails
                                                    .customer
                                                    .id,

                                                newNote.trim()

                                            );

                                            const data =
                                                await getCustomerDetails(
                                                    customerDetails
                                                        .customer
                                                        .id
                                                );

                                            setCustomerDetails(
                                                data
                                            );

                                            setNewNote("");

                                        }
                                        catch (err) {

                                            console.error(
                                                "ADD NOTE ERROR:",
                                                err
                                            );

                                            showMessage(

                                                getErrorMessage(err)

                                            );

                                        }

                                    }}
                                >
                                    Save
                                </button>

                            </div>

                            <input
                                className="contacts-note-input"
                                placeholder="Write CRM Note..."
                                value={
                                    newNote
                                }
                                onChange={(e) =>
                                    setNewNote(
                                        e.target.value
                                    )
                                }
                            />

                            {
                                customerDetails
                                    ?.memory
                                    ?.length > 0

                                    ?

                                    customerDetails.memory.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <div
                                                key={
                                                    item.id ||
                                                    index
                                                }
                                                className="contacts-note"
                                            >

                                                <div className="contacts-note-dot"></div>

                                                <div>

                                                    <strong>
                                                        {
                                                            item.memory_key
                                                        }
                                                    </strong>

                                                    <p>
                                                        {
                                                            item.memory_value
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )

                                    :

                                    <p>
                                        No Memory Found
                                    </p>
                            }

                        </div>

                        {/* RECENT ACTIVITY */}

                        <div className="contacts-activity">

                            <h4>
                                Recent Activity
                            </h4>

                            <ul>

                                <li>
                                    ✅ Broadcast Received
                                </li>

                                <li>
                                    🤖 AI Replied
                                </li>

                                <li>
                                    💬 Manual Reply Sent
                                </li>

                                <li>
                                    📈 Customer Active Today
                                </li>

                            </ul>

                        </div>

                        {/* RECENT CONVERSATIONS */}

                        <div className="contacts-conversation-card">

                            <h4>
                                Recent Conversations
                            </h4>

                            {
                                customerDetails
                                    ?.messages
                                    ?.length > 0

                                    ?

                                    customerDetails.messages.map(
                                        (msg) => (

                                            <div
                                                key={
                                                    msg.id
                                                }
                                                className={`contacts-message-item ${
                                                    msg.sender ===
                                                    "customer"

                                                        ? "contacts-message-left"

                                                        : "contacts-message-right"
                                                }`}
                                            >

                                                <div
                                                    className={`contacts-message-bubble ${
                                                        msg.sender ===
                                                        "customer"

                                                            ? "contacts-bubble-customer"

                                                            : "contacts-bubble-ai"
                                                    }`}
                                                >

                                                    <div>
                                                        {
                                                            msg.message
                                                        }
                                                    </div>

                                                    <div className="contacts-message-time">

                                                        {
                                                            msg.created_at
                                                                ? new Date(
                                                                    msg.created_at
                                                                ).toLocaleString()
                                                                : "-"
                                                        }

                                                    </div>

                                                </div>

                                            </div>

                                        )
                                    )

                                    :

                                    <p>
                                        No conversation available.
                                    </p>
                            }

                        </div>

                    </div>

                </div>

            )}

            {/* ==================================================
                IMPORT MODAL
            ================================================== */}

            {showImportModal && (

                <div
                    className="modal-overlay"
                    onClick={
                        closeImportModal
                    }
                >

                    <div
                        className="modal import-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <h3>
                            Import Contacts
                        </h3>

                        {!importResult && (

                            <>

                                <p>
                                    {
                                        importedContacts.length
                                    }{" "}
                                    contacts found.
                                </p>

                                <div className="import-preview">

                                    <table className="contacts-table">

                                        <thead>

                                            <tr>

                                                <th>
                                                    Name
                                                </th>

                                                <th>
                                                    Phone
                                                </th>

                                                <th>
                                                    Email
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {
                                                importedContacts
                                                    .slice(
                                                        0,
                                                        10
                                                    )
                                                    .map(
                                                        (
                                                            contact,
                                                            index
                                                        ) => (

                                                            <tr
                                                                key={
                                                                    index
                                                                }
                                                            >

                                                                <td>
                                                                    {
                                                                        contact.name ||
                                                                        "—"
                                                                    }
                                                                </td>

                                                                <td>
                                                                    {
                                                                        contact.phone ||
                                                                        "—"
                                                                    }
                                                                </td>

                                                                <td>
                                                                    {
                                                                        contact.email ||
                                                                        "—"
                                                                    }
                                                                </td>

                                                            </tr>

                                                        )
                                                    )
                                            }

                                        </tbody>

                                    </table>

                                </div>

                                {
                                    importedContacts.length >
                                    10 && (

                                        <p>
                                            Showing first 10
                                            contacts out of{" "}
                                            {
                                                importedContacts.length
                                            }.
                                        </p>

                                    )
                                }

                                <div className="modal-actions">

                                    <button
                                        className="cancel-btn"
                                        type="button"
                                        disabled={
                                            importLoading
                                        }
                                        onClick={
                                            closeImportModal
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="confirm-btn"
                                        type="button"
                                        disabled={
                                            importLoading ||
                                            !importedContacts.length
                                        }
                                        onClick={
                                            handleBulkImport
                                        }
                                    >

                                        {
                                            importLoading
                                                ? "Importing..."
                                                : `Import ${importedContacts.length}`
                                        }

                                    </button>

                                </div>

                            </>

                        )}

                        {importResult && (

                            <>

                                <div className="import-result">

                                    <h4>
                                        Import completed
                                    </h4>

                                    <div>

                                        <span>
                                            Total Customers:
                                        </span>

                                        <strong>
                                            {
                                                importResult.total ??
                                                0
                                            }
                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            Successfully added:
                                        </span>

                                        <strong>
                                            {
                                                importResult.imported ??
                                                0
                                            }
                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            Duplicates:
                                        </span>

                                        <strong>
                                            {
                                                importResult.duplicates ??
                                                0
                                            }
                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            Invalid contacts:
                                        </span>

                                        <strong>
                                            {
                                                importResult.invalid ??
                                                0
                                            }
                                        </strong>

                                    </div>

                                </div>

                                <div className="modal-actions">

                                    <button
                                        className="confirm-btn"
                                        type="button"
                                        onClick={() => {

                                            setShowImportModal(
                                                false
                                            );

                                            setImportedContacts(
                                                []
                                            );

                                            setImportResult(
                                                null
                                            );

                                        }}
                                    >
                                        Done
                                    </button>

                                </div>

                            </>

                        )}

                    </div>

                </div>

            )}

            {/* ==================================================
                ADD / EDIT CUSTOMER MODAL
            ================================================== */}

            {contactsShowModal && (

                <div
                    className="contacts-modal-overlay"
                    onClick={
                        closeContactModal
                    }
                >

                    <div
                        className="contacts-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            type="button"
                            className="contacts-modal-close"
                            onClick={
                                closeContactModal
                            }
                        >
                            ×
                        </button>

                        <h3>

                            {
                                contactsEditMode
                                    ? "Edit Contact"
                                    : "Add Contact"
                            }

                        </h3>

                        {/* NAME */}

                        <input
                            placeholder="Customer Name"
                            value={
                                contactsForm.name
                            }
                            onChange={(e) =>
                                setContactsForm(
                                    (previous) => ({
                                        ...previous,
                                        name:
                                            e.target.value
                                    })
                                )
                            }
                        />

                        {/* WHATSAPP NUMBER */}

                        <div className="contacts-phone-row">

                            <select
                                className="contacts-country-select"
                                value={
                                    contactsForm.country || "IN"
                                }
                                onChange={(e) =>
                                    setContactsForm(
                                        (previous) => ({
                                            ...previous,
                                            country:
                                                e.target.value
                                        })
                                    )
                                }
                            >

                                {COUNTRIES.map((country) => (
                                    <option
                                        key={country.code}
                                        value={country.code}
                                    >
                                        {country.name} {country.dialCode}
                                    </option>
                                ))}

                            </select>

                            <input
                                className="contacts-phone-input"
                                placeholder="Whatsapp Number"
                                value={
                                    contactsForm.phone
                                }
                                onChange={(e) =>
                                    setContactsForm(
                                        (previous) => ({
                                            ...previous,
                                            phone:
                                                e.target.value.replace(/[^0-9]/g, "")
                                        })
                                    )
                                }
                            />

                        </div>

                        {/* EMAIL */}

                        <input
                            placeholder="Email Address (Optional)"
                            value={
                                contactsForm.email
                            }
                            onChange={(e) =>
                                setContactsForm(
                                    (previous) => ({
                                        ...previous,
                                        email:
                                            e.target.value
                                    })
                                )
                            }
                        />

                        {/* LABELS */}

                        <div className="form-group">

                            <div className="label-dropdown">

                                <button
                                    type="button"
                                    className="label-dropdown-btn"
                                    onClick={() =>
                                        setShowLabelDropdown(
                                            (previous) =>
                                                !previous
                                        )
                                    }
                                >

                                    {
                                        contactsForm.labels.length ===
                                        0

                                            ? "Select Labels (Optional)"

                                            : labels
                                                .filter(
                                                    (label) =>
                                                        contactsForm.labels.includes(
                                                            Number(
                                                                label.id
                                                            )
                                                        )
                                                )
                                                .map(
                                                    (label) =>
                                                        label.name
                                                )
                                                .join(
                                                    ", "
                                                )
                                    }

                                    {" "}▼

                                </button>

                                {
                                    showLabelDropdown && (

                                        <div className="label-dropdown-menu">

                                            {
                                                labels.length ===
                                                0 ? (

                                                    <div className="label-dropdown-empty">

                                                        <div className="label-dropdown-empty-icon">
                                                            ✓
                                                        </div>
                                                
                                                        <div className="label-dropdown-empty-content">
                                                
                                                            <strong>
                                                                No labels available
                                                            </strong>
                                                
                                                            <span>
                                                                Create a label using Manage Labels.
                                                            </span>
                                                
                                                        </div>
                                                
                                                    </div>

                                                ) : (

                                                    labels.map(
                                                        (label) => {

                                                            const labelId =
                                                                Number(
                                                                    label.id
                                                                );

                                                            return (

                                                                <label
                                                                    key={
                                                                        label.id
                                                                    }
                                                                    className="label-option"
                                                                >

                                                                    <input
                                                                        type="checkbox"
                                                                        checked={
                                                                            contactsForm.labels.includes(
                                                                                labelId
                                                                            )
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {

                                                                            if (
                                                                                e.target.checked
                                                                            ) {

                                                                                setContactsForm(
                                                                                    (
                                                                                        previous
                                                                                    ) => ({
                                                                                        ...previous,
                                                                                        labels:
                                                                                            previous.labels.includes(
                                                                                                labelId
                                                                                            )
                                                                                                ? previous.labels
                                                                                                : [
                                                                                                    ...previous.labels,
                                                                                                    labelId
                                                                                                ]
                                                                                    })
                                                                                );

                                                                            }
                                                                            else {

                                                                                setContactsForm(
                                                                                    (
                                                                                        previous
                                                                                    ) => ({
                                                                                        ...previous,
                                                                                        labels:
                                                                                            previous.labels.filter(
                                                                                                (
                                                                                                    id
                                                                                                ) =>
                                                                                                    Number(
                                                                                                        id
                                                                                                    ) !==
                                                                                                    labelId
                                                                                            )
                                                                                    })
                                                                                );

                                                                            }

                                                                        }}
                                                                    />

                                                                    {
                                                                        label.name
                                                                    }

                                                                </label>

                                                            );

                                                        }
                                                    )

                                                )
                                            }

                                        </div>

                                    )
                                }

                            </div>

                            <button
                                type="button"
                                className="manage-labels-btn"
                                onClick={() =>
                                    setShowManageLabels(
                                        (previous) =>
                                            !previous
                                    )
                                }
                            >

                                {
                                    showManageLabels
                                        ? "Hide Labels"
                                        : "+ Manage Labels"
                                }

                            </button>

                        </div>

                        {/* MANAGE LABELS */}

                        {
                            showManageLabels && (

                                <div className="manage-labels-section">

                                    <h4>
                                        Manage Labels
                                    </h4>

                                    <div className="label-list">

                                        {
                                            labels.length ===
                                            0 ? (

                                                <div className="labels-empty-state">
                                                    <div className="labels-empty-icon">
                                                        ✓
                                                    </div>
                                                
                                                    <div className="labels-empty-content">
                                                        <strong>No labels created yet</strong>
                                                
                                                        <span>
                                                            Create a label below to organize your contacts.
                                                        </span>
                                                    </div>
                                                </div>

                                            ) : (

                                                labels.map(
                                                    (label) => (

                                                        <div
                                                            key={
                                                                label.id
                                                            }
                                                            className="label-row"
                                                        >

                                                            <span>
                                                                ✓{" "}
                                                                {
                                                                    label.name
                                                                }
                                                            </span>

                                                            <button
                                                                type="button"
                                                                className="delete-label-btn"
                                                                onClick={() =>
                                                                    deleteLabel(
                                                                        label.id
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </button>

                                                        </div>

                                                    )
                                                )

                                            )
                                        }

                                    </div>

                                    <div className="new-label-section">

                                        <label>
                                            New Label
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Enter label name"
                                            value={
                                                newLabel
                                            }
                                            onChange={(e) =>
                                                setNewLabel(
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <button
                                            type="button"
                                            className="add-label-btn"
                                            onClick={
                                                addLabel
                                            }
                                        >
                                            Add Label
                                        </button>

                                    </div>

                                </div>

                            )
                        }

                        {/* MODAL ACTIONS */}

                        <div className="contacts-modal-actions">

                            <button
                                className="contacts-cancel-btn"
                                type="button"
                                onClick={
                                    closeContactModal
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className="contacts-save-btn"
                                type="button"
                                onClick={
                                    handleSaveCustomer
                                }
                            >

                                {
                                    contactsEditMode
                                        ? "Update Contact"
                                        : "Save Contact"
                                }

                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* ==================================================
                DELETE CONFIRMATION MODAL
            ================================================== */}

            {showDeleteModal && (

                <div
                    className="modal-overlay"
                    onClick={() => {

                        if (!deleteLoading) {

                            setShowDeleteModal(
                                false
                            );

                        }

                    }}
                >

                    <div
                        className="modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <h3>
                            Delete Contact?
                        </h3>

                        <p>

                            Are you sure you want to delete{" "}

                            <strong>
                                {
                                    customerDetails
                                        ?.customer
                                        ?.name ||
                                    "this contact"
                                }
                            </strong>
                            ?

                            <br />

                            This action cannot be undone.

                        </p>

                        <div className="modal-actions">

                            <button
                                className="cancel-btn"
                                type="button"
                                disabled={
                                    deleteLoading
                                }
                                onClick={() =>
                                    setShowDeleteModal(
                                        false
                                    )
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className="confirm-btn"
                                type="button"
                                disabled={
                                    deleteLoading
                                }
                                onClick={
                                    confirmDeleteCustomer
                                }
                            >

                                {
                                    deleteLoading
                                        ? "Deleting..."
                                        : "Yes, Delete"
                                }

                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* ==================================================
                SUCCESS MODAL
            ================================================== */}

            {showSuccessModal && (

                <div
                    className="modal-overlay"
                    onClick={() =>
                        setShowSuccessModal(
                            false
                        )
                    }
                >

                    <div
                        className="modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <h3>

                            {
                                successMessage
                                    .toLowerCase()
                                    .includes(
                                        "unable"
                                    ) ||
                                successMessage
                                    .toLowerCase()
                                    .includes(
                                        "error"
                                    ) ||
                                successMessage
                                    .toLowerCase()
                                    .includes(
                                        "missing"
                                    )

                                    ? "Something went wrong"

                                    : "Success"
                            }

                        </h3>

                        <p>
                            {
                                successMessage
                            }
                        </p>

                        <div className="modal-actions">

                            <button
                                className="confirm-btn"
                                type="button"
                                onClick={() =>
                                    setShowSuccessModal(
                                        false
                                    )
                                }
                            >
                                OK
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}

export default Contacts;
