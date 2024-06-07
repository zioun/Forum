import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

const PrivateRoute = ({ children }) => {
  const { user, loader } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loader || loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <img src={"https://i.ibb.co/xXSNBmr/icons8-loading.gif"} alt="" />
      </div>
    );
  }

  if (user) {
    return children;
  }

  return <Navigate to="/login" state={location.pathname} replace={true} />;
};

export default PrivateRoute;
