import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";


// ==========================================
// LOAD META SDK
// ==========================================

const loadMetaSDK = () => {

  if (window.FB) return;

  const script = document.createElement("script");

  script.src =
    "https://connect.facebook.net/en_US/sdk.js";

  script.async = true;
  script.defer = true;
  script.crossOrigin = "anonymous";

  script.onload = () => {

    window.fbAsyncInit = () => {

      window.FB.init({

        appId:
          import.meta.env.VITE_META_APP_ID,

        autoLogAppEvents: true,

        xfbml: false,

        version: "v24.0"

      });

      console.log(
        "META SDK LOADED"
      );

    };

  };

  document.body.appendChild(script);

};

loadMetaSDK();


// ==========================================
// APP
// ==========================================

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <BrowserRouter>

      <Toaster
        position="top-right"
        reverseOrder={false}
      />

      <App />

    </BrowserRouter>

  </React.StrictMode>

);