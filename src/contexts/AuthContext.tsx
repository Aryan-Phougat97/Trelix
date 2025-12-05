import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { api, User } from "@/lib/api";
import { toast } from "sonner";
import { initSync, stopSync } from "@/store";
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (u: string, p: string) => Promise<void>;
  register: (u: string, p: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const startSyncEngine = () => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/sync';
    initSync(wsUrl);
  };

  const checkSession = useCallback(async () => {
    try {
      const data = await api.auth.me();
      if (data.user) {
        setUser(data.user);
        startSyncEngine();
      }
    } catch {
      // Not logged in
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (u: string, p: string) => {
    try {
      const data = await api.auth.login(u, p);
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.username}`);
      startSyncEngine();
    } catch (err: unknown) { 
      const message = err instanceof Error ? err.message : "Login failed";
      toast.error(message);
      throw err;
    }
  };

  const register = async (u: string, p: string) => {
    try {
      const data = await api.auth.register(u, p);
      setUser(data.user);
      toast.success("Account created!");
      startSyncEngine();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast.error(message);
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