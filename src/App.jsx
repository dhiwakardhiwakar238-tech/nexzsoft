import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";

// Components
import Navbar from "./Components/Navbar/Navbar";
import AuthModal from "./Components/AuthModal/AuthModal";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

import WhatsAppButton from "./Components/WhatsAppButton/WhatsAppButton";

// Pages
import Home from "./Pages/HomePage";
import AboutPage from "./Pages/AboutPage";
import PricingPage from "./Pages/PricingPage";
import ContactPage from "./Pages/ContactPage";
import DashboardPage from "./Pages/DashboardPage";
import NotFoundPage from "./Pages/NotFoundPage";
import ResourcesPage from "./Pages/ResourcesPage";

//

import PrivacyPolicyPage from "./Pages/PrivacyPolicyPage";
import TermsPage from "./Pages/TermsPage";
import CookiePolicyPage from "./Pages/CookiePolicyPage";
import RefundPolicyPage from "./Pages/RefundPolicyPage";
import SecurityPolicyPage from "./Pages/SecurityPolicyPage";

//

import AIChatWidget from "./Components/AIChatWidget/AIChatWidget";



function App() {
  const [authOpen, setAuthOpen] =
    useState(false);

  const openAuth = () => {
    setAuthOpen(true);
  };

  const closeAuth = () => {
    setAuthOpen(false);
  };

  return (
    <div className="app">

      {/* Navbar */}
      <Navbar openAuth={openAuth} />

      {/* Routes */}
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/about"
          element={<AboutPage />}
        />

        <Route
          path="/pricing"
          element={<PricingPage />}
        />

        <Route
          path="/contact-sales"
          element={<ContactPage />}
        />

        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />

        <Route
          path="/resources"
          element={<ResourcesPage />}
        />


        <Route
          path="/privacy-policy"
          element={<PrivacyPolicyPage />}
        />

        <Route
          path="/terms"
          element={<TermsPage />}
        />

        <Route
          path="/cookie-policy"
          element={<CookiePolicyPage />}
        />

        <Route
          path="/refund-policy"
          element={<RefundPolicyPage />}
        />

        <Route
          path="/security-policy"
          element={<SecurityPolicyPage />}
        />


      </Routes>

      {/* Auth Modal */}
      {authOpen && (
        <AuthModal
          closeAuth={closeAuth}
        />
      )}

      <WhatsAppButton />

      <AIChatWidget />

    </div>
  );
}

export default App;