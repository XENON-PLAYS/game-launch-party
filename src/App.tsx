import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect } from "react";
import { motion } from "framer-motion";

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
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ThemeProvider>
            <AuthProvider>
              <SkyBackground />
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={
                  <div className="min-h-screen bg-[#070707] flex flex-col items-center justify-center gap-10">
                    <div className="relative">
                      <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-primary/40 border-b-primary rounded-full animate-spin-slow"></div>
                      </div>
                    </div>
                    <div className="text-center space-y-4">
                      <p className="text-primary font-black uppercase tracking-[0.4em] text-xs animate-pulse">Carregando Universo</p>
                      <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
                        <motion.div 
                          className="h-full bg-primary shadow-[0_0_10px_#ff0000]"
                          animate={{ width: ["0%", "100%"] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  </div>
                }>
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
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </AuthProvider>
          </ThemeProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
