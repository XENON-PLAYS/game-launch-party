import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// Global error handling for catastrophic failures
window.onerror = (message, source, lineno, colno, error) => {
  console.error("Global Error:", message, error);
  const root = document.getElementById("root");
  if (root && root.innerHTML === "") {
    root.innerHTML = `
      <div style="min-height: 100vh; background: #0f0f0f; color: white; display: flex; flex-direction: column; align-items: center; justify-center; padding: 20px; font-family: sans-serif; text-align: center;">
        <h1 style="color: #ff0000; margin-bottom: 10px;">Erro Crítico de Carregamento</h1>
        <p>O site não pôde ser iniciado corretamente.</p>
        <button onclick="window.location.reload()" style="background: #ff0000; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 20px; font-weight: bold;">Recarregar Site</button>
      </div>
    `;
  }
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

