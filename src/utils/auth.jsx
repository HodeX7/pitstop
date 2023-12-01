import { useState, createContext, useContext, useEffect } from "react";

import { Storage } from "@capacitor/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(false);

  const isLoggedIn = async () => {
    const result = await Storage.get({ key: "isLoggedIN" });

    return result.value === "yes"
  }

  useEffect(() => {
    setUser(isLoggedIn());
  }, [])

  const login = (user) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};