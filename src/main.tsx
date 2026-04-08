import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// Error reporting to server or simple log
const reportError = (error: any, context: string) => {
  console.error(`[Fatal Error] [${context}]:`, error);
};

// Global error handling for catastrophic failures
window.onerror = (message, source, lineno, colno, error) => {
  reportError(error || message, "WindowOnError");
  const root = document.getElementById("root");
  if (root && (root.innerHTML === "" || root.children.length === 0)) {
    root.innerHTML = `
      <div style="min-height: 100vh; background: #070707; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; font-family: 'Plus Jakarta Sans', sans-serif; text-align: center; position: fixed; inset: 0; z-index: 9999;">
        <div style="width: 80px; height: 80px; background: rgba(255, 0, 0, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
          <span style="font-size: 40px;">⚠️</span>
        </div>
        <h1 style="color: #ff0000; margin-bottom: 16px; font-weight: 800; font-size: 32px; letter-spacing: -0.02em; text-transform: uppercase; font-style: italic;">ERRO DE INICIALIZAÇÃO</h1>
        <p style="color: #aaa; margin-bottom: 32px; max-width: 500px; line-height: 1.6; font-size: 16px;">
          Desculpe pelo transtorno. O site encontrou uma falha crítica ao carregar os recursos do sistema.
          Isso geralmente acontece por problemas temporários de conexão ou cache corrompido.
        </p>
        <div style="display: flex; gap: 16px;">
          <button onclick="window.location.reload(true)" style="background: #ff0000; color: white; border: none; padding: 16px 32px; border-radius: 12px; cursor: pointer; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.2s; box-shadow: 0 10px 20px rgba(255, 0, 0, 0.2);">Recarregar Agora</button>
          <button onclick="window.location.href='/'" style="background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); padding: 16px 32px; border-radius: 12px; cursor: pointer; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em;">Voltar ao Início</button>
        </div>
        <p style="margin-top: 48px; color: #444; font-size: 10px; font-weight: 900; letter-spacing: 0.3em; text-transform: uppercase;">Jogos Grátis - Sistema de Recuperação Ativo</p>
      </div>
    `;
  }
};

window.onunhandledrejection = (event) => {
  reportError(event.reason, "UnhandledPromiseRejection");
};

console.log("🚀 Iniciando aplicação Jogos Grátis...");

const container = document.getElementById("root");
if (!container) {
  console.error("FATAL: Elemento #root não encontrado no DOM.");
} else {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("✅ Renderização inicial concluída com sucesso.");
  } catch (error) {
    reportError(error, "RootRender");
    // Fallback in case root.render itself fails
    if (container.innerHTML === "") {
        container.innerHTML = "<h1>Erro Crítico: A aplicação falhou ao renderizar.</h1>";
    }
  }
}