
import React, { useState } from "react";
import "./Settings.css";

const Settings = () => {

    const [deleteConfirm, setDeleteConfirm] = useState(false);

    return (
        <div className="settings-page">

            {/* =====================================================
                PAGE HEADER
            ===================================================== */}

            <div className="settings-header">

                <div>
                    <h1>Settings</h1>

                    <p>
                        Manage your account, WhatsApp connection, team access,
                        usage, billing and security preferences.
                    </p>
                </div>

            </div>


            {/* =====================================================
                GENERAL
            ===================================================== */}

            <section className="settings-section">

                <div className="settings-section-header">

                    <div className="settings-section-icon">
                        <span>⚙</span>
                    </div>

                    <div>
                        <h2>General</h2>

                        <p>
                            Manage your business information and account preferences.
                        </p>
                    </div>

                </div>


                <div className="settings-card">

                    <div className="settings-card-title">

                        <div>
                            <h3>Business Information</h3>

                            <p>
                                Basic information associated with your Nexzsoft account.
                            </p>
                        </div>

                        <span className="settings-readonly">
                            Account
                        </span>

                    </div>


                    <div className="settings-grid">

                        <div className="settings-field">

                            <label>Business Name</label>

                            <div className="settings-input readonly">
                                Nexzsoft Private Limited
                            </div>

                        </div>


                        <div className="settings-field">

                            <label>Account ID</label>

                            <div className="settings-input readonly">
                                NXZ-XXXXXXXX
                            </div>

                        </div>


                        <div className="settings-field">

                            <label>Email Address</label>

                            <div className="settings-input readonly">
                                business@example.com
                            </div>

                        </div>


                        <div className="settings-field">

                            <label>Account Role</label>

                            <div className="settings-input readonly">
                                Administrator
                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                WHATSAPP & META
            ===================================================== */}

            <section className="settings-section">

                <div className="settings-section-header">

                    <div className="settings-section-icon">
                        <span>◉</span>
                    </div>

                    <div>
                        <h2>WhatsApp & Meta</h2>

                        <p>
                            View your WhatsApp Business connection and Meta account details.
                        </p>
                    </div>

                </div>


                <div className="settings-card">

                    <div className="settings-card-title">

                        <div>
                            <h3>WhatsApp Business Connection</h3>

                            <p>
                                Your WhatsApp Business account connected to Nexzsoft.
                            </p>
                        </div>

                        <span className="connection-status">
                            <span className="status-dot"></span>
                            Connected
                        </span>

                    </div>


                    <div className="settings-meta-grid">

                        <div className="meta-item">

                            <span className="meta-label">
                                Business ID
                            </span>

                            <strong>
                                123456789012345
                            </strong>

                        </div>


                        <div className="meta-item">

                            <span className="meta-label">
                                WhatsApp Business Account ID
                            </span>

                            <strong>
                                987654321098765
                            </strong>

                        </div>


                        <div className="meta-item">

                            <span className="meta-label">
                                Phone Number ID
                            </span>

                            <strong>
                                112233445566778
                            </strong>

                        </div>


                        <div className="meta-item">

                            <span className="meta-label">
                                Phone Number
                            </span>

                            <strong>
                                +91 XXXXX XXXXX
                            </strong>

                        </div>

                    </div>


                    <div className="settings-card-footer">

                        <span>
                            Connection status is managed through your WhatsApp Business account.
                        </span>

                        <button className="secondary-button">
                            Manage Connection
                        </button>

                    </div>

                </div>

            </section>


            {/* =====================================================
                TEAM & ACCESS
            ===================================================== */}

            <section className="settings-section">

                <div className="settings-section-header">

                    <div className="settings-section-icon">
                        <span>♙</span>
                    </div>

                    <div>
                        <h2>Team & Access</h2>

                        <p>
                            Manage the people who can access your Nexzsoft workspace.
                        </p>
                    </div>

                </div>


                {/* Manage Agents */}

                <div className="settings-card">

                    <div className="settings-action-row">

                        <div className="settings-action-icon">
                            <span>♙</span>
                        </div>


                        <div className="settings-action-content">

                            <div className="settings-action-heading">

                                <h3>Manage Agents</h3>

                                <span className="coming-soon-badge">
                                    Coming soon
                                </span>

                            </div>

                            <p>
                                View, add, remove and manage agents who handle
                                customer conversations in your workspace.
                            </p>

                        </div>


                        <button
                            className="secondary-button"
                            disabled
                        >
                            Manage Agents
                        </button>

                    </div>

                </div>


                {/* Invite Agents */}

                <div className="settings-card">

                    <div className="settings-action-row">

                        <div className="settings-action-icon">
                            <span>＋</span>
                        </div>


                        <div className="settings-action-content">

                            <div className="settings-action-heading">

                                <h3>Invite Agents</h3>

                                <span className="coming-soon-badge">
                                    Coming soon
                                </span>

                            </div>

                            <p>
                                Invite team members by email and give them
                                access to your Nexzsoft workspace.
                            </p>

                        </div>


                        <button
                            className="secondary-button"
                            disabled
                        >
                            Invite Agent
                        </button>

                    </div>

                </div>


                {/* Roles & Permissions */}

                <div className="settings-card">

                    <div className="settings-action-row">

                        <div className="settings-action-icon">
                            <span>◇</span>
                        </div>


                        <div className="settings-action-content">

                            <div className="settings-action-heading">

                                <h3>Roles & Permissions</h3>

                                <span className="coming-soon-badge">
                                    Coming soon
                                </span>

                            </div>

                            <p>
                                Control what administrators, agents and other
                                team members can view and manage.
                            </p>

                        </div>


                        <button
                            className="secondary-button"
                            disabled
                        >
                            Manage Roles
                        </button>

                    </div>

                </div>


                {/* Invitations */}

                <div className="settings-card">

                    <div className="settings-action-row">

                        <div className="settings-action-icon">
                            <span>✉</span>
                        </div>


                        <div className="settings-action-content">

                            <div className="settings-action-heading">

                                <h3>Pending Invitations</h3>

                                <span className="coming-soon-badge">
                                    Coming soon
                                </span>

                            </div>

                            <p>
                                Review and manage invitations that have not
                                yet been accepted.
                            </p>

                        </div>


                        <button
                            className="secondary-button"
                            disabled
                        >
                            View Invitations
                        </button>

                    </div>

                </div>

            </section>


            {/* =====================================================
                USAGE & CHARGES
            ===================================================== */}

            <section className="settings-section">

                <div className="settings-section-header">

                    <div className="settings-section-icon usage-icon">
                        <span>₹</span>
                    </div>

                    <div>
                        <h2>Usage & Charges</h2>

                        <p>
                            Understand your Meta messaging usage and Nexzsoft platform charges.
                        </p>
                    </div>

                </div>


                {/* Billing Period */}

                <div className="usage-period-card">

                    <div>

                        <span className="usage-period-label">
                            Current Billing Period
                        </span>

                        <strong>
                            September 1 – September 30, 2026
                        </strong>

                    </div>


                    <span className="billing-status">
                        Current Period
                    </span>

                </div>


                {/* Meta Usage */}

                <div className="settings-card usage-card">

                    <div className="settings-card-title">

                        <div>
                            <h3>Meta Usage</h3>

                            <p>
                                Messaging activity and charges for the current billing period.
                            </p>
                        </div>

                    </div>


                    <div className="usage-summary-grid">

                        <div className="usage-summary-item">

                            <span>Total Messages</span>

                            <strong>2,450</strong>

                        </div>


                        <div className="usage-summary-item">

                            <span>Marketing</span>

                            <strong>850</strong>

                        </div>


                        <div className="usage-summary-item">

                            <span>Utility</span>

                            <strong>720</strong>

                        </div>


                        <div className="usage-summary-item">

                            <span>Authentication</span>

                            <strong>380</strong>

                        </div>


                        <div className="usage-summary-item">

                            <span>Service</span>

                            <strong>500</strong>

                        </div>


                        <div className="usage-summary-item">

                            <span>Meta Charges</span>

                            <strong>₹642.40</strong>

                        </div>

                    </div>


                    {/* Country Breakdown */}

                    <div className="usage-table-wrapper">

                        <div className="usage-table-header">

                            <div>
                                <h4>Usage by Country & Category</h4>

                                <p>
                                    Detailed Meta usage for the current billing period.
                                </p>
                            </div>

                        </div>


                        <div className="usage-table-scroll">

                            <table className="usage-table">

                                <thead>

                                    <tr>
                                        <th>Country</th>
                                        <th>Category</th>
                                        <th>Messages</th>
                                        <th>Rate</th>
                                        <th>Meta Charge</th>
                                    </tr>

                                </thead>


                                <tbody>

                                    <tr>

                                        <td>
                                            <span className="country-name">
                                                🇮🇳 India
                                            </span>
                                        </td>

                                        <td>Marketing</td>

                                        <td>850</td>

                                        <td>Meta rate</td>

                                        <td>₹425.00</td>

                                    </tr>


                                    <tr>

                                        <td>
                                            <span className="country-name">
                                                🇮🇳 India
                                            </span>
                                        </td>

                                        <td>Utility</td>

                                        <td>720</td>

                                        <td>Meta rate</td>

                                        <td>₹108.00</td>

                                    </tr>


                                    <tr>

                                        <td>
                                            <span className="country-name">
                                                🇮🇳 India
                                            </span>
                                        </td>

                                        <td>Authentication</td>

                                        <td>380</td>

                                        <td>Meta rate</td>

                                        <td>₹76.00</td>

                                    </tr>


                                    <tr>

                                        <td>
                                            <span className="country-name">
                                                🇺🇸 United States
                                            </span>
                                        </td>

                                        <td>Marketing</td>

                                        <td>120</td>

                                        <td>Meta rate</td>

                                        <td>₹33.40</td>

                                    </tr>


                                    <tr>

                                        <td>
                                            <span className="country-name">
                                                🇬🇧 United Kingdom
                                            </span>
                                        </td>

                                        <td>Utility</td>

                                        <td>80</td>

                                        <td>Meta rate</td>

                                        <td>₹0.00</td>

                                    </tr>

                                </tbody>


                                <tfoot>

                                    <tr>

                                        <td colSpan="2">
                                            Total
                                        </td>

                                        <td>
                                            2,450
                                        </td>

                                        <td></td>

                                        <td>
                                            ₹642.40
                                        </td>

                                    </tr>

                                </tfoot>

                            </table>

                        </div>

                    </div>


                    {/* Meta Calculation */}

                    <div className="calculation-box">

                        <div className="calculation-title">
                            Meta Charge Calculation
                        </div>


                        <div className="calculation-row">

                            <span>Marketing messages</span>

                            <strong>
                                970 × applicable Meta rate
                            </strong>

                        </div>


                        <div className="calculation-row">

                            <span>Utility messages</span>

                            <strong>
                                800 × applicable Meta rate
                            </strong>

                        </div>


                        <div className="calculation-row">

                            <span>Authentication messages</span>

                            <strong>
                                380 × applicable Meta rate
                            </strong>

                        </div>


                        <div className="calculation-row">

                            <span>Service messages</span>

                            <strong>
                                500 × applicable Meta rate
                            </strong>

                        </div>


                        <div className="calculation-divider"></div>


                        <div className="calculation-row total">

                            <span>
                                Total Meta Usage Charges
                            </span>

                            <strong>
                                ₹642.40
                            </strong>

                        </div>

                    </div>

                </div>


                {/* Nexzsoft Fee */}

                <div className="settings-card nexzsoft-fee-card">

                    <div className="settings-card-title">

                        <div>

                            <h3>
                                Nexzsoft Usage Platform Fee
                            </h3>

                            <p>
                                ₹99 minimum to ₹999 maximum per billing month,
                                calculated based on your Meta usage.
                            </p>

                        </div>

                    </div>


                    <div className="fee-explanation">

                        <p>
                            Your Nexzsoft platform fee is calculated at
                            <strong> 9.9% </strong>
                            of your Meta usage charges, subject to a minimum
                            of <strong>₹99</strong> and a maximum of
                            <strong> ₹999 </strong> per billing month.
                        </p>

                    </div>


                    <div className="fee-calculation">

                        <div className="fee-row">

                            <span>
                                Meta usage charges
                            </span>

                            <strong>
                                ₹642.40
                            </strong>

                        </div>


                        <div className="fee-row">

                            <span>
                                Nexzsoft calculation
                            </span>

                            <strong>
                                ₹642.40 × 9.9%
                            </strong>

                        </div>


                        <div className="fee-row">

                            <span>
                                Calculated platform fee
                            </span>

                            <strong>
                                ₹63.60
                            </strong>

                        </div>


                        <div className="fee-row minimum">

                            <span>
                                Minimum monthly platform fee
                            </span>

                            <strong>
                                ₹99.00
                            </strong>

                        </div>


                        <div className="fee-divider"></div>


                        <div className="fee-total">

                            <span>
                                Your Nexzsoft platform fee
                            </span>

                            <strong>
                                ₹99.00
                            </strong>

                        </div>

                    </div>


                    <div className="fee-note">

                        <span>i</span>

                        <p>
                            The platform fee is subject to the ₹99 minimum
                            and ₹999 maximum for each billing month.
                        </p>

                    </div>

                </div>


                {/* Total */}

                <div className="billing-total-card">

                    <div>

                        <span>
                            Estimated Total for Current Period
                        </span>

                        <p>
                            Meta usage charges + Nexzsoft platform fee
                        </p>

                    </div>


                    <strong>
                        ₹741.40
                    </strong>

                </div>

            </section>


            {/* =====================================================
                NOTIFICATIONS
            ===================================================== */}

            <section className="settings-section">

                <div className="settings-section-header">

                    <div className="settings-section-icon">
                        <span>🔔</span>
                    </div>

                    <div>

                        <h2>Notifications</h2>

                        <p>
                            Choose which important account and usage updates you receive.
                        </p>

                    </div>

                </div>


                <div className="settings-card">

                    <div className="notification-row">

                        <div>

                            <h3>
                                Usage & Billing Alerts
                            </h3>

                            <p>
                                Receive notifications about billing, usage and payment events.
                            </p>

                        </div>


                        <label className="toggle">

                            <input
                                type="checkbox"
                                defaultChecked
                            />

                            <span></span>

                        </label>

                    </div>


                    <div className="notification-row">

                        <div>

                            <h3>
                                WhatsApp Connection Alerts
                            </h3>

                            <p>
                                Get notified when your WhatsApp connection requires attention.
                            </p>

                        </div>


                        <label className="toggle">

                            <input
                                type="checkbox"
                                defaultChecked
                            />

                            <span></span>

                        </label>

                    </div>


                    <div className="notification-row">

                        <div>

                            <h3>
                                Security Notifications
                            </h3>

                            <p>
                                Receive important security and account activity notifications.
                            </p>

                        </div>


                        <label className="toggle">

                            <input
                                type="checkbox"
                                defaultChecked
                            />

                            <span></span>

                        </label>

                    </div>

                </div>

            </section>


            {/* =====================================================
                SECURITY
            ===================================================== */}

            <section className="settings-section">

                <div className="settings-section-header">

                    <div className="settings-section-icon">
                        <span>🔒</span>
                    </div>

                    <div>

                        <h2>Security</h2>

                        <p>
                            Protect your account and manage your sign-in security.
                        </p>

                    </div>

                </div>


                {/* Password */}

                <div className="settings-card">

                    <div className="settings-action-row">

                        <div className="settings-action-icon">
                            <span>●</span>
                        </div>


                        <div className="settings-action-content">

                            <div className="settings-action-heading">

                                <h3>
                                    Password
                                </h3>

                                <span className="coming-soon-badge">
                                    Coming soon
                                </span>

                            </div>

                            <p>
                                Update your password to keep your Nexzsoft
                                account secure.
                            </p>

                        </div>


                        <button
                            className="secondary-button"
                            disabled
                        >
                            Change Password
                        </button>

                    </div>

                </div>


                {/* Sessions */}

                <div className="settings-card">

                    <div className="settings-action-row">

                        <div className="settings-action-icon">
                            <span>▣</span>
                        </div>


                        <div className="settings-action-content">

                            <div className="settings-action-heading">

                                <h3>
                                    Active Sessions
                                </h3>

                                <span className="coming-soon-badge">
                                    Coming soon
                                </span>

                            </div>

                            <p>
                                Review devices and sessions currently signed
                                in to your Nexzsoft account.
                            </p>

                        </div>


                        <button
                            className="secondary-button"
                            disabled
                        >
                            Manage Sessions
                        </button>

                    </div>

                </div>

            </section>


            {/* =====================================================
                DANGER ZONE
            ===================================================== */}

            <section className="settings-section danger-section">

                <div className="settings-section-header">

                    <div className="settings-section-icon danger-icon">
                        <span>!</span>
                    </div>

                    <div>

                        <h2>Danger Zone</h2>

                        <p>
                            Permanent and irreversible account actions.
                        </p>

                    </div>

                </div>


                <div className="danger-card">

                    <div className="danger-content">

                        <div>

                            <h3>
                                Delete Account
                            </h3>

                            <p>
                                Permanently delete your Nexzsoft account,
                                WhatsApp configuration, contacts, messages,
                                flows, usage records and other associated data.
                            </p>

                            <span className="danger-warning">
                                This action cannot be undone.
                            </span>

                        </div>


                        <button
                            className="delete-button"
                            onClick={() => setDeleteConfirm(true)}
                        >
                            Delete Account
                        </button>

                    </div>


                    {deleteConfirm && (

                        <div className="delete-confirmation">

                            <div className="confirmation-icon">
                                !
                            </div>


                            <div className="confirmation-content">

                                <h4>
                                    Before you go...
                                </h4>

                                <p>
                                    If something isn't working the way you expect,
                                    you may be able to fix it without deleting your
                                    account. Your data and WhatsApp setup can remain
                                    available while you make changes to your configuration.
                                </p>

                                <p>
                                    If you still want to permanently delete your account,
                                    continue below.
                                </p>


                                <div className="confirmation-actions">

                                    <button
                                        className="secondary-button"
                                        onClick={() => setDeleteConfirm(false)}
                                    >
                                        Keep My Account
                                    </button>


                                    <button
                                        className="delete-button final-delete"
                                    >
                                        Permanently Delete Account
                                    </button>

                                </div>

                            </div>

                        </div>

                    )}

                </div>

            </section>

        </div>
    );
};

export default Settings;
