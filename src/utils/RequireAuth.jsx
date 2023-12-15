import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth";

export const RequireAuth = ({ children }) => {
  // console.log(user);
  const location = useLocation();
  const auth = useAuth();
  if (!auth.user) {
    console.log(auth);
    return (
      <Navigate to="/login" auth={auth} state={{ path: location.pathname }} />
    );
  }
  return children;
};
