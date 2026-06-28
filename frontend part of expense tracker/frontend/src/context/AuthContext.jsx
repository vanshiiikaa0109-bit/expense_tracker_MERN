import { createContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("token")));
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!localStorage.getItem("token")) return;

      try {
        // Hydrate the logged-in user from the backend when a token exists.
        const data = await authService.getProfile();
        setUser(data.user || data);
      } catch {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const login = async (credentials) => {
    setError("");
    const data = await authService.login(credentials);
    if (data.token) localStorage.setItem("token", data.token);
    setUser(data.user || data);
    return data;
  };

  const register = async (userData) => {
    setError("");
    const data = await authService.register(userData);
    if (data.token) localStorage.setItem("token", data.token);
    setUser(data.user || data);
    return data;
  };

  const updateProfile = async (profileData) => {
    setError("");
    const data = await authService.updateProfile(profileData);
    setUser(data.user || data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, error, setError, login, register, updateProfile, logout, setUser }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
