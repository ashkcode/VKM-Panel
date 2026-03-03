import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// 🔴 IMPORTI GLOBAL I CSS (SHUMË I RËNDËSISHËM)
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
