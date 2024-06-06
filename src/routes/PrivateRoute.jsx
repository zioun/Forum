import { useContext } from "react";
import { Navigate } from "react-router";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  if (loading) {
    return (
      <>
        <span className="loading loading-spinner text-primary"></span>
      </>
    );
  }
  if (user) {
    return children;
  }
  return <Navigate to={"/"} state={{ form: location }} replace></Navigate>;
};

export default PrivateRoute;
