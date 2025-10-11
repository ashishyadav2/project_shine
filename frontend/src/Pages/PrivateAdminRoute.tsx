import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

interface PrivateAdminRouteProps {
  children: ReactNode;
}

const PrivateAdminRoute: React.FC<PrivateAdminRouteProps> = ({ children }) => {
  const [auth, setAuth] = useState<boolean | null>(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/isloggedin/`, {
        withCredentials: true,
      })
      .then(() => setAuth(true))
      .catch(() => setAuth(false));
  }, []);

  if (auth === null) return null;
  if (import.meta.env.VITE_LOGGING == "true") {
    console.log(auth);
  }
  return auth ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateAdminRoute;
