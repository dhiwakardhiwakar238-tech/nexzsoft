import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import "./Subscription.css";
import {
    activateUsageSubscription,
    getPaymentHistory,
    cancelSubscription,
} from "../../../services/api.js";

import { getErrorMessage } from "../../../config/apiConfig";

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
    RiFlashlightLine,
    RiStackLine,
} from "react-icons/ri";

function Subscription({ subscription, setSubscription }) {

    const [billingCycle, setBillingCycle] = useState("monthly");
    const [billingModel, setBillingModel] = useState("usage");

    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loadingPaymentHistory, setLoadingPaymentHistory] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    /*const currentPlan = {
        name: "Free Trial",
        status: "trial",
        price: 0,
        billingCycle: "Monthly",
        renewalDate: null,
    };*/

    /*
    ==================================================
    PAY AS YOU USE
    ==================================================
    */

    const usagePlan = {
        id: "payg",
        name: "Pay as you use",
        description:
            "Start without a monthly commitment and pay based on your WhatsApp usage.",
        features: [
            "WhatsApp business account",
            "Unified customer inbox",
            "Broadcast campaigns",
            "Subscriber management",
            "WhatsApp flow messaging",
            "Usage-based billing",
        ],
    };


    /*
    ==================================================
    MONTHLY PLANS
    ==================================================
    */

    const plans = [

        {
            id: "go",
            name: "Go",
            description:
                "Everything you need to manage everyday WhatsApp customer engagement.",
            monthly: 999,
            annual: 9990,
            popular: false,
            features: [
                "WhatsApp business account",
                "Unified customer inbox",
                "Customer & subscriber management",
                "WhatsApp templates",
                "Broadcast campaigns",
                "Conversation history",
                "Essential usage limits",
            ],
        },

        {
            id: "boost",
            name: "Boost",
            description:
                "Built for growing businesses that need automation and higher engagement capacity.",
            monthly: 2499,
            annual: 24990,
            popular: true,
            features: [
                "Everything in Go",
                "Higher messaging capacity",
                "Advanced broadcast campaigns",
                "WhatsApp Flows",
                "Customer journey automation",
                "AI-powered conversations",
                "Engagement insights",
            ],
        },

        {
            id: "infinity",
            name: "Infinity",
            description:
                "Designed for businesses running high-volume customer engagement at scale.",
            monthly: 4999,
            annual: 49990,
            popular: false,
            features: [
                "Everything in Boost",
                "High-volume messaging",
                "Advanced WhatsApp automation",
                "Advanced AI capabilities",
                "Advanced analytics",
                "Team & agent operations",
                "Priority support",
            ],
        },
    ];


    /*
    ==================================================
    PAYMENT HISTORY
    ==================================================
    */

    const loadPaymentHistory = useCallback(async () => {

        try {

            setLoadingPaymentHistory(true);

            const tenantId =
                localStorage.getItem("tenantId");

            if (!tenantId) {

                throw new Error(
                    "Tenant ID not found."
                );

            }

            const history =
                await getPaymentHistory(tenantId);

            setPaymentHistory(
                Array.isArray(history)
                    ? history
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load payment history:",
                error
            );

            toast.error(
                getErrorMessage(error)
            );

        } finally {

            setLoadingPaymentHistory(false);

        }

    }, []);


    /*
    ==================================================
    LOAD PAYMENT HISTORY ON PAGE LOAD
    ==================================================
    */

    useEffect(() => {

        loadPaymentHistory();

    }, [loadPaymentHistory]);


    /*
    ==================================================
    PLAN ACTION
    ==================================================
    */

    const handlePlanSelect = (plan) => {

        console.log(
            "Selected plan:",
            plan.id,
            billingCycle
        );

        // Connect your payment gateway here.
        // Example:
        // createSubscription(plan.id, billingCycle);
    };


    const handleUsagePlan = async () => {

        try {

            const tenantId = localStorage.getItem("tenantId");

            if (!tenantId) {

                throw new Error(
                    "Tenant ID not found."
                );

            }

            console.log(
                "Activating Pay As You Grow for tenant"
            );


            const response =
                await activateUsageSubscription(tenantId);


            console.log(
                "Usage subscription activated:",
                response.subscription
            );


            /*
            --------------------------------------------------
            Update subscription state immediately
            --------------------------------------------------
            */

            setSubscription(
                response.subscription
            );


            /*
            --------------------------------------------------
            Refresh payment history
            --------------------------------------------------
            */

            await loadPaymentHistory();


        } catch (error) {

            console.error(
                "Failed to activate Pay As You Grow:",
                error
            );


            toast.error(
                getErrorMessage(error)
            );

        }

    };

    const handleCancelSubscription = async () => {

        try {
    
            const tenantId =
                localStorage.getItem("tenantId");
    
            if (!tenantId) {
                throw new Error("Tenant ID not found.");
            }
    
            const response = await cancelSubscription(tenantId);

            setSubscription(response.subscription);
    
            toast.success(
                "Subscription cancelled successfully."
            );
       
        } catch (error) {
    
            console.error(
                "Failed to cancel subscription:",
                error
            );
    
            toast.error(
                getErrorMessage(error)
            );
    
        }
    
    };

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
                        Manage your plan
                    </h1>

                    <p>
                        Choose the pricing model that fits your business,
                        manage billing preferences, and review your payment
                        history from one place.
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
                                {subscription?.subscription_status === "active"
                                    ? "Pay As You Grow"
                                    : "Free Trial"}
                            </h2>
            
                            <span
                                className={`plan-status ${
                                    subscription?.subscription_status === "active"
                                        ? "active"
                                        : subscription?.subscription_status === "cancelled"
                                            ? "cancelled"
                                            : "trial"
                                }`}
                            >
                                {subscription?.subscription_status === "active"
                                    ? "Active"
                                    : subscription?.subscription_status === "cancelled"
                                        ? "Cancelled"
                                        : "Trial"}
                            </span>
            
                        </div>
            
                        <p>
                            {subscription?.ended_at
                                ? subscription?.subscription_status === "trialing"
                                    ? "Your trial period has ended. Start the Pay As You Grow plan to continue using Nexzsoft and its capabilities."
                                    : subscription?.subscription_status === "cancelled"
                                        ? "Your subscription has been cancelled. You can start your Pay As You Grow plan again whenever you're ready. We'd love to have you back and help you continue engaging with your customers through Nexzsoft."
                                        : "Your subscription has ended. You can resume your Pay As You Grow plan whenever you're ready. If you'd like to review your experience or discuss anything further, our team is happy to assist."
                                : subscription?.subscription_status === "cancelled"
                                    ? "Your subscription has been cancelled. You can start your Pay As You Grow plan again whenever you're ready. We'd love to have you back and help you continue engaging with your customers through Nexzsoft."
                                    : subscription?.subscription_status === "active"
                                        ? "Your Pay As You Grow subscription is active. You have full access to your subscribed capabilities."
                                        : "You're currently evaluating Nexzsoft. Subscribe to the Pay As You Grow plan whenever you're ready to get started."}
                        </p>
            
                    </div>
            
                </div>
            
            
                <div className="current-plan-meta">
            
                    {/* TRIAL */}
                    {subscription?.subscription_status === "trialing" && (
            
                        <div>
            
                            <span>
                                Trial End Date
                            </span>
            
                            <strong>
                                {subscription?.trial_ends_at
                                    ? new Date(
                                        subscription.trial_ends_at
                                    ).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        }
                                    )
                                    : "—"}
                            </strong>
            
                        </div>
            
                    )}
            
            
                    {/* ACTIVE */}
                    {subscription?.subscription_status === "active" && (
            
                        <div>
            
                            <span>
                                Subscription Start Date
                            </span>
            
                            <strong>
                                {subscription?.started_at
                                    ? new Date(
                                        subscription.started_at
                                    ).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        }
                                    )
                                    : "—"}
                            </strong>
            
                        </div>
            
                    )}

                    {/* CANCELLED */}
                    {subscription?.subscription_status === "cancelled" && (
                    
                        <div>
                    
                            <span>
                                Cancellation Date
                            </span>
                    
                            <strong>
                                {subscription?.cancelled_at
                                    ? new Date(
                                        subscription.cancelled_at
                                    ).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        }
                                    )
                                    : "—"}
                            </strong>
                    
                        </div>
                    
                    )}
            
            
                    {/* LAST BILLING */}
            
                    <div>
            
                        <span>
                            Billing Status
                        </span>
            
                        <strong>
                            {subscription?.billing_status ? subscription?.billing_status : "—"}
                        </strong>
            
                    </div>
            
                </div>
            
            </section>
            
            {/* ==================================================
                BILLING MODEL
            ================================================== */}

            <section className="pricing-model-section">

                <div className="section-heading">

                    <div>

                        <span className="section-label">
                            PRICING MODEL
                        </span>

                        <h2>
                            {/*Choose how you want to pay*/}
                            How do you want to pay
                        </h2>

                        <p>
                            {/*Start with usage-based pricing or choose a
                            monthly plan for predictable billing and
                            greater platform capacity.*/}
                            Start with usage-based pricing
                        </p>

                    </div>

                </div>


                <div className="pricing-model-grid">

                    {/* PAY AS YOU USE */}

                    <div
                        className={`pricing-model-card ${
                            billingModel === "usage"
                                ? "selected"
                                : ""
                        }`}
                        onClick={() =>
                            setBillingModel("usage")
                        }
                    >

                        <div className="pricing-model-icon">
                            <RiFlashlightLine />
                        </div>

                        <div className="pricing-model-content">

                            <div className="pricing-model-title">

                                <h3>
                                    Pay as you grow
                                </h3>

                                <span>
                                    Flexible
                                </span>

                            </div>

                            <p>
                                Ideal for startups and growing businesses
                                with variable messaging requirements.
                            </p>

                            <div className="pricing-model-highlight">
                                Pay monthly for what you use
                            </div>

                            <div className="pricing-model-features">

                                {usagePlan.features.map(
                                    (feature) => (

                                        <div
                                            className="pricing-feature"
                                            key={feature}
                                        >
                                            <RiCheckLine />

                                            <span>
                                                {feature}
                                            </span>
                                        </div>

                                    )
                                )}

                            </div>

                        </div>


                        <button
                            className="pricing-model-action"
                            onClick={(event) => {

                                event.stopPropagation();

                                handleUsagePlan();

                            }}
                        >

                            Start with usage pricing

                            <RiArrowRightLine />

                        </button>

                    </div>


                    {/* MONTHLY 

                    <div
                        className={`pricing-model-card ${
                            billingModel === "subscription"
                                ? "selected"
                                : ""
                        }`}
                        onClick={() =>
                            setBillingModel("subscription")
                        }
                    >

                        <div className="pricing-model-icon">
                            <RiStackLine />
                        </div>

                        <div className="pricing-model-content">

                            <div className="pricing-model-title">

                                <h3>
                                    Monthly subscription
                                </h3>

                                <span>
                                    Predictable
                                </span>

                            </div>

                            <p>
                                Get more capacity and advanced
                                platform capabilities with a
                                predictable monthly subscription.
                            </p>

                            <div className="pricing-model-highlight">
                                Best for growing businesses
                            </div>

                            <div className="pricing-model-features">

                                {usagePlan.features.map(
                                    (feature) => (

                                        <div
                                            className="pricing-feature"
                                            key={feature}
                                        >
                                            <RiCheckLine />

                                            <span>
                                                {feature}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>
                        
                        <div className="pricing-model-highlight">
                            Know more below
                        </div>

                    </div> */}

                </div>

            </section>


            {/* ==================================================
                MONTHLY PLANS
            ================================================== */}

            {billingModel === "subscription" && (

                <section className="plans-section">

                    <div className="section-heading">

                        <div>

                            <span className="section-label">
                                MONTHLY PLANS
                            </span>

                            <h2>
                                Choose the right plan for your business
                            </h2>

                            <p>
                                Upgrade whenever you're ready.
                                Move between plans as your business grows.
                            </p>

                        </div>


                        <div className="billing-toggle">

                            <button
                                className={
                                    billingCycle === "monthly"
                                        ? "billing-option active"
                                        : "billing-option"
                                }
                                onClick={() =>
                                    setBillingCycle("monthly")
                                }
                            >
                                Monthly
                            </button>


                            <button
                                className={
                                    billingCycle === "annual"
                                        ? "billing-option active"
                                        : "billing-option"
                                }
                                onClick={() =>
                                    setBillingCycle("annual")
                                }
                            >
                                Annual

                                <span>
                                    Save more
                                </span>

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
                                        ₹
                                        {(
                                            billingCycle === "monthly"
                                                ? plan.monthly
                                                : Math.round(
                                                    plan.annual / 12
                                                )
                                        ).toLocaleString("en-IN")}
                                    </strong>

                                    <span>
                                        / month
                                    </span>

                                </div>


                                <div className="plan-billing-note">

                                    {billingCycle === "monthly"
                                        ? "Billed monthly"
                                        : `₹${plan.annual.toLocaleString(
                                            "en-IN"
                                        )} billed annually`}

                                </div>


                                <button
                                    className={`plan-select-btn ${
                                        plan.popular
                                            ? "primary"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handlePlanSelect(plan)
                                    }
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

                                    {plan.features.map(
                                        (feature) => (

                                            <div
                                                className="plan-feature"
                                                key={feature}
                                            >

                                                <RiCheckLine />

                                                <span>
                                                    {feature}
                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                </section>

            )}


            {/* ==================================================
                PAYMENT & BILLING
            ================================================== */}

            <section className="billing-grid">

                {/* PAYMENT METHOD */}

                {/*<div className="billing-card">

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
                                Add a payment method when you
                                subscribe to a monthly plan.
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

                </div> */}


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
                
                        {/* CURRENT PLAN */}
                
                        <div>
                
                            <span>
                                Current plan
                            </span>
                
                            <strong>
                                {subscription?.subscription_status === "active"
                                    ? "Pay As You Grow"
                                    : "Trial Plan"}
                            </strong>
                
                        </div>
                
                
                        {/* BILLING MODEL */}
                
                        <div>
                
                            <span>
                                Billing model
                            </span>
                
                            <strong>
                                {subscription?.subscription_status === "active"
                                    ? "Usage-based"
                                    : "Usage-based"}
                            </strong>
                
                        </div>
                
                
                        {/* BILLING CYCLE */}
                
                        <div>
                
                            <span>
                                Billing cycle
                            </span>
                
                            <strong>
                                {subscription?.subscription_status === "active"
                                    ? "Monthly"
                                    : "Monthly"}
                            </strong>
                
                        </div>
                
                
                        {/* NEXT BILLING DATE */}
                
                        <div>
                
                            <span>
                                Next billing date
                            </span>
                
                            <strong>
                                {subscription?.subscription_status === "active" &&
                                subscription?.next_billing_at
                                    ? new Date(
                                        subscription.next_billing_at
                                    ).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        }
                                    )
                                    : "—"}
                            </strong>
                
                        </div>
                
                
                        {/* CURRENT AMOUNT */}
                
                        <div className="billing-total">

                            <span>
                                Current amount
                            </span>
                        
                            <strong>
                                {subscription?.billing_status === "paid"
                                    ? "₹0"
                                    : subscription?.billing_status === "pending"
                                        ? "₹99"
                                        : "₹0"}
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
                            View previous payments and download
                            invoices.
                        </p>

                    </div>


                    <button
                        className="history-refresh"
                        onClick={loadPaymentHistory}
                        disabled={loadingPaymentHistory}
                    >

                        <RiRefreshLine />

                        {loadingPaymentHistory
                            ? "Refreshing..."
                            : "Refresh"}

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
                                key={payment.payment_id}
                            >

                                <span className="invoice-id">
                                    {payment.invoice_id || "—"}
                                </span>

                                <span>
                                    {payment.billed_at
                                        ? new Date(
                                            payment.billed_at
                                        ).toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "short",
                                                day: "2-digit",
                                                year: "numeric",
                                            }
                                        )
                                        : "—"}
                                </span>

                                <span>
                                    Pay as you grow
                                </span>

                                <strong>
                                    {payment.currency}{" "}
                                    {Number(
                                        payment.amount
                                    ).toFixed(2)}
                                </strong>

                                <span>

                                    <span className="payment-status">
                                        {payment.billing_status}
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
                        ACCOUNT MANAGEMENT
                    </span>

                    <h3>
                        Need to make a change?
                    </h3>

                    <p>
                        Manage your subscription, billing
                        preferences, or cancellation settings.
                    </p>

                </div>


                <div className="management-actions">

                    {/*<button className="secondary-action">

                        Manage subscription

                        <RiArrowRightLine />

                    </button>*/}


                    <button
                        className="cancel-action"
                        onClick={() => setShowCancelModal(true)}
                    >
                        <RiCloseCircleLine />
                        Cancel subscription
                    </button>

                </div>

            </section>

            {/* ==========================================
                CANCEL SUBSCRIPTION MODAL
            ========================================== */}
            
            {
                showCancelModal && (
            
                    <div
                        className="modal-overlay"
                        onClick={() =>
                            setShowCancelModal(false)
                        }
                    >
            
                        <div
                            className="modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >
            
                            <h3>
                                Cancel subscription?
                            </h3>
            
            
                            <p>
            
                                Are you sure you want to cancel
                                your Nexzsoft subscription?
            
                                Your WhatsApp Business account
                                will be disconnected and you will
                                no longer be able to send or receive
                                messages through Nexzsoft.
            
                            </p>
            
            
                            <div className="modal-actions">
            
                                <button
                                    className="cancel-btn"
                                    onClick={() =>
                                        setShowCancelModal(false)
                                    }
                                >
                                    Keep subscription
                                </button>
            
            
                                <button
                                    className="confirm-btn"
                                    onClick={() => {
            
                                        setShowCancelModal(false);
            
                                        handleCancelSubscription();
            
                                    }}
                                >
                                    Yes, Cancel Subscription
                                </button>
            
                            </div>
            
                        </div>
            
                    </div>
            
                )
            }


            {/* ==================================================
                SECURITY NOTE
            ================================================== */}

            <div className="billing-security-note">

                <RiSecurePaymentLine />

                <span>
                    Your billing information is securely processed
                    and protected using industry-standard payment
                    security.
                </span>

            </div>

        </div>
    );
}

export default Subscription;
