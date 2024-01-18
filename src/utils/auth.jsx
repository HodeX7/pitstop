import { useState, createContext, useContext, useEffect } from "react";
import { Storage } from "@capacitor/storage";
import { isExpired } from "react-jwt";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        const checkLogin = await Storage.get({ key: "isLoggedIN" });
        const access_token = await Storage.get({ key: "access_token" });
        const uid = await Storage.get({ key: "uid" });

        const isUserLoggedIn =
          checkLogin?.value === "yes" &&
          !isExpired(access_token?.value) &&
          uid.value;

        setUser(isUserLoggedIn);
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setLoading(false);
      }
    };

    isLoggedIn();
  }, []);

  const login = (user) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
