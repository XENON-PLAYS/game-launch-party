import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// Global error handling for catastrophic failures
window.onerror = (message, source, lineno, colno, error) => {
  console.error("Global Error:", message, error);
  const root = document.getElementById("root");
  if (root && (root.innerHTML === "" || root.children.length === 0)) {
    root.innerHTML = `
      <div style="min-height: 100vh; background: #0f0f0f; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; font-family: sans-serif; text-align: center; position: fixed; inset: 0; z-index: 9999;">
        <h1 style="color: #ff0000; margin-bottom: 10px; font-weight: 800; font-size: 24px;">ERRO CRÍTICO</h1>
        <p style="color: #888; margin-bottom: 20px;">O site encontrou um erro durante a inicialização.</p>
        <button onclick="window.location.reload()" style="background: #ff0000; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: opacity 0.2s;">Recarregar Site</button>
      </div>
    `;
  }
};

window.onunhandledrejection = (event) => {
  console.error("Unhandled Rejection:", event.reason);
};


console.log("App initialization started...");

const container = document.getElementById("root");
if (!container) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(container);
root.render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

