import React, { createContext, useContext, useState, useCallback } from "react";

interface User {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  nivel: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, senha: string) => boolean;
  register: (data: { nome: string; sobrenome: string; email: string; telefone: string; senha: string }) => boolean;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = "admin@jogospiratas.com";
const ADMIN_PASS = "admin123";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("jp_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((email: string, senha: string) => {
    // Admin login
    if (email === ADMIN_EMAIL && senha === ADMIN_PASS) {
      const u: User = { id: "admin", nome: "Admin", sobrenome: "", email, nivel: "admin" };
      setUser(u);
      localStorage.setItem("jp_user", JSON.stringify(u));
      return true;
    }
    // Check registered users
    const users: User[] = JSON.parse(localStorage.getItem("jp_users") || "[]");
    const found = users.find((u) => u.email === email);
    if (found) {
      setUser(found);
      localStorage.setItem("jp_user", JSON.stringify(found));
      return true;
    }
    return false;
  }, []);

  const register = useCallback((data: { nome: string; sobrenome: string; email: string; telefone: string; senha: string }) => {
    const users: User[] = JSON.parse(localStorage.getItem("jp_users") || "[]");
    if (users.find((u) => u.email === data.email)) return false;
    const newUser: User = {
      id: crypto.randomUUID(),
      nome: data.nome,
      sobrenome: data.sobrenome,
      email: data.email,
      nivel: "user",
    };
    users.push(newUser);
    localStorage.setItem("jp_users", JSON.stringify(users));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("jp_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin: user?.nivel === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
