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
          className="fixed bottom-0 left-0 right-0 z-[100] p-3 sm:p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#131313]/95 border border-white/10 rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-5 backdrop-blur-2xl">
              <div className="flex items-start gap-3 sm:gap-4 text-left">
                <div className="bg-primary/15 p-2.5 sm:p-3 rounded-xl shrink-0 mt-0.5 sm:mt-1">
                  <Cookie className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-black uppercase text-xs sm:text-sm tracking-wider">Cookies & Privacidade</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-2xl mt-1 sm:mt-1.5">
                    Utilizamos cookies para personalizar conteúdo e analisar nosso tráfego. Ao clicar em "Aceitar", você concorda com nossa{" "}
                    <a href="/privacidade" className="text-primary hover:underline font-medium">Política de Privacidade</a>.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0 w-full md:w-auto pl-0 md:pl-4">
                <Button
                  variant="outline"
                  onClick={declineCookies}
                  className="flex-1 md:flex-none border-white/15 hover:bg-white/5 hover:border-white/25 text-white uppercase font-black text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] h-12 sm:h-11 min-h-[48px]"
                >
                  Recusar
                </Button>
                <Button
                  onClick={acceptCookies}
                  className="flex-1 md:flex-none bg-primary hover:bg-primary/85 text-white uppercase font-black text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] h-12 sm:h-11 min-h-[48px] shadow-lg shadow-primary/20 px-4 sm:px-6"
                >
                  Aceitar
                </Button>
                <button
                  onClick={() => setShowConsent(false)}
                  aria-label="Fechar"
                  className="text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors p-3 sm:p-2 -mr-1 sm:-mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X className="w-6 h-6 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
