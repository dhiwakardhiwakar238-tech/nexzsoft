
import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import "./App.css";

// Components
import Navbar from "./Components/Navbar/Navbar";
import AuthModal from "./Components/AuthModal/AuthModal";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

import WhatsAppButton from "./Components/WhatsAppButton/WhatsAppButton";
import AIChatWidget from "./Components/AIChatWidget/AIChatWidget";

// Pages
import Home from "./Pages/HomePage";
import AboutPage from "./Pages/AboutPage";
import Solutions from "./Pages/Solutions";
import BlogsPage from "./Pages/BlogsPage";
import ToolkitPage from "./Pages/ToolkitPage";
import CareersPage from "./Pages/CareersPage";
import ContactUsPage from "./Pages/ContactUsPage";
import PricingPage from "./Pages/PricingPage";
import ContactPage from "./Pages/ContactPage";
import NotFoundPage from "./Pages/NotFoundPage";
import ResourcesPage from "./Pages/ResourcesPage";

import PrivacyPolicyPage from "./Pages/PrivacyPolicyPage";
import TermsPage from "./Pages/TermsPage";
import CookiesPolicyPage from "./Pages/CookiesPolicyPage";
import RefundPolicyPage from "./Pages/RefundPolicyPage";
import SecurityPolicyPage from "./Pages/SecurityPolicyPage";

import DashboardV2 from "./Components/DashboardV2/DashboardV2";
import PartnerProgramPage from "./Pages/PartnerProgramPage";

function App() {
  const [authOpen, setAuthOpen] = useState(false);

  const openAuth = () => {
    setAuthOpen(true);
  };

  const closeAuth = () => {
    setAuthOpen(false);
  };

  const location = useLocation();

  // Scroll to top whenever the route changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [location.pathname]);

  const isDashboard = location.pathname === "/dashboard";

  return (
    <div className="app">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      {!isDashboard && (
        <Navbar openAuth={openAuth} />
      )}

      {/* =====================================================
          ROUTES
      ===================================================== */}

      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={<Home openAuth={openAuth} />}
        />

        {/* Main Pages */}

        <Route
          path="/solutions"
          element={<Solutions />}
        />

        <Route
          path="/about"
          element={<AboutPage openAuth={openAuth} />}
        />

        <Route
          path="/pricing"
          element={<PricingPage />}
        />

        <Route
          path="/contact-sales"
          element={<ContactUsPage openAuth={openAuth} />}
        />

        <Route
          path="/contact"
          element={<ContactUsPage openAuth={openAuth} />}
        />

        {/* =====================================================
            DASHBOARD
        ===================================================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardV2 />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            RESOURCES
        ===================================================== */}

        <Route
          path="/resources"
          element={<ResourcesPage />}
        />

        <Route
          path="/blogs"
          element={<BlogsPage openAuth={openAuth} />}
        />

        <Route
          path="/careers"
          element={<CareersPage />}
        />

        <Route
          path="/partner-program"
          element={<PartnerProgramPage />}
        />

        <Route
          path="/toolkit"
          element={<ToolkitPage />}
        />

        {/* =====================================================
            LEGAL / POLICY
        ===================================================== */}

        <Route
          path="/privacy-policy"
          element={<PrivacyPolicyPage />}
        />

        <Route
          path="/terms"
          element={<TermsPage />}
        />

        <Route
          path="/cookiespolicy"
          element={<CookiesPolicyPage />}
        />

        <Route
          path="/cookie-policy"
          element={<CookiesPolicyPage />}
        />

        <Route
          path="/refund-policy"
          element={<RefundPolicyPage />}
        />

        <Route
          path="/securitypolicy"
          element={<SecurityPolicyPage />}
        />

        <Route
          path="/security-policy"
          element={<SecurityPolicyPage />}
        />

        {/* =====================================================
            404 - MUST BE LAST
        ===================================================== */}

        <Route
          path="*"
          element={<NotFoundPage />}
        />

      </Routes>

      {/* =====================================================
          AUTH MODAL
      ===================================================== */}

      {authOpen && (
        <AuthModal
          closeAuth={closeAuth}
        />
      )}

      {/* =====================================================
          FLOATING BUTTONS / WIDGETS
      ===================================================== */}

      {/*<WhatsAppButton />*/}

      <AIChatWidget />

    </div>
  );
}

export default App;

