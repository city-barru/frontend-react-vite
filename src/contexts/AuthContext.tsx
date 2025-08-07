import React, { useState, useEffect } from "react";
import { authService } from "../api/services";
import { AuthContext, type AuthContextType } from "./AuthContext";
import type { User } from "../types";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    const token = authService.getToken();

    if (currentUser && token) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setUser(response.user);
  };

  const loginWithToken = (_token: string, user: User) => {
    // This is for direct login after registration or when we already have token/user
    setUser(user);
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    const response = await authService.register({ name, email, password, role });
    setUser(response.user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    loginWithToken,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
