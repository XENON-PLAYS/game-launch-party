import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SkyBackground } from "@/components/SkyBackground";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";

const GameDetail = lazy(() => import("./pages/GameDetail"));
const Vip = lazy(() => import("./pages/Vip"));
const Login = lazy(() => import("./pages/Login"));
const Cadastro = lazy(() => import("./pages/Cadastro"));
const Admin = lazy(() => import("./pages/Admin"));
const DownloadPage = lazy(() => import("./pages/DownloadPage"));
const Perfil = lazy(() => import("./pages/Perfil"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const Checkout = lazy(() => import("./pages/Checkout"));
const NotFound = lazy(() => import("./pages/NotFound"));
const DMCA = lazy(() => import("./pages/DMCA"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const GameRequest = lazy(() => import("./pages/GameRequest"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes default
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  useEffect(() => {
    console.log("App component mounted successfully");
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <ThemeProvider>
              <AuthProvider>
                <SkyBackground />
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-primary font-black uppercase tracking-[0.4em] text-xs animate-pulse">Carregando...</div>}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/jogo/:slug" element={<GameDetail />} />
                      <Route path="/novidades" element={<Index />} />
                      <Route path="/vip" element={<Vip />} />
                      <Route path="/download/:gameId/:linkId" element={<DownloadPage />} />
                      <Route path="/categoria/:category" element={<CategoryPage />} />
                      
                      <Route path="/login" element={<Login />} />
                      <Route path="/cadastro" element={<Cadastro />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/perfil" element={<Perfil />} />
                      <Route path="/perfil/:userId" element={<Perfil />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/dmca" element={<DMCA />} />
                      <Route path="/privacidade" element={<PrivacyPolicy />} />
                      <Route path="/pedir-jogo" element={<GameRequest />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </AuthProvider>
            </ThemeProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;