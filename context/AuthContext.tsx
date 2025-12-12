"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

type User = { id?: number; name?: string; email?: string; mobile?: string } | null;

type AuthCtx = {
  user: User;
  accessToken: string | null;
  login: (accessToken: string, refreshToken: string, user?: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAuthReady: boolean;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const at = localStorage.getItem("access_token");
    const r = localStorage.getItem("refresh_token");
    const userRaw = localStorage.getItem("user");
    if (userRaw) {
      try {
        setUser(JSON.parse(userRaw));
      } catch (e) {
        setUser(null);
      }
    }
    if (at) {
      setAccessToken(at);
      api.defaults.headers.common["Authorization"] = `Bearer ${at}`;
    } else if (r) {
    }

    setIsAuthReady(true);
  }, []);

  const login = (atk: string, rtk: string, u?: User) => {
    setAccessToken(atk);
    localStorage.setItem("access_token", atk);
    localStorage.setItem("refresh_token", rtk);
    if (u) {
      setUser(u);
      try {
        localStorage.setItem("user", JSON.stringify(u));
      } catch (e) {  }
    }
    api.defaults.headers.common["Authorization"] = `Bearer ${atk}`;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      
    }
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        isAuthenticated: Boolean(accessToken),
        isAuthReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
