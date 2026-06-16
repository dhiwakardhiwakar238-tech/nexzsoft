import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";

// Components
import Navbar from "./Components/Navbar/Navbar";
import AuthModal from "./Components/AuthModal/AuthModal";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

// Pages
import Home from "./Pages/HomePage";
import AboutPage from "./Pages/AboutPage";
import PricingPage from "./Pages/PricingPage";
import ContactPage from "./Pages/ContactPage";
import DashboardPage from "./Pages/DashboardPage";

function App() {
  const [authOpen, setAuthOpen] = useState(false);

  const openAuth = () => {
    setAuthOpen(true);
  };

  const closeAuth = () => {
    setAuthOpen(false);
  };

  return (
    <div className="app">
      <Navbar openAuth={openAuth} />

      <Routes>
        <Route path="/" element={<Home />} />

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
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      {authOpen && (
        <AuthModal closeAuth={closeAuth} />
      )}
    </div>
  );
}

export default App;