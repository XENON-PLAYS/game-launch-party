import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SkyBackground } from "@/components/SkyBackground";
import Index from "./pages/Index.tsx";

const GameDetail = lazy(() => import("./pages/GameDetail.tsx"));
const Vip = lazy(() => import("./pages/Vip.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Cadastro = lazy(() => import("./pages/Cadastro.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const DownloadPage = lazy(() => import("./pages/DownloadPage.tsx"));
const Perfil = lazy(() => import("./pages/Perfil.tsx"));
const CategoryPage = lazy(() => import("./pages/CategoryPage.tsx"));
const Checkout = lazy(() => import("./pages/Checkout.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <SkyBackground />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/jogo/:slug" element={<GameDetail />} />
                <Route path="/vip" element={<Vip />} />
                <Route path="/download/:gameId/:linkId" element={<DownloadPage />} />
                <Route path="/categoria/:category" element={<CategoryPage />} />
                
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/perfil/:userId" element={<Perfil />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
