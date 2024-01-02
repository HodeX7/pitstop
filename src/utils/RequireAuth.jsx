import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth";

export const RequireAuth = ({ children }) => {
  const location = useLocation();
  const auth = useAuth();

  console.log(auth);
  
  if (!auth.user) {
    return (
      <Navigate to="/login" auth={auth} state={{ path: location.pathname }} />
    );
  }
  return children;
};
