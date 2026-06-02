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
            <div className="bg-[#131313]/95 border border-white/10 rounded-2xl p-5 md:p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 backdrop-blur-2xl">
              <div className="flex items-start gap-4 text-left">
                <div className="bg-primary/15 p-3 rounded-xl shrink-0 mt-1">
                  <Cookie className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-black uppercase text-sm tracking-wider">Cookies & Privacidade</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mt-1.5">
                    Utilizamos cookies para personalizar conteúdo e analisar nosso tráfego. Ao clicar em "Aceitar", você concorda com nossa{" "}
                    <a href="/privacidade" className="text-primary hover:underline font-medium">Política de Privacidade</a>.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 w-full md:w-auto pl-0 md:pl-4">
                <Button 
                  variant="outline" 
                  onClick={declineCookies}
                  className="flex-1 md:flex-none border-white/15 hover:bg-white/5 hover:border-white/25 text-white uppercase font-black text-[10px] tracking-[0.2em] h-11"
                >
                  Recusar
                </Button>
                <Button 
                  onClick={acceptCookies}
                  className="flex-1 md:flex-none bg-primary hover:bg-primary/85 text-white uppercase font-black text-[10px] tracking-[0.2em] h-11 shadow-lg shadow-primary/20 px-6"
                >
                  Aceitar
                </Button>
                <button 
                  onClick={() => setShowConsent(false)}
                  aria-label="Fechar"
                  className="text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors p-2 -mr-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
