import React, { createContext, useContext, useEffect, useState } from "react";

import { api, setAccessToken } from "../api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .me()
      .then((d) => setUser(d.user))
      .catch(() => setAccessToken(""))
      .finally(() => setLoading(false));
  }, []);
  const login = async (data) => {
    const result = await api.login(data);
    setUser(result.user);
  };
  const register = async (data) => api.register(data);
  const logout = async () => {
    try {
      await api.logout();
    } finally {
      setUser(null);
    }
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
