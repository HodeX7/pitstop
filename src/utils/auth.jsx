import { useState, createContext, useContext, useEffect } from "react";

import { Storage } from "@capacitor/storage";
import { Navigate, useNavigate } from "react-router-dom";
import { isExpired } from "react-jwt";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  // const navigate = useNavigate('')

  useEffect(() => {
    const isLoggedIn = async () => {
      const checkLogin = await Storage.get({ key: "isLoggedIN" });
      const access_token = await Storage.get({ key: "access_token" });
      const uid = await Storage.get({ key: "uid" });

      setUser(checkLogin?.value === "yes" && !isExpired(access_token?.value) && uid.value);
      // console.log("check kiya")
      // setUser(false);
    };

    isLoggedIn();
  }, [user]);

  const login = (user) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  // useEffect(() => {
  //   if (!user) {
  //     // <Navigate to="/login" />
  //     // useNavigate('/login')
      
  //     // window.location.href = "/login"
  //   }
  // }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
