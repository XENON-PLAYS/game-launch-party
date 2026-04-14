import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getCookie, setCookie } from "@/lib/cookie";

export type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      // Prioritize cookie for "cookie system" consistency
      const saved = getCookie("theme") as Theme;
      if (saved) return saved;
      
      const legacySaved = localStorage.getItem("theme") as Theme;
      return legacySaved || "dark";
    } catch (e) {
      console.warn("Theme retrieval failed:", e);
      return "dark";
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
    try {
      setCookie("theme", theme, 365);
      localStorage.setItem("theme", theme); // Keep localStorage for redundancy
    } catch (e) {
      console.error("Failed to save theme:", e);
    }
  }, [theme]);


  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
