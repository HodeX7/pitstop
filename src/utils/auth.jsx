import { useState, createContext, useContext, useEffect } from "react";

import { Storage } from "@capacitor/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  const isLoggedIn = async () => {
    const result = await Storage.get({ key: "isLoggedIN" });
    const access_token = await Storage.get({ key: "access_token" });
    setUser(result.value === "yes" || access_token);
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      await isLoggedIn();
    };
    checkLoggedIn();
  }, []);

  const login = (user) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {user ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
