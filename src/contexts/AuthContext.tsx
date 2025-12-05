// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { initSync, stopSync } from "@/store"; // We'll update store.ts next

interface User {
  id: string;
  username: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (u: string, p: string) => Promise<void>;
  register: (u: string, p: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const startSyncEngine = () => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/sync';
    initSync(wsUrl);
  };

  const checkSession = async () => {
    try {
      const { user } = await api.auth.me();
      if (user) {
        setUser(user);
        startSyncEngine();
      }
    } catch {
      // Not logged in
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (u: string, p: string) => {
    try {
      const { user } = await api.auth.login(u, p);
      setUser(user);
      toast.success(`Welcome back, ${user.username}`);
      startSyncEngine();
    } catch (err: any) {
      toast.error(err.message || "Login failed");
      throw err;
    }
  };

  const register = async (u: string, p: string) => {
    try {
      const { user } = await api.auth.register(u, p);
      setUser(user);
      toast.success("Account created!");
      startSyncEngine();
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
      setUser(null);
      stopSync();
      toast.success("Logged out");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext>
  );
};