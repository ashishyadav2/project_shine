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
      .get("http://localhost:8000/api/isloggedin/", {
        withCredentials: true,
      })
      .then(() => setAuth(true))
      .catch(() => setAuth(false));
  }, []);

  if (auth === null) return null;
  console.log(auth);
  return auth ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateAdminRoute;
