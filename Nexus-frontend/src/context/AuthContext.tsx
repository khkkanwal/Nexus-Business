import React, { createContext, useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { User, UserRole, AuthContextType } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "business_nexus_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // =========================
  // LOAD USER
  // =========================
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  // =========================
  // REGISTER
  // =========================
  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ): Promise<User> => {
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setUser(data.user);

      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      toast.success("Account created successfully!");

      // ✅ RETURN USER
      return data.user;
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // LOGIN
  // =========================
  const login = async (
    email: string,
    password: string,
    role: UserRole,
  ): Promise<User> => {
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      setUser(data.user);

      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      toast.success("Logged in successfully!");

      // ✅ RETURN USER
      return data.user;
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // UPDATE PROFILE
  const updateProfile = async (updates: Partial<User>): Promise<User> => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      // UPDATE STATE
      setUser(data.user);

      // UPDATE LOCAL STORAGE
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));

      toast.success("Profile updated successfully!");

      return data.user;
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }; // =========================

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    setUser(null);

    localStorage.removeItem(USER_STORAGE_KEY);

    // ADD THIS
    localStorage.removeItem("token");

    toast.success("Logged out successfully!");
  };

  // =========================
  // CONTEXT VALUE
  // =========================
  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// =========================
// CUSTOM HOOK
// =========================
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
