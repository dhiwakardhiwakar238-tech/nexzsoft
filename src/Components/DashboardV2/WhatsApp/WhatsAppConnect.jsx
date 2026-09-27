import toast from "react-hot-toast";

import { useEffect, useState } from "react";
import "./WhatsAppConnect.css";
import { FaWhatsapp } from "react-icons/fa";

import {
    getMetaConfig,
    disconnectWhatsApp,
    exchangeMetaCode
} from "../../../services/api";

import { getErrorMessage } from "../../../config/apiConfig";

function WhatsAppConnect() {

    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);
    const [showDisconnectModal, setShowDisconnectModal] = useState(false);
    const [metaConfig, setMetaConfig] = useState(null);
    const [signupData, setSignupData] = useState(null);
    const [authCode, setAuthCode] = useState(null);

    const tenantId =
        localStorage.getItem("tenantId");

    //==========================================
    // LOAD META CONFIG
    //==========================================

    const loadMetaConfig = async () => {

        try {

            const response =
                await getMetaConfig(tenantId);

            setMetaConfig(response.data);

        }

        catch (err) {

            console.error(
                "Load Meta Config Error:",
                {
                    message: getErrorMessage(err),
                    status: err.response?.status,
                    response: err.response?.data
                }
            );

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadMetaConfig();

    }, []);

    //==========================================
    // FACEBOOK SDK
    //==========================================

    useEffect(() => {

        window.fbAsyncInit = function () {

            window.FB.init({

                appId:
                    import.meta.env.VITE_META_APP_ID,

                cookie: true,

                xfbml: false,

                version: "v21.0"

            });

            console.log("META SDK LOADED");

        };

        (function (d, s, id) {

            let js;

            const fjs =
                d.getElementsByTagName(s)[0];

            if (d.getElementById(id))
                return;

            js = d.createElement(s);

            js.id = id;

            js.src =
                "https://connect.facebook.net/en_US/sdk.js";

            fjs.parentNode.insertBefore(
                js,
                fjs
            );

        })(
            document,
            "script",
            "facebook-jssdk"
        );

    }, []);

    //==========================================
    // CONNECT BUTTON - FIXED FOR COEXISTENCE
    //==========================================

    const handleConnect = () => {

        setAuthCode(null);
        setSignupData(null);
    
        window.FB.login(
    
            function (response) {
                if (response.authResponse) {
                    setAuthCode(response.authResponse.code);
                }
            },
    
            {
                config_id: "2148195946093199",
                response_type: "code",
                override_default_response_type: true,
                extras: {
                    version: "v4",
                    setup: {},
                    featureType: "whatsapp_business_app_onboarding",
                    sessionInfoVersion: "3"
                }
            }
    
        );
    
    };

    //==========================================
    // EMBEDDED SIGNUP RESPONSE - FIXED
    //==========================================

    useEffect(() => {

        const listener = (event) => {

            if (

                event.origin!==
                "https://www.facebook.com"

                &&

                event.origin!==
                "https://web.facebook.com"

            ) {

                return;

            }

            try {

                let data =
                    event.data;

                if (typeof data === "string") {

                    if (data.trim().startsWith("{")) {

                        data = JSON.parse(data);

                    }

                    else {

                        // ignore non-json urlencoded pings
                        return;
                    }

                }

                if (

                    data.type ===
                    "WA_EMBEDDED_SIGNUP"

                ) {

                    console.log(
                        "WA EMBEDDED SIGNUP EVENT"
                    );

                    console.log(data);

                    //==========================================
                    // COEXISTENCE FINISH - PRIMARY
                    //==========================================

                    if (

                        data.event ===
                        "FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING"

                    ) {

                        console.log(
                            "WHATSAPP BUSINESS APP ONBOARDING FINISHED"
                        );

                        console.log(
                            data.data
                        );

                        // Coexistence payload only has waba_id, businessId is in data.data.business_id or businessId
                        // Normalize to keep same field names for backend
                        const normalized = {
                            ...data.data,
                            business_id: data.data.business_id || data.data.businessId,
                            waba_id: data.data.waba_id,
                            phone_number_id: data.data.phone_number_id // may be undefined for coexistence initial sync - backend should fetch via waba_id
                        };

                        setSignupData(normalized);

                    }

                    //==========================================
                    // NORMAL EMBEDDED SIGNUP FINISH - IGNORE FOR COEXISTENCE
                    //==========================================

                    else if (

                        data.event ===
                        "FINISH"

                    ) {

                        console.log(
                            "EMBEDDED SIGNUP SUCCESS - NORMAL FLOW, NOT COEXISTENCE"
                        );

                        console.log(
                            data.data
                        );

                        // If you still want to support normal flow with same backend, keep this
                        // For coexistence-only, you can comment this block
                        setSignupData(
                            data.data
                        );

                    }

                    //==========================================
                    // CANCEL / ERROR
                    //==========================================

                    if (

                        data.event ===
                        "CANCEL"

                    ) {

                        console.log(
                            "USER CANCELLED SIGNUP",
                            data.data
                        );

                    }

                    if (

                        data.event ===
                        "ERROR"

                    ) {

                        console.log(
                            "EMBEDDED SIGNUP ERROR",
                            data.data
                        );

                        toast.error(
                            data.data?.error_message || "WhatsApp signup failed"
                        );

                    }

                }

            }

            catch (err) {

                console.error(
                    "MESSAGE PARSE ERROR:",
                    err instanceof Error
                        ? err.message
                        : err
                );

            }

        };

        window.addEventListener(
            "message",
            listener
        );

        return () => {

            window.removeEventListener(
                "message",
                listener
            );

        };

    }, []);

    //==========================================
    // SEND TO BACKEND - KEPT SAME FIELD NAMES
    //==========================================

    const sendToBackend = async () => {

        console.log("SEND TO BACKEND CALLED");
        console.trace();

        setConnecting(true);

        try {

            console.log(
                "SENDING TO BACKEND"
            );

            console.log({

                tenantId,
                authCode,
                signupData

            });

            const response =
                await exchangeMetaCode({

                    tenantId,

                    code:
                        authCode,

                    business_id:
                        signupData.business_id,

                    waba_id:
                        signupData.waba_id,

                    phone_number_id:
                        signupData.phone_number_id

                });

            console.log(
                "BACKEND RESPONSE"
            );

            console.log(response);

            await loadMetaConfig();

            toast.success(
                "WhatsApp Connected Successfully"
            );

        }

        catch (err) {

            console.error(
                "BACKEND ERROR:",
                {
                    message: getErrorMessage(err),
                    status: err.response?.status,
                    response: err.response?.data
                }
            );

            toast.error(
                getErrorMessage(err)
            );

        }
        finally {

            setConnecting(false);
    
        }

    };

    //==========================================
    // WAIT FOR BOTH - CODE EXPIRES FAST
    //==========================================

    useEffect(() => {

        if (

            authCode &&
            signupData

        ) {

            console.log(
                "AUTH CODE + SIGNUP DATA RECEIVED"
            );

            sendToBackend();

        }

    }, [
        authCode,
        signupData
    ]);

    //==========================================
    // DISCONNECT
    //==========================================

    const handleDisconnect = async () => {

        try {

            await disconnectWhatsApp(
                tenantId
            );

            await loadMetaConfig();

            toast.success(
                "WhatsApp Disconnected Successfully"
            );

        }

        catch (err) {

            console.error(
                "DISCONNECT WHATSAPP ERROR:",
                {
                    message: getErrorMessage(err),
                    status: err.response?.status,
                    response: err.response?.data
                }
            );
        
            toast.error(
                getErrorMessage(err)
            );

        }

    };

    //==========================================
    // STATUS
    //==========================================

    const isConnected =
        metaConfig?.connection_status === "active";

    //==========================================
    // META ACCOUNT STATUS
    //==========================================

    const verificationStatus =
        metaConfig?.business_verification_status ||
        "verified";

    const paymentStatus =
        metaConfig?.payment_status ||
        "Pending";

    const messagingLimitTier =
        metaConfig?.messaging_limit_tier ||
        null;

    //==========================================
    // MESSAGING STATUS
    //==========================================

    const messagingAvailable =
        isConnected &&
        paymentStatus === "AVAILABLE";

    const messagingLimited =
        isConnected &&
        paymentStatus === "LIMITED";

    const messagingBlocked =
        isConnected &&
        paymentStatus === "BLOCKED";

    //==========================================
    // Handle external Meta redirects
    //==========================================

    const handleMetaRedirect = (target) => {

        let redirectUrl = "";

        if (target === "PAYMENT") {

            const baseUrl =
                import.meta.env.VITE_META_PAYMENT_SETUP_BASE_URL;

            if (baseUrl && metaConfig?.business_id && metaConfig?.waba_id) {

                redirectUrl =
                    `${baseUrl}?business_id=${metaConfig.business_id}` +
                    `&waba_id=${metaConfig.waba_id}`;

            }

            else {

                console.warn(
                    "Payment URL base, business_id, or waba_id missing."
                );

            }

        }

        else if (target === "VERIFICATION") {

            const baseUrl =
                import.meta.env.VITE_META_SECURITY_CENTER_BASE_URL;

            if (baseUrl && metaConfig?.business_id) {

                redirectUrl =
                    `${baseUrl}?business_id=${metaConfig.business_id}`;

            }

            else {

                console.warn(
                    "Security Center URL base or business_id missing."
                );

            }

        }

        if (redirectUrl) {

            window.open(
                redirectUrl,
                "_blank",
                "noopener,noreferrer"
            );

        }

    };

    //==========================================
    // VERIFICATION DISPLAY
    //==========================================

    const getVerificationText = () => {

        switch (verificationStatus) {

            case "verified":
                return "Verified";

            case "pending":
                return "Verification Pending";

            case "not_verified":
                return "Not Verified";

            default:
                return "Unknown";

        }

    };

    if (loading) {

        return <h3>Loading...</h3>;

    }

    return (

        <div className="wa-connect-page">

            {connecting && (
                <div className="wa-connecting-overlay">
    
                    <div className="wa-connecting-card">
    
                        <div className="wa-connecting-spinner">
                            <div className="spinner-ring"></div>
                            <FaWhatsapp />
                        </div>
    
                        <h3>
                            Connecting WhatsApp
                        </h3>
    
                        <p>
                            Finalizing your WhatsApp Business
                            connection. This may take a few moments.
                        </p>
    
                        <div className="wa-connecting-progress">
                            <span></span>
                        </div>
    
                        <div className="wa-connecting-status">
                            <span className="status-pulse"></span>
                            Securely connecting to Meta
                        </div>
    
                    </div>
    
                </div>
            )}

            <div className="wa-card">

                <div className="wa-header">

                    <h2>
                        WhatsApp Business API
                    </h2>

                    <div
                        className={
                            isConnected
                               ? "connected-badge"
                                : "disconnected-badge"
                        }
                    >

                        <span className="status-dot"></span>

                        {
                            isConnected
                               ? "Connected"
                                : "Not Connected"
                        }

                    </div>

                </div>

                <div className="wa-main-grid">

                    <div className="wa-body">

                        <div className="wa-details">

                            <div className="detail-item">

                                <span className="label">
                                    Phone Number
                                </span>

                                <h4>
                                    {
                                        metaConfig?.business_phone ||
                                        "Not Connected"
                                    }
                                </h4>

                            </div>

                            <div className="detail-item">

                                <span className="label">
                                    Business
                                </span>

                                <h4>
                                    {
                                        metaConfig?.business_name ||
                                        "Unknown"
                                    }
                                </h4>

                            </div>

                            <div className="detail-item">

                                <span className="label">
                                    API Status
                                </span>

                                <div className="api-status">

                                    <span
                                        className={
                                            isConnected
                                               ? "green-dot"
                                                : "red-dot"
                                        }
                                    ></span>

                                    {
                                        isConnected
                                           ? "Active"
                                            : "Inactive"
                                    }

                                </div>

                            </div>

                        </div>

                        <div className="wa-icon-wrapper">

                            <div className="icon-bg">

                                <div className="icon-inner">

                                    <FaWhatsapp />

                                </div>

                            </div>

                        </div>

                    </div>

                    {isConnected && (

                        <div className="meta-account-section">

                            <div className="section-title">
                                Meta Account
                            </div>

                            <div className="meta-status-row">

                                <div className="meta-status-info">

                                    <span className="label">
                                        Business Verification
                                    </span>

                                    <div
                                        className={
                                            verificationStatus === "verified"
                                               ? "meta-status success"
                                                : "meta-status warning"
                                        }
                                    >

                                        <span
                                            className={
                                                verificationStatus === "verified"
                                                   ? "green-dot"
                                                    : "yellow-dot"
                                            }
                                        ></span>

                                        {
                                            getVerificationText()
                                        }

                                    </div>

                                </div>

                            </div>

                            <div className="meta-status-row">

                                <div className="meta-status-info">

                                    <span className="label">
                                        Payment Status
                                    </span>

                                    {paymentStatus === "BLOCKED" && (

                                        <>

                                            <div className="meta-status error">

                                                <span className="red-dot"></span>

                                                Payment setup blocked

                                            </div>

                                            <span className="payment-error-message">

                                                Messaging is currently unavailable because
                                                the Meta payment setup is blocked. Please
                                                complete or resolve your payment setup to
                                                resume messaging.

                                            </span>

                                        </>

                                    )}

                                    {paymentStatus === "LIMITED" && (

                                        <>

                                            <div className="meta-status warning">

                                                <span className="yellow-dot"></span>

                                                Limited messaging

                                            </div>

                                            <span className="payment-warning-message">

                                                Business Unverified - Messaging is limited
                                                to 250 unique customers.

                                            </span>

                                        </>

                                    )}

                                    {paymentStatus === "AVAILABLE" && (

                                        <>

                                            <div className="meta-status success">

                                                <span className="green-dot"></span>

                                                Payment setup active

                                            </div>

                                            <span className="payment-success-message">

                                                Payment setup is active and your WhatsApp
                                                account is available for messaging.

                                            </span>

                                        </>

                                    )}

                                </div>

                            </div>

                        </div>

                    )}

                </div>

                {isConnected && (

                    <div
                        className={
                            messagingBlocked
                               ? "messaging-status action-required"
                                : messagingLimited
                                   ? "messaging-status limited"
                                    : "messaging-status ready"
                        }
                    >

                        <div className="messaging-status-header">

                            <span
                                className={
                                    messagingBlocked
                                       ? "messaging-status-dot error-dot"
                                        : messagingLimited
                                           ? "messaging-status-dot warning-dot"
                                            : "messaging-status-dot ready-dot"
                                }
                            ></span>

                            <h3>

                                Messaging —{" "}

                                {
                                    messagingBlocked
                                       ? "Action Required"
                                        : messagingLimited
                                           ? "Limited"
                                            : "Ready"
                                }

                            </h3>

                        </div>

                        {messagingBlocked && (

                            <>

                                <p>

                                    Your WhatsApp account cannot currently
                                    send messages because the Meta payment
                                    setup is blocked.

                                </p>

                                <button
                                    className="payment-setup-btn messaging-action-btn"
                                    onClick={() =>
                                        handleMetaRedirect("PAYMENT")
                                    }
                                >

                                    Payment Setup

                                </button>

                            </>

                        )}

                        {!messagingBlocked && messagingLimited && (

                            <>

                                <p>

                                    Complete Meta Business verification to remove
                                    the 250-customer messaging limitation.

                                </p>

                                <button
                                    className="payment-setup-btn messaging-action-btn"
                                    onClick={() =>
                                        handleMetaRedirect("VERIFICATION")
                                    }
                                >

                                    Business Verification Setup

                                </button>

                            </>

                        )}

                        {messagingAvailable && (

                            <p>

                                Your WhatsApp account is ready to send and
                                receive messages.

                            </p>

                        )}

                    </div>

                )}

                <div className="wa-footer">

                    <p>

                        {
                            isConnected
                               ? "Connected on "
                                : "Not connected"
                        }

                        {
                            isConnected &&
                            (
                                metaConfig?.updated_at
                                   ? new Date(
                                        metaConfig.updated_at
                                    ).toLocaleString()
                                    : "--"
                            )
                        }

                    </p>

                    <div className="wa-buttons">

                        {
                           !isConnected && (

                                <button
                                    className="connect-btn"
                                    onClick={handleConnect}
                                    disabled={connecting}
                                >

                                    Connect

                                </button>

                            )
                        }

                        {
                            isConnected && (

                                <button
                                    className="disconnect-btn"
                                    onClick={() =>
                                        setShowDisconnectModal(true)
                                    }
                                    disabled={connecting}
                                >

                                    Disconnect

                                </button>

                            )
                        }

                        {
                            showDisconnectModal && (

                                <div
                                    className="modal-overlay"
                                    onClick={() =>
                                        setShowDisconnectModal(false)
                                    }
                                >

                                    <div
                                        className="modal"
                                        onClick={(e) =>
                                            e.stopPropagation()
                                        }
                                    >

                                        <h3>
                                            Disconnect WhatsApp?
                                        </h3>

                                        <p>

                                            Are you sure you want to
                                            disconnect your WhatsApp
                                            Business account?

                                            You won't be able to send
                                            or receive messages until
                                            you connect it again.

                                        </p>

                                        <div className="modal-actions">

                                            <button
                                                className="cancel-btn"
                                                onClick={() =>
                                                    setShowDisconnectModal(false)
                                                }
                                            >

                                                Cancel

                                            </button>

                                            <button
                                                className="confirm-btn"
                                                onClick={() => {

                                                    setShowDisconnectModal(false);

                                                    handleDisconnect();

                                                }}
                                            >

                                                Yes, Disconnect

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            )
                        }

                    </div>

                </div>

            </div>

        </div>

    );

}

export default WhatsAppConnect;
