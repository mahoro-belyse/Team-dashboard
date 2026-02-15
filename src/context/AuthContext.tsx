import React, { createContext, useState, useEffect, useCallback } from "react";
import type { User } from "../types/index";
import * as api from "@/services/fakeApi";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateCurrentUser: (data: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  updateCurrentUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = api.getCurrentUser();
    setUser(stored);
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await api.login(email, password);
    setUser(u);
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const u = await api.signup(name, email, password);
      setUser(u);
    },
    [],
  );

  const logoutFn = useCallback(() => {
    api.logout();
    setUser(null);
  }, []);

  const updateCurrentUser = useCallback((data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout: logoutFn,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
