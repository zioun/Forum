import { useContext } from "react";
import useAdmin from "../hooks/useAdmin";
import { AuthContext } from "../providers/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";


const AdminRoute = ({children}) => {
    const {user, loading} = useContext(AuthContext);
    const [admin, isAdminLoading] = useAdmin();
    const location = useLocation();

    if(loading || isAdminLoading){
        return <process className="progress w-56"></process>
    }
    if(user && admin){
        return children;
    }
    return <Navigate to={"/"} state={{from: location}} replace></Navigate>;
};

export default AdminRoute;