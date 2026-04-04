import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useTheme } from "./ThemeContext";

interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_vip: boolean;
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

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (data) {
      setProfile(data);
      if (data.theme) setTheme(data.theme as "light" | "dark");
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    
    setIsAdmin(roleData?.some((r) => r.role === "admin") ?? false);
  }, []);

  useEffect(() => {
    // Initial session check
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const u = session?.user ?? null;
      setUser(u);
      
      if (u) {
        try {
          // Update status to online for initial session
          await supabase.rpc("update_online_status");
          console.log("Initial session: Updated status to online for user:", u.id);
        } catch (error) {
          console.error("Error updating online status during init:", error);
        }
        await fetchProfile(u.id);
      }
      setIsLoading(false);
    };

    initSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change event:", event);
      const u = session?.user ?? null;
      
      if (event === "SIGNED_IN") {
        setUser(u);
        if (u) {
          try {
            await supabase.rpc("update_online_status");
            console.log("SIGNED_IN: Updated status to online for user:", u.id);
          } catch (error) {
            console.error("Error updating online status during SIGNED_IN:", error);
          }
          await fetchProfile(u.id);
        }
        setIsLoading(false);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
        setIsLoading(false);
      } else if (event === "USER_UPDATED") {
        setUser(u);
        if (u) await fetchProfile(u.id);
      } else if (event === "INITIAL_SESSION") {
        // Already handled by initSession, but ensure loading is false
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
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
    return { error: error?.message ?? null };
  }, []);

  const register = useCallback(async (data: { email: string; password: string; displayName: string }) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { display_name: data.displayName },
        emailRedirectTo: window.location.origin,
      },
    });
    return { error: error?.message ?? null };
  }, []);

  const logout = useCallback(async () => {
    if (user) {
      await supabase
        .from("profiles")
        .update({ status: "offline" })
        .eq("user_id", user.id);
    }
    await supabase.auth.signOut();
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
