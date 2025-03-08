import { createContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  getAuthUser,
  login as authLogin,
  logout as authLogout,
} from "../services/AuthService";

export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await getAuthUser();
        setUserData(response.user);
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (userData) => {
    try {
      const response = await authLogin(userData);
      localStorage.setItem("token", response.token);
      setUserData(response.user);
      setIsLoggedIn(true);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await authLogout();
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUserData(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const contextValue = useMemo(
    () => ({
      isLoggedIn,
      setIsLoggedIn,
      userData,
      setUserData,
      login,
      handleLogout,
    }),
    [isLoggedIn, userData]
  );

  return (
    <AppContent.Provider value={contextValue}>{children}</AppContent.Provider>
  );
};
