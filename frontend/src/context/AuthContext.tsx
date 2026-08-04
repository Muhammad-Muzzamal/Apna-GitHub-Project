import React, { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  useEffect(() => {
    const userId = localStorage.getItem("token");

    if (userId) {
      setCurrentUser(userId);
    }
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
