import { useState, createContext, useContext, useEffect } from "react";

import { Storage } from "@capacitor/storage";
import { Navigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(false);

  useEffect(() => {
    const isLoggedIn = async () => {
      const result = await Storage.get({ key: "isLoggedIN" });
      // const access_token = await Storage.get({ key: "access_token" });
      setUser(result?.value === "yes");
    };
    isLoggedIn();
    console.log(user);
  }, [user]);

  const login = (user) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    if (!user) {
      <Navigate to="/login" />;
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
