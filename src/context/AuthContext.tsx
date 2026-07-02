import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useTheme } from "./ThemeContext";
import { getRedirectUrl } from "@/config/auth";
import { getAuthErrorMessage } from "@/lib/auth-errors";

interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_vip: boolean;
  vip_expires_at: string | null;
  is_banned: boolean;
  theme: string;
  status: string;
  last_seen_at: string;
  badges: string[];
}

interface AuthContextType {
  user: SupabaseUser | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (data: { email: string; password: string; displayName: string }) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setTheme } = useTheme();

  const fetchProfile = useCallback(async (userId: string, retryCount = 0) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setProfile(data);
        if (data.theme) setTheme(data.theme as "light" | "dark");
        if (data.is_banned) {
          await logout();
          window.location.href = "/login?error=account_suspended";
        }
      } else if (retryCount < 3) {
        // If profile not found, retry a few times (trigger might be slow)
        console.log(`Profile not found, retrying... (${retryCount + 1})`);
        setTimeout(() => fetchProfile(userId, retryCount + 1), 1000);
      }
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    
    setIsAdmin(roleData?.some((r) => r.role === "admin") ?? false);
  }, [setTheme]);

  useEffect(() => {
    let isMounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      const u = session?.user ?? null;
      setUser(u);

      if (u) {
        // Defer Supabase calls to avoid deadlocks / stale session cache inside the callback
        setTimeout(() => {
          if (!isMounted) return;
          if (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "USER_UPDATED") {
            supabase.rpc("update_online_status").then(({ error }) => {
              if (error) console.error("Error updating online status:", error);
            });
          }
          fetchProfile(u.id).finally(() => {
            if (isMounted) setIsLoading(false);
          });
        }, 0);
      } else {
        setProfile(null);
        setIsAdmin(false);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  useEffect(() => {
    let interval: any;
    if (user) {
      // Initial update
      supabase.rpc("update_online_status");
      // Periodic heartbeat
      interval = setInterval(() => {
        supabase.rpc("update_online_status");
      }, 30000); // 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? getAuthErrorMessage(error) : null };
  }, []);

  const register = useCallback(async (data: { email: string; password: string; displayName: string }) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { display_name: data.displayName },
        emailRedirectTo: getRedirectUrl(),
      },
    });
    return { error: error ? getAuthErrorMessage(error) : null };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getRedirectUrl(),
        queryParams: { prompt: "select_account" },
      },
    });
    return { error: error ? getAuthErrorMessage(error) : null };
  }, []);

  const logout = useCallback(async () => {
    // Marca como offline sem bloquear o logout (best-effort)
    if (user) {
      try {
        await supabase
          .from("profiles")
          .update({ status: "offline" })
          .eq("user_id", user.id);
      } catch (error) {
        console.error("Error setting offline status:", error);
      }
    }

    // Limpa o estado local imediatamente para a UI reagir na hora
    setUser(null);
    setProfile(null);
    setIsAdmin(false);

    // Encerra a sessão local (não falha se o token já estiver inválido)
    try {
      await supabase.auth.signOut({ scope: "local" });
    } catch (error) {
      console.error("Error signing out:", error);
    }

    // Garante que qualquer cache de sessão seja descartado
    window.location.href = "/";
  }, [user]);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, isLoading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
