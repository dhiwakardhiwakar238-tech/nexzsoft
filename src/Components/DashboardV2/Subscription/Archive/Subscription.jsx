import "./Subscription.css";

import {
    RiCheckLine,
    RiArrowRightLine,
    RiSecurePaymentLine,
    RiBankCardLine,
    RiDownloadLine,
    RiRefreshLine,
    RiCloseCircleLine,
    RiCalendarLine,
    RiShieldCheckLine,
} from "react-icons/ri";

function Subscription() {

    const currentPlan = {
        name: "Free Trial",
        status: "trial",
        price: 0,
        billingCycle: "Trial",
        renewalDate: null,
    };

    const plans = [
        {
            id: "starter",
            name: "Starter",
            description: "Essential customer engagement for growing teams.",
            monthly: 999,
            annual: 9990,
            popular: false,
            features: [
                "Unified customer inbox",
                "WhatsApp engagement",
                "Basic automation",
                "Customer management",
                "Conversation history",
            ],
        },

        {
            id: "growth",
            name: "Growth",
            description: "Advanced automation and engagement for scaling businesses.",
            monthly: 2499,
            annual: 24990,
            popular: true,
            features: [
                "Everything in Starter",
                "AI-powered conversations",
                "Advanced automation",
                "Broadcast campaigns",
                "Lead management",
                "Engagement analytics",
            ],
        },

        {
            id: "enterprise",
            name: "Enterprise",
            description: "Advanced capabilities for larger teams and operations.",
            monthly: 4999,
            annual: 49990,
            popular: false,
            features: [
                "Everything in Growth",
                "Advanced AI capabilities",
                "Priority support",
                "Advanced analytics",
                "Team collaboration",
                "Enterprise controls",
            ],
        },
    ];

    const paymentHistory = [
        {
            id: "INV-2026-0012",
            date: "Aug 01, 2026",
            description: "Growth Plan",
            amount: "₹2,499",
            status: "Paid",
        },
        {
            id: "INV-2026-0008",
            date: "Jul 01, 2026",
            description: "Growth Plan",
            amount: "₹2,499",
            status: "Paid",
        },
        {
            id: "INV-2026-0004",
            date: "Jun 01, 2026",
            description: "Growth Plan",
            amount: "₹2,499",
            status: "Paid",
        },
    ];

    return (
        <div className="subscription-page">

            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="subscription-header">

                <div>

                    <div className="subscription-eyebrow">
                        BILLING & SUBSCRIPTION
                    </div>

                    <h1>
                        Manage your subscription
                    </h1>

                    <p>
                        Manage your plan, billing preferences, payment
                        methods, and subscription history from one place.
                    </p>

                </div>

            </div>


            {/* ==================================================
                CURRENT PLAN
            ================================================== */}

            <section className="current-plan-card">

                <div className="current-plan-main">

                    <div className="current-plan-icon">
                        <RiShieldCheckLine />
                    </div>

                    <div>

                        <span className="section-label">
                            CURRENT PLAN
                        </span>

                        <div className="current-plan-title-row">

                            <h2>
                                {currentPlan.name}
                            </h2>

                            <span
                                className={`plan-status ${
                                    currentPlan.status
                                }`}
                            >
                                {currentPlan.status === "trial"
                                    ? "Trial"
                                    : "Active"}
                            </span>

                        </div>

                        <p>
                            {currentPlan.status === "trial"
                                ? "You're currently evaluating Nexzsoft. Choose a plan to continue with uninterrupted access."
                                : "Your subscription is active and your account is in good standing."}
                        </p>

                    </div>

                </div>

                <div className="current-plan-meta">

                    <div>
                        <span>Billing cycle</span>
                        <strong>
                            {currentPlan.billingCycle}
                        </strong>
                    </div>

                    <div>
                        <span>Renewal</span>
                        <strong>
                            —
                        </strong>
                    </div>

                </div>

            </section>


            {/* ==================================================
                PLAN SELECTION
            ================================================== */}

            <section className="plans-section">

                <div className="section-heading">

                    <div>

                        <span className="section-label">
                            PLANS
                        </span>

                        <h2>
                            Choose the right plan for your business
                        </h2>

                        <p>
                            Upgrade whenever you're ready. You can change
                            your plan as your business grows.
                        </p>

                    </div>

                    <div className="billing-toggle">

                        <button className="billing-option active">
                            Monthly
                        </button>

                        <button className="billing-option">
                            Annual
                            <span>Save more</span>
                        </button>

                    </div>

                </div>


                <div className="plans-grid">

                    {plans.map((plan) => (

                        <div
                            className={`plan-card ${
                                plan.popular
                                    ? "popular"
                                    : ""
                            }`}
                            key={plan.id}
                        >

                            {plan.popular && (
                                <div className="popular-badge">
                                    RECOMMENDED
                                </div>
                            )}

                            <div className="plan-card-header">

                                <h3>
                                    {plan.name}
                                </h3>

                                <p>
                                    {plan.description}
                                </p>

                            </div>

                            <div className="plan-price">

                                <strong>
                                    ₹{plan.monthly.toLocaleString("en-IN")}
                                </strong>

                                <span>
                                    / month
                                </span>

                            </div>

                            <div className="plan-billing-note">
                                Billed monthly
                            </div>


                            <button
                                className={`plan-select-btn ${
                                    plan.popular
                                        ? "primary"
                                        : ""
                                }`}
                            >

                                {currentPlan.name === plan.name
                                    ? "Current plan"
                                    : "Choose plan"}

                                <RiArrowRightLine />

                            </button>


                            <div className="plan-divider"></div>


                            <div className="plan-features">

                                <span className="feature-heading">
                                    Includes:
                                </span>

                                {plan.features.map((feature) => (

                                    <div
                                        className="plan-feature"
                                        key={feature}
                                    >

                                        <RiCheckLine />

                                        <span>
                                            {feature}
                                        </span>

                                    </div>

                                ))}

                            </div>

                        </div>

                    ))}

                </div>

            </section>


            {/* ==================================================
                PAYMENT & BILLING
            ================================================== */}

            <section className="billing-grid">

                {/* PAYMENT METHOD */}

                <div className="billing-card">

                    <div className="billing-card-header">

                        <div>

                            <span className="section-label">
                                PAYMENT METHOD
                            </span>

                            <h3>
                                Payment details
                            </h3>

                        </div>

                        <div className="billing-header-icon">
                            <RiBankCardLine />
                        </div>

                    </div>


                    <div className="payment-method">

                        <div className="payment-icon">
                            <RiBankCardLine />
                        </div>

                        <div className="payment-info">

                            <strong>
                                No payment method added
                            </strong>

                            <span>
                                Add a payment method when you upgrade.
                            </span>

                        </div>

                    </div>


                    <button className="secondary-action">
                        Add payment method
                        <RiArrowRightLine />
                    </button>


                    <div className="secure-payment">

                        <RiSecurePaymentLine />

                        <span>
                            Payments are processed securely.
                        </span>

                    </div>

                </div>


                {/* BILLING SUMMARY */}

                <div className="billing-card">

                    <div className="billing-card-header">

                        <div>

                            <span className="section-label">
                                BILLING SUMMARY
                            </span>

                            <h3>
                                Account billing
                            </h3>

                        </div>

                        <div className="billing-header-icon">
                            <RiCalendarLine />
                        </div>

                    </div>


                    <div className="billing-summary-list">

                        <div>
                            <span>Current plan</span>
                            <strong>
                                {currentPlan.name}
                            </strong>
                        </div>

                        <div>
                            <span>Billing cycle</span>
                            <strong>
                                Monthly
                            </strong>
                        </div>

                        <div>
                            <span>Next billing date</span>
                            <strong>
                                —
                            </strong>
                        </div>

                        <div className="billing-total">

                            <span>
                                Current amount
                            </span>

                            <strong>
                                ₹0
                            </strong>

                        </div>

                    </div>

                </div>

            </section>


            {/* ==================================================
                PAYMENT HISTORY
            ================================================== */}

            <section className="history-section">

                <div className="section-heading history-heading">

                    <div>

                        <span className="section-label">
                            BILLING HISTORY
                        </span>

                        <h2>
                            Payment history
                        </h2>

                        <p>
                            View your previous payments and invoices.
                        </p>

                    </div>

                    <button className="history-refresh">
                        <RiRefreshLine />
                        Refresh
                    </button>

                </div>


                <div className="history-card">

                    <div className="history-table">

                        <div className="history-row history-header">

                            <span>
                                Invoice
                            </span>

                            <span>
                                Date
                            </span>

                            <span>
                                Description
                            </span>

                            <span>
                                Amount
                            </span>

                            <span>
                                Status
                            </span>

                            <span>
                                Action
                            </span>

                        </div>


                        {paymentHistory.map((payment) => (

                            <div
                                className="history-row"
                                key={payment.id}
                            >

                                <span className="invoice-id">
                                    {payment.id}
                                </span>

                                <span>
                                    {payment.date}
                                </span>

                                <span>
                                    {payment.description}
                                </span>

                                <strong>
                                    {payment.amount}
                                </strong>

                                <span>
                                    <span className="payment-status">
                                        {payment.status}
                                    </span>
                                </span>

                                <button className="invoice-action">
                                    <RiDownloadLine />
                                    Invoice
                                </button>

                            </div>

                        ))}

                    </div>

                </div>

            </section>


            {/* ==================================================
                SUBSCRIPTION MANAGEMENT
            ================================================== */}

            <section className="subscription-management">

                <div>

                    <span className="section-label">
                        SUBSCRIPTION MANAGEMENT
                    </span>

                    <h3>
                        Need to make a change?
                    </h3>

                    <p>
                        Manage your subscription, billing preferences,
                        or cancellation settings.
                    </p>

                </div>

                <div className="management-actions">

                    <button className="secondary-action">
                        Manage subscription
                        <RiArrowRightLine />
                    </button>

                    <button className="cancel-action">
                        <RiCloseCircleLine />
                        Cancel subscription
                    </button>

                </div>

            </section>


            {/* ==================================================
                FOOTER NOTE
            ================================================== */}

            <div className="billing-security-note">

                <RiSecurePaymentLine />

                <span>
                    Your billing information is securely processed and
                    protected using industry-standard payment security.
                </span>

            </div>

        </div>
    );
}

export default Subscription;