import React, { useState, useEffect } from "react";
import { setCookie, getCookie } from "@/lib/cookie";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = getCookie("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setShowConsent(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    setCookie("cookie-consent", "accepted", 365);
    setShowConsent(false);
  };

  const declineCookies = () => {
    setCookie("cookie-consent", "declined", 365);
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="bg-primary/10 p-3 rounded-full shrink-0">
                  <Cookie className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Cookies & Privacidade</h3>
                  <p className="text-gray-400 text-sm max-w-2xl mt-1">
                    Utilizamos cookies para personalizar conteúdo, anúncios e analisar nosso tráfego. 
                    Ao clicar em "Aceitar", você concorda com o uso de cookies de acordo com nossa 
                    <a href="/privacidade" className="text-primary hover:underline ml-1">Política de Privacidade</a>.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                <Button 
                  variant="outline" 
                  onClick={declineCookies}
                  className="flex-1 md:flex-none border-white/10 hover:bg-white/5 text-white uppercase font-black text-[10px] tracking-widest h-12"
                >
                  Recusar
                </Button>
                <Button 
                  onClick={acceptCookies}
                  className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-white uppercase font-black text-[10px] tracking-widest h-12 shadow-lg shadow-primary/20 px-8"
                >
                  Aceitar
                </Button>
                <button 
                  onClick={() => setShowConsent(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
