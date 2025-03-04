import { createContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${backendUrl}/auth/me`, {
          withCredentials: true,
        });
        setUserData(response.data.user);
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };
    checkAuthStatus();
  }, [backendUrl]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${backendUrl}/auth/logout`,
        {},
        { withCredentials: true }
      );
      setIsLoggedIn(false);
      setUserData(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const contextValue = useMemo(
    () => ({
      backendUrl,
      isLoggedIn,
      setIsLoggedIn,
      userData,
      setUserData,
      handleLogout,
    }),
    [isLoggedIn, userData]
  );

  return (
    <AppContent.Provider value={contextValue}>
      {children}
    </AppContent.Provider>
  );
};
