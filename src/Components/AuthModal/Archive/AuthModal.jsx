import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthModal.css";

import {
  loginUser,
  signupUser,
} from "../../services/api";

function AuthModal({ closeAuth }) {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  // Login State
  const [loginEmail, setLoginEmail] =
    useState("");

  const [loginPassword, setLoginPassword] =
    useState("");

  // Signup State
  const [form, setForm] = useState({
    name: "",
    company_name: "",
    code: "+91",
    whatsapp: "",
    email: "",
    password: "",
  });

  // Login API
  const handleLogin = async () => {
    const response = await loginUser(
      loginEmail,
      loginPassword
    );

    console.log(
      "LOGIN RESPONSE:",
      JSON.stringify(response, null, 2)
    );

    // Case 1
    if (response?.data?.id) {

      localStorage.setItem(
        "userId",
        response.data.id
      );

      localStorage.setItem(
        "tenantId",
        response.data.tenant_id || ""
      );

      localStorage.setItem(
        "token",
        response.data.token || ""
      );

      // NEW
      localStorage.setItem(
        "userName",
        response.data.name || "User"
      );

      localStorage.setItem(
        "businessName",
        response.data.business_name || ""
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data)
      );

      console.log("here is my response.data", response.data.token);

      closeAuth();

      navigate("/dashboard");

      return;
    }

    // Case 2
    if (response?.data?.user?.id) {

      localStorage.setItem(
        "userId",
        response.data.user.id
      );

      localStorage.setItem(
        "tenantId",
        response.data.user.tenant_id || ""
      );

      localStorage.setItem(
        "token",
        response.data.token || ""
      );

      // NEW
      localStorage.setItem(
        "userName",
        response.data.user.name || "User"
      );

      localStorage.setItem(
        "businessName",
        response.data.user.business_name || ""
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      closeAuth();

      navigate("/dashboard");

      return;
    }

    toast.error("Invalid Login");
  };

  // Signup API
  const handleSignup = async () => {
    const data = await signupUser(form);

    console.log("SIGNUP RESPONSE:", data);

    if (data?.message) {
      toast.success("Signup Success");
      setIsLogin(true);
    } else {
      toast.error("Signup Failed");
    }
  };


  return (
    <div className="auth-overlay">
      <div className="auth-box">

        {/* Close */}
        <button
          className="close-modal"
          onClick={closeAuth}
        >
          ✕
        </button>

        <h2>
          {isLogin
            ? "Login"
            : "Create Account"}
        </h2>

        {isLogin ? (
          <>
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) =>
                setLoginEmail(
                  e.target.value
                )
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) =>
                setLoginPassword(
                  e.target.value
                )
              }
            />

            <button
              className="auth-btn"
              onClick={handleLogin}
            >
              Login
            </button>

            <p className="switch-auth">
              New user?

              <span
                onClick={() =>
                  setIsLogin(false)
                }
              >
                {" "}
                Create Account
              </span>
            </p>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Business Name"
              value={
                form.company_name
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  company_name:
                    e.target.value,
                })
              }
            />

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <input
                style={{
                  width: "30%",
                }}
                value={form.code}
                onChange={(e) =>
                  setForm({
                    ...form,
                    code:
                      e.target.value,
                  })
                }
              />

              <input
                style={{
                  width: "70%",
                }}
                placeholder="WhatsApp"
                value={
                  form.whatsapp
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    whatsapp:
                      e.target.value,
                  })
                }
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email:
                    e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password:
                    e.target.value,
                })
              }
            />

            <button
              className="auth-btn"
              onClick={handleSignup}
            >
              Create Account
            </button>

            <p className="switch-auth">
              Already have account?

              <span
                onClick={() =>
                  setIsLogin(true)
                }
              >
                {" "}
                Login
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthModal;