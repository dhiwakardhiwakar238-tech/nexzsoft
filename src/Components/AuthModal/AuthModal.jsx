import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AuthModal.css";

import { loginUser, signupUser } from "../../services/api";
import { getErrorMessage } from "../../config/apiConfig";
import { initializeSession } from "../../services/sessionManager";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import {
    COUNTRIES,
    POPULAR_COUNTRIES,
} from "../../constants/countries";

import {
    X,
    Eye,
    EyeOff,
    ArrowRight,
    Sparkles,
    MessageCircle,
    Bot,
    ShieldCheck,
    Zap,
    CheckCircle2,
    Search,
    ChevronDown,
    Check,
} from "lucide-react";

function AuthModal({ closeAuth }) {
    const navigate = useNavigate();

    /* =====================================================
       AUTH MODE
    ===================================================== */

    const [isLogin, setIsLogin] = useState(true);

    /* =====================================================
       PASSWORD
    ===================================================== */

    const [showPassword, setShowPassword] = useState(false);

    /* =====================================================
       LOADING
    ===================================================== */

    const [loading, setLoading] = useState(false);

    /* =====================================================
       LOGIN STATE
    ===================================================== */

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    /* =====================================================
       SIGNUP STATE
    ===================================================== */

    const [form, setForm] = useState({
        name: "",
        company_name: "",
        country: "IN",
        whatsapp: "",
        email: "",
        password: "",
    });

    /* =====================================================
       SIGNUP ERROR STATE
    ===================================================== */

    const [errors, setErrors] = useState({
        name: "",
        company_name: "",
        country: "",
        whatsapp: "",
        email: "",
        password: "",
    });

    /* =====================================================
       COUNTRY SELECTOR
    ===================================================== */

    const [countryOpen, setCountryOpen] = useState(false);
    const [countrySearch, setCountrySearch] = useState("");

    /* =====================================================
       SELECTED COUNTRY
    ===================================================== */

    const selectedCountry =
        COUNTRIES.find(
            (country) =>
                country.code === form.country
        ) || null;

    /* =====================================================
       POPULAR COUNTRIES
    ===================================================== */

    const popularCountries =
        POPULAR_COUNTRIES
            .map((code) =>
                COUNTRIES.find(
                    (country) =>
                        country.code === code
                )
            )
            .filter(Boolean);

    /* =====================================================
       OTHER COUNTRIES
    ===================================================== */

    const otherCountries =
        COUNTRIES.filter(
            (country) =>
                !POPULAR_COUNTRIES.includes(
                    country.code
                )
        );

    /* =====================================================
       COUNTRY SEARCH
    ===================================================== */

    const normalizedCountrySearch =
        countrySearch
            .trim()
            .toLowerCase();

    const filterCountry = (country) => {
        if (!normalizedCountrySearch) {
            return true;
        }

        const searchWithoutPlus =
            normalizedCountrySearch.replace(
                /^\+/,
                ""
            );

        return (
            country.name
                .toLowerCase()
                .includes(
                    normalizedCountrySearch
                ) ||
            country.code
                .toLowerCase()
                .includes(
                    normalizedCountrySearch
                ) ||
            country.dialCode
                .toLowerCase()
                .includes(
                    normalizedCountrySearch
                ) ||
            country.dialCode
                .replace("+", "")
                .includes(
                    searchWithoutPlus
                )
        );
    };

    const filteredPopularCountries =
        popularCountries.filter(
            filterCountry
        );

    const filteredOtherCountries =
        otherCountries.filter(
            filterCountry
        );

    /* =====================================================
       UPDATE FORM
    ===================================================== */

    const updateForm = (
        field,
        value
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        /*
         * Clear the error for this field
         * as soon as the user starts editing it.
         */
        setErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    /* =====================================================
       COUNTRY SELECTION
    ===================================================== */

    const handleCountrySelect = (country) => {
        setForm((prev) => ({
            ...prev,
            country: country.code,
            whatsapp: "",
        }));

        setErrors((prev) => ({
            ...prev,
            country: "",
            whatsapp: "",
        }));

        setCountrySearch("");
        setCountryOpen(false);
    };

    /* =====================================================
       LOGIN
    ===================================================== */

    const handleLogin = async () => {
        if (
            !loginEmail.trim() ||
            !loginPassword.trim()
        ) {
            toast.error(
                "Please enter your email and password."
            );
            return;
        }

        try {
            setLoading(true);

            const response =
                await loginUser({
                    email: loginEmail.trim(),
                    password: loginPassword,
                });

            console.log(
                "LOGIN RESPONSE:",
                JSON.stringify(
                    response,
                    null,
                    2
                )
            );

            /* =================================================
               EXPECTED BACKEND RESPONSE

               {
                   success: true,
                   message: "Login successful",
                   data: {
                       token: "...",
                       tenant: {
                           tenant_id: "...",
                           user_id: "...",
                           name: "...",
                           business_name: "...",
                           email: "...",
                           whatsapp_number: "...",
                           role: "admin"
                       }
                   }
               }
            ================================================= */

            if (
                response?.success === true &&
                response?.data?.token &&
                response?.data?.tenant
            ) {
                const token =
                    response.data.token;

                const tenant =
                    response.data.tenant;

                /* =================================================
                   VALIDATE REQUIRED IDS
                ================================================= */

                if (!tenant.tenant_id) {
                    console.error(
                        "LOGIN ERROR: tenant_id missing",
                        tenant
                    );

                    toast.error(
                        "Login failed. Tenant information is missing."
                    );

                    return;
                }

                if (!tenant.user_id) {
                    console.error(
                        "LOGIN ERROR: user_id missing",
                        tenant
                    );

                    toast.error(
                        "Login failed. User information is missing."
                    );

                    return;
                }

                /* =================================================
                   SAVE JWT
                ================================================= */

                localStorage.setItem(
                    "token",
                    token
                );

                initializeSession();

                /* =================================================
                   IMPORTANT ID STORAGE

                   userId  = tenant_users.user_id
                   tenantId = tenants.tenant_id
                ================================================= */

                localStorage.setItem(
                    "userId",
                    tenant.user_id
                );

                localStorage.setItem(
                    "tenantId",
                    tenant.tenant_id
                );

                /* =================================================
                   SAVE USER INFORMATION
                ================================================= */

                localStorage.setItem(
                    "userName",
                    tenant.name || "User"
                );

                localStorage.setItem(
                    "businessName",
                    tenant.business_name || ""
                );

                localStorage.setItem(
                    "userEmail",
                    tenant.email || ""
                );

                localStorage.setItem(
                    "userRole",
                    tenant.role || ""
                );

                /* =================================================
                   SAVE COMPLETE USER OBJECT
                ================================================= */

                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        ...tenant,
                        user_id:
                            tenant.user_id,
                        tenant_id:
                            tenant.tenant_id,
                    })
                );

                /* =================================================
                   DEBUG
                ================================================= */

                console.log(
                    "======================================"
                );

                console.log(
                    "LOGIN SUCCESS"
                );

                console.log(
                    "USER ID:",
                    tenant.user_id
                );

                console.log(
                    "TENANT ID:",
                    tenant.tenant_id
                );

                console.log(
                    "USER NAME:",
                    tenant.name
                );

                console.log(
                    "USER ROLE:",
                    tenant.role
                );

                console.log(
                    "LOCAL STORAGE userId:",
                    localStorage.getItem(
                        "userId"
                    )
                );

                console.log(
                    "LOCAL STORAGE tenantId:",
                    localStorage.getItem(
                        "tenantId"
                    )
                );

                console.log(
                    "LOCAL STORAGE user:",
                    localStorage.getItem(
                        "user"
                    )
                );

                console.log(
                    "JWT EXISTS:",
                    !!localStorage.getItem(
                        "token"
                    )
                );

                console.log(
                    "======================================"
                );

                /* =================================================
                   CLOSE MODAL
                ================================================= */

                closeAuth();

                /* =================================================
                   GO DASHBOARD
                ================================================= */

                navigate("/dashboard");

                return;
            }

            /* =====================================================
               LOGIN FAILED
            ===================================================== */

            toast.error(
                response?.message ||
                    response?.error ||
                    response?.data?.message ||
                    "Invalid email or password."
            );
        } catch (error) {
            console.error(
                "LOGIN ERROR:",
                error
            );

            toast.error(
                getErrorMessage(error)
            );
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       SIGNUP VALIDATION
    ===================================================== */

    const validateSignup = () => {
        const newErrors = {
            name: "",
            company_name: "",
            country: "",
            whatsapp: "",
            email: "",
            password: "",
        };

        let hasErrors = false;

        /* =================================================
           FULL NAME
        ================================================= */

        if (!form.name.trim()) {
            newErrors.name =
                "Please enter your full name.";

            hasErrors = true;
        }

        /* =================================================
           BUSINESS NAME
        ================================================= */

        if (!form.company_name.trim()) {
            newErrors.company_name =
                "Please enter your business name.";

            hasErrors = true;
        }

        /* =================================================
           COUNTRY
        ================================================= */

        if (!form.country) {
            newErrors.country =
                "Please select your country.";

            hasErrors = true;
        }

        /* =================================================
           EMAIL
        ================================================= */

        if (!form.email.trim()) {
            newErrors.email =
                "Please enter your email.";

            hasErrors = true;
        } else {
            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (
                !emailPattern.test(
                    form.email.trim()
                )
            ) {
                newErrors.email =
                    "Please enter a valid email address.";

                hasErrors = true;
            }
        }

        /* =================================================
           PASSWORD
        ================================================= */

        if (!form.password.trim()) {
            newErrors.password =
                "Please create a password.";

            hasErrors = true;
        } else if (
            form.password.length < 6
        ) {
            newErrors.password =
                "Password must be at least 6 characters.";

            hasErrors = true;
        }

        /* =================================================
           COUNTRY OBJECT
        ================================================= */

        const selected =
            COUNTRIES.find(
                (country) =>
                    country.code ===
                    form.country
            );

        if (!selected) {
            newErrors.country =
                "Please select a valid country.";

            hasErrors = true;
        }

        /* =================================================
           WHATSAPP NUMBER
        ================================================= */

        if (!form.whatsapp.trim()) {
            newErrors.whatsapp =
                "Please enter your WhatsApp number.";

            hasErrors = true;
        } else if (selected) {
            const phoneNumber =
                parsePhoneNumberFromString(
                    form.whatsapp.trim(),
                    selected.code
                );

            if (
                !phoneNumber ||
                !phoneNumber.isValid()
            ) {
                newErrors.whatsapp =
                    `Please enter a valid WhatsApp number for ${selected.name}.`;

                hasErrors = true;
            }
        }

        /* =================================================
           SET ERRORS
        ================================================= */

        setErrors(newErrors);

        return {
            hasErrors,
            selectedCountry: selected,
        };
    };

    /* =====================================================
       SIGNUP
    ===================================================== */

    const handleSignup = async () => {
        /* =================================================
           VALIDATE FORM
        ================================================= */

        const {
            hasErrors,
            selectedCountry,
        } = validateSignup();

        if (hasErrors) {
            return;
        }

        /* =================================================
           PHONE VALIDATION
        ================================================= */

        const rawPhone =
            form.whatsapp.trim();

        /*
         * Parse using the selected ISO country.
         *
         * Example:
         *
         * country = IN
         * whatsapp = 9988776655
         *
         * normalizedPhone = +919988776655
         */

        const phoneNumber =
            parsePhoneNumberFromString(
                rawPhone,
                selectedCountry.code
            );

        if (
            !phoneNumber ||
            !phoneNumber.isValid()
        ) {
            setErrors((prev) => ({
                ...prev,
                whatsapp:
                    `Please enter a valid WhatsApp number for ${selectedCountry.name}.`,
            }));

            return;
        }

        /* =================================================
           NORMALIZED PHONE
        ================================================= */

        const normalizedPhone =
            phoneNumber.number;

        console.log(
            "PHONE VALIDATION:",
            {
                country:
                    selectedCountry.code,

                countryName:
                    selectedCountry.name,

                dialCode:
                    selectedCountry.dialCode,

                input:
                    rawPhone,

                normalizedPhone,
            }
        );

        /* =================================================
           API PAYLOAD
        ================================================= */

        const signupPayload = {
            ...form,

            /*
             * Normalized international
             * WhatsApp number.
             */
            whatsapp:
                normalizedPhone,

            /*
             * ISO alpha-2 country code.
             */
            country:
                selectedCountry.code,
        };

        /* =================================================
           API REQUEST
        ================================================= */

        try {
            setLoading(true);

            const data =
                await signupUser(
                    signupPayload
                );

            console.log(
                "SIGNUP RESPONSE:",
                JSON.stringify(
                    data,
                    null,
                    2
                )
            );

            /* =================================================
               SUCCESS
            ================================================= */

            if (
                data?.success === true ||
                data?.message ||
                data?.data
            ) {
                toast.success(
                    "Account created successfully. Please login."
                );

                /* ================================================
                   SWITCH TO LOGIN
                ================================================ */

                setIsLogin(true);

                setLoginEmail(
                    form.email
                );

                setLoginPassword("");

                setShowPassword(false);

                /* ================================================
                   RESET SIGNUP FORM
                ================================================ */

                setForm({
                    name: "",
                    company_name: "",
                    country: "IN",
                    whatsapp: "",
                    email: "",
                    password: "",
                });

                setErrors({
                    name: "",
                    company_name: "",
                    country: "",
                    whatsapp: "",
                    email: "",
                    password: "",
                });

                setCountrySearch("");
                setCountryOpen(false);
            } else {
                /*
                 * API returned a signup failure.
                 *
                 * If backend identifies a specific field,
                 * show it directly under that field.
                 */

                const message =
                    data?.error ||
                    data?.message ||
                    "Signup failed. Please try again.";

                const lowerMessage =
                    String(message).toLowerCase();

                if (
                    lowerMessage.includes(
                        "email"
                    )
                ) {
                    setErrors((prev) => ({
                        ...prev,
                        email: message,
                    }));
                } else if (
                    lowerMessage.includes(
                        "whatsapp"
                    ) ||
                    lowerMessage.includes(
                        "phone"
                    ) ||
                    lowerMessage.includes(
                        "mobile"
                    )
                ) {
                    setErrors((prev) => ({
                        ...prev,
                        whatsapp: message,
                    }));
                } else if (
                    lowerMessage.includes(
                        "business"
                    ) ||
                    lowerMessage.includes(
                        "company"
                    )
                ) {
                    setErrors((prev) => ({
                        ...prev,
                        company_name: message,
                    }));
                } else {
                    toast.error(message);
                }
            }
        } catch (error) {
            console.error(
                "SIGNUP ERROR:",
                error
            );

            const message =
                getErrorMessage(error);

            const lowerMessage =
                String(message).toLowerCase();

            /*
             * Map backend errors to the
             * appropriate signup field.
             */

            if (
                lowerMessage.includes(
                    "email"
                )
            ) {
                setErrors((prev) => ({
                    ...prev,
                    email: message,
                }));
            } else if (
                lowerMessage.includes(
                    "whatsapp"
                ) ||
                lowerMessage.includes(
                    "phone"
                ) ||
                lowerMessage.includes(
                    "mobile"
                )
            ) {
                setErrors((prev) => ({
                    ...prev,
                    whatsapp: message,
                }));
            } else if (
                lowerMessage.includes(
                    "business"
                ) ||
                lowerMessage.includes(
                    "company"
                )
            ) {
                setErrors((prev) => ({
                    ...prev,
                    company_name: message,
                }));
            } else {
                toast.error(message);
            }
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       SWITCH LOGIN / SIGNUP
    ===================================================== */

    const switchMode = () => {
        setIsLogin((prev) => !prev);

        setShowPassword(false);

        /*
         * Clear signup errors when switching
         * between login and signup.
         */
        setErrors({
            name: "",
            company_name: "",
            country: "",
            whatsapp: "",
            email: "",
            password: "",
        });

        setCountrySearch("");
        setCountryOpen(false);
    };

    /* =====================================================
       COUNTRY OPTION RENDERER
    ===================================================== */

    const renderCountryOption = (
        country
    ) => (
        <button
            key={country.code}
            type="button"
            className="auth-country-option"
            onClick={() =>
                handleCountrySelect(
                    country
                )
            }
            role="option"
            aria-selected={
                form.country ===
                country.code
            }
        >
            <span className="auth-country-code">
                {country.dialCode}
                {" - "}
                {country.code}
            </span>

            <span className="auth-country-name">
                {country.name}
            </span>

            {form.country ===
                country.code && (
                <Check size={15} />
            )}
        </button>
    );

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div
            className="auth-overlay"
            onMouseDown={(e) => {
                if (
                    e.target ===
                    e.currentTarget
                ) {
                    closeAuth();
                }
            }}
        >
            <div className="auth-modal">

                {/* =================================================
                    LEFT BRAND PANEL
                ================================================= */}

                <section className="auth-brand-panel">

                    <div className="auth-brand-content">

                        <div className="auth-brand-main">

                            {/* Badge */}

                            <div className="auth-brand-badge">

                                <Sparkles size={14} />

                                <span>
                                    AI-Powered Customer Engagement
                                </span>

                            </div>

                            {/* Heading */}

                            <h2>
                                Smarter conversations.
                                <span>
                                    Better business.
                                </span>
                            </h2>

                            {/* Description */}

                            <p>
                                Bring AI, automation, and
                                customer conversations
                                together in one intelligent
                                platform.
                            </p>

                            {/* Benefits */}

                            <div className="auth-benefits">

                                <div>

                                    <CheckCircle2 size={17} />

                                    <span>
                                        AI-powered customer
                                        conversations
                                    </span>

                                </div>

                                <div>

                                    <CheckCircle2 size={17} />

                                    <span>
                                        WhatsApp & omnichannel
                                        engagement
                                    </span>

                                </div>

                                <div>

                                    <CheckCircle2 size={17} />

                                    <span>
                                        Intelligent workflow
                                        automation
                                    </span>

                                </div>

                            </div>

                        </div>

                        {/* =================================================
                            MINI PRODUCT PREVIEW
                        ================================================= */}

                        <div className="auth-product-preview">

                            <div className="auth-preview-header">

                                <div className="auth-preview-title">

                                    <div className="auth-preview-icon">

                                        <Bot size={17} />

                                    </div>

                                    <div>

                                        <strong>
                                            AI Assistant
                                        </strong>

                                        <span>
                                            Active now
                                        </span>

                                    </div>

                                </div>

                                <div className="auth-online">
                                    <span />
                                </div>

                            </div>

                            {/* Customer */}

                            <div className="auth-message customer">

                                <div className="auth-message-avatar">
                                    <MessageCircle size={13} />
                                </div>

                                <span>
                                    Can you help me with my
                                    order?
                                </span>

                            </div>

                            {/* AI */}

                            <div className="auth-message ai">

                                <div className="auth-message-avatar">
                                    <Bot size={13} />
                                </div>

                                <span>
                                    Absolutely. Let me check
                                    that for you.
                                </span>

                            </div>

                            {/* Footer */}

                            <div className="auth-preview-footer">

                                <div>

                                    <Zap size={13} />

                                    <span>
                                        AI response generated
                                    </span>

                                </div>

                                <ShieldCheck size={14} />

                            </div>

                        </div>

                        {/* Brand Footer */}

                        <div className="auth-brand-footer">
                            Built for modern businesses
                        </div>

                    </div>

                </section>

                {/* =================================================
                    RIGHT FORM PANEL
                ================================================= */}

                <section className="auth-form-panel">

                    {/* Close */}

                    <button
                        type="button"
                        className="auth-close"
                        onClick={closeAuth}
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>

                    <div className="auth-form-container">

                        {/* =================================================
                            HEADER
                        ================================================= */}

                        <div className="auth-form-header">

                            <span className="auth-form-eyebrow">

                                {isLogin
                                    ? "WELCOME BACK"
                                    : "GET STARTED"}

                            </span>

                            <h1>

                                {isLogin
                                    ? "Welcome back"
                                    : "Create your account"}

                            </h1>

                            <p>

                                {isLogin
                                    ? "Sign in to continue to your Nexzsoft workspace."
                                    : "Start building smarter customer experiences with Nexzsoft."}

                            </p>

                        </div>

                        {/* =================================================
                            LOGIN
                        ================================================= */}

                        {isLogin ? (

                            <div className="auth-form">

                                {/* Email */}

                                <div className="auth-field">

                                    <label htmlFor="login-email">
                                        Email address
                                    </label>

                                    <input
                                        id="login-email"
                                        type="email"
                                        placeholder="you@company.com"
                                        value={loginEmail}
                                        onChange={(e) =>
                                            setLoginEmail(
                                                e.target.value
                                            )
                                        }
                                        autoComplete="email"
                                    />

                                </div>

                                {/* Password */}

                                <div className="auth-field">

                                    <label htmlFor="login-password">
                                        Password
                                    </label>

                                    <div className="auth-password">

                                        <input
                                            id="login-password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter your password"
                                            value={loginPassword}
                                            onChange={(e) =>
                                                setLoginPassword(
                                                    e.target.value
                                                )
                                            }
                                            autoComplete="current-password"
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key ===
                                                    "Enter"
                                                ) {
                                                    handleLogin();
                                                }
                                            }}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (prev) =>
                                                        !prev
                                                )
                                            }
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >

                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}

                                        </button>

                                    </div>

                                </div>

                                {/* Remember / Forgot */}

                                <div className="auth-forgot-row">

                                    <label className="auth-checkbox">

                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) =>
                                                setRememberMe(
                                                    e.target.checked
                                                )
                                            }
                                        />

                                        <span>
                                            Remember me
                                        </span>

                                    </label>

                                    <button
                                        type="button"
                                        className="forgot-password"
                                        onClick={() =>
                                            toast.error(
                                                "Password reset feature coming soon."
                                            )
                                        }
                                    >
                                        Forgot password?
                                    </button>

                                </div>

                                {/* Login */}

                                <button
                                    type="button"
                                    className="auth-submit"
                                    onClick={handleLogin}
                                    disabled={loading}
                                >

                                    {loading ? (

                                        <>
                                            <span className="auth-spinner" />
                                            Signing in...
                                        </>

                                    ) : (

                                        <>
                                            <span>
                                                Sign in
                                            </span>

                                            <ArrowRight
                                                size={17}
                                            />
                                        </>

                                    )}

                                </button>

                                {/* Divider */}

                                <div className="auth-divider">
                                    <span>OR</span>
                                </div>

                                {/* Security */}

                                <div className="auth-security">

                                    <ShieldCheck size={17} />

                                    <span>
                                        Your account and business
                                        data are securely protected.
                                    </span>

                                </div>

                                {/* Switch */}

                                <p className="auth-switch">

                                    Don't have an account?

                                    <button
                                        type="button"
                                        onClick={switchMode}
                                    >
                                        Create account
                                    </button>

                                </p>

                                {/* Terms */}

                                <p className="auth-terms">

                                    By continuing, you agree to
                                    Nexzsoft's{" "}

                                    <Link
                                        to="/terms"
                                        className="auth-terms-link"
                                        onClick={closeAuth}
                                    >
                                        Terms of Service
                                    </Link>{" "}

                                    and{" "}

                                    <Link
                                        to="/privacy-policy"
                                        className="auth-terms-link"
                                        onClick={closeAuth}
                                    >
                                        Privacy Policy
                                    </Link>
                                    .

                                </p>

                            </div>

                        ) : (

                            /* =================================================
                               SIGNUP
                            ================================================= */

                            <div className="auth-form signup-form">

                                {/* =================================================
                                    FULL NAME
                                ================================================= */}

                                <div className="auth-field">

                                    <label htmlFor="signup-name">
                                        Full name
                                    </label>

                                    <input
                                        id="signup-name"
                                        type="text"
                                        placeholder="Your full name"
                                        className={
                                            errors.name
                                                ? "auth-input-error"
                                                : ""
                                        }
                                        value={
                                            form.name
                                        }
                                        onChange={(e) =>
                                            updateForm(
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        autoComplete="name"
                                    />

                                    {errors.name && (
                                        <div className="auth-field-error">
                                            {errors.name}
                                        </div>
                                    )}

                                </div>

                                {/* =================================================
                                    BUSINESS
                                ================================================= */}

                                <div className="auth-field">

                                    <label htmlFor="signup-company">
                                        Business name
                                    </label>

                                    <input
                                        id="signup-company"
                                        type="text"
                                        placeholder="Your company name"
                                        className={
                                            errors.company_name
                                                ? "auth-input-error"
                                                : ""
                                        }
                                        value={
                                            form.company_name
                                        }
                                        onChange={(e) =>
                                            updateForm(
                                                "company_name",
                                                e.target.value
                                            )
                                        }
                                        autoComplete="organization"
                                    />

                                    {errors.company_name && (
                                        <div className="auth-field-error">
                                            {
                                                errors.company_name
                                            }
                                        </div>
                                    )}

                                </div>

                                {/* =================================================
                                    WHATSAPP
                                ================================================= */}

                                <div className="auth-field">

                                    <label htmlFor="signup-whatsapp">
                                        WhatsApp number
                                    </label>

                                    <div
                                        className={
                                            errors.whatsapp
                                                ? "auth-phone auth-phone-error"
                                                : "auth-phone"
                                        }
                                    >

                                        {/* =================================================
                                            COUNTRY SELECTOR
                                        ================================================= */}

                                        <div className="auth-country-selector">

                                            <button
                                                type="button"
                                                className={
                                                    errors.country
                                                        ? "auth-country-trigger auth-input-error"
                                                        : "auth-country-trigger"
                                                }
                                                onClick={() =>
                                                    setCountryOpen(
                                                        (prev) =>
                                                            !prev
                                                    )
                                                }
                                                aria-haspopup="listbox"
                                                aria-expanded={
                                                    countryOpen
                                                }
                                            >

                                                <span className="auth-country-selected">

                                                    {selectedCountry
                                                        ? `${selectedCountry.dialCode} - ${selectedCountry.code}`
                                                        : "Select country"}

                                                </span>

                                                <ChevronDown
                                                    size={16}
                                                    className={
                                                        countryOpen
                                                            ? "auth-country-chevron open"
                                                            : "auth-country-chevron"
                                                    }
                                                />

                                            </button>

                                            {/* =================================================
                                                COUNTRY DROPDOWN
                                            ================================================= */}

                                            {countryOpen && (

                                                <div
                                                    className="auth-country-dropdown"
                                                    role="listbox"
                                                >

                                                    {/* Search */}

                                                    <div className="auth-country-search">

                                                        <Search
                                                            size={15}
                                                        />

                                                        <input
                                                            type="text"
                                                            placeholder="Search country or code..."
                                                            value={
                                                                countrySearch
                                                            }
                                                            onChange={(e) =>
                                                                setCountrySearch(
                                                                    e.target.value
                                                                )
                                                            }
                                                            autoFocus
                                                            aria-label="Search country"
                                                        />

                                                    </div>

                                                    {/* =================================================
                                                        SEARCH RESULTS
                                                    ================================================= */}

                                                    {normalizedCountrySearch ? (

                                                        <div className="auth-country-list">

                                                            {filteredPopularCountries.length === 0 &&
                                                            filteredOtherCountries.length === 0 ? (

                                                                <div className="auth-country-empty">
                                                                    No countries found
                                                                </div>

                                                            ) : (

                                                                <>
                                                                    {filteredPopularCountries.map(
                                                                        renderCountryOption
                                                                    )}

                                                                    {filteredOtherCountries.map(
                                                                        renderCountryOption
                                                                    )}
                                                                </>

                                                            )}

                                                        </div>

                                                    ) : (

                                                        <>

                                                            {/* =================================================
                                                                POPULAR COUNTRIES
                                                            ================================================= */}

                                                            <div className="auth-country-section-title">
                                                                Popular countries
                                                            </div>

                                                            <div className="auth-country-list">

                                                                {popularCountries.map(
                                                                    renderCountryOption
                                                                )}

                                                            </div>

                                                            {/* =================================================
                                                                ALL COUNTRIES
                                                            ================================================= */}

                                                            <div className="auth-country-section-title">
                                                                All countries
                                                            </div>

                                                            <div className="auth-country-list">

                                                                {otherCountries.map(
                                                                    renderCountryOption
                                                                )}

                                                            </div>

                                                        </>

                                                    )}

                                                </div>

                                            )}

                                        </div>

                                        {/* =================================================
                                            PHONE NUMBER
                                        ================================================= */}

                                        <input
                                            id="signup-whatsapp"
                                            type="tel"
                                            placeholder="WhatsApp number"
                                            className={
                                                errors.whatsapp
                                                    ? "auth-input-error"
                                                    : ""
                                            }
                                            value={
                                                form.whatsapp
                                            }
                                            onChange={(e) =>
                                                updateForm(
                                                    "whatsapp",
                                                    e.target.value
                                                )
                                            }
                                            autoComplete="tel"
                                            inputMode="tel"
                                        />

                                    </div>

                                    {errors.whatsapp && (
                                        <div className="auth-field-error">
                                            {errors.whatsapp}
                                        </div>
                                    )}

                                </div>

                                {/* =================================================
                                    EMAIL
                                ================================================= */}

                                <div className="auth-field">

                                    <label htmlFor="signup-email">
                                        Work email
                                    </label>

                                    <input
                                        id="signup-email"
                                        type="email"
                                        placeholder="you@company.com"
                                        className={
                                            errors.email
                                                ? "auth-input-error"
                                                : ""
                                        }
                                        value={
                                            form.email
                                        }
                                        onChange={(e) =>
                                            updateForm(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        autoComplete="email"
                                    />

                                    {errors.email && (
                                        <div className="auth-field-error">
                                            {errors.email}
                                        </div>
                                    )}

                                </div>

                                {/* =================================================
                                    PASSWORD
                                ================================================= */}

                                <div className="auth-field">

                                    <label htmlFor="signup-password">
                                        Password
                                    </label>

                                    <div
                                        className={
                                            errors.password
                                                ? "auth-password auth-password-error"
                                                : "auth-password"
                                        }
                                    >

                                        <input
                                            id="signup-password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Create a password"
                                            className={
                                                errors.password
                                                    ? "auth-input-error"
                                                    : ""
                                            }
                                            value={
                                                form.password
                                            }
                                            onChange={(e) =>
                                                updateForm(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            autoComplete="new-password"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (prev) =>
                                                        !prev
                                                )
                                            }
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >

                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}

                                        </button>

                                    </div>

                                    {errors.password && (
                                        <div className="auth-field-error">
                                            {
                                                errors.password
                                            }
                                        </div>
                                    )}

                                </div>

                                {/* =================================================
                                    CREATE ACCOUNT
                                ================================================= */}

                                <button
                                    type="button"
                                    className="auth-submit"
                                    onClick={
                                        handleSignup
                                    }
                                    disabled={
                                        loading
                                    }
                                >

                                    {loading ? (

                                        <>
                                            <span className="auth-spinner" />
                                            Creating account...
                                        </>

                                    ) : (

                                        <>
                                            <span>
                                                Create account
                                            </span>

                                            <ArrowRight
                                                size={17}
                                            />
                                        </>

                                    )}

                                </button>

                                {/* =================================================
                                    SECURITY
                                ================================================= */}

                                <div className="auth-security">

                                    <ShieldCheck size={17} />

                                    <span>
                                        Your account and business
                                        data are securely protected.
                                    </span>

                                </div>

                                {/* =================================================
                                    SWITCH
                                ================================================= */}

                                <p className="auth-switch">

                                    Already have an account?

                                    <button
                                        type="button"
                                        onClick={
                                            switchMode
                                        }
                                    >
                                        Sign in
                                    </button>

                                </p>

                                {/* =================================================
                                    TERMS
                                ================================================= */}

                                <p className="auth-terms">

                                    By creating an account, you agree
                                    to Nexzsoft's{" "}

                                    <Link
                                        to="/terms"
                                        className="auth-terms-link"
                                        onClick={
                                            closeAuth
                                        }
                                    >
                                        Terms of Service
                                    </Link>{" "}

                                    and{" "}

                                    <Link
                                        to="/privacy-policy"
                                        className="auth-terms-link"
                                        onClick={
                                            closeAuth
                                        }
                                    >
                                        Privacy Policy
                                    </Link>
                                    .

                                </p>

                            </div>

                        )}

                    </div>

                </section>

            </div>
        </div>
    );
}

export default AuthModal;
