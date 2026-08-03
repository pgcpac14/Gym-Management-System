import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoutes({children,role}){
    const auth = useSelector(state=>state.auth)

    if(!auth.isLoggedIn){
        return <Navigate to="/login"/>
    }

    if(auth.role !== role){
        return <Navigate to="/unauthorized"/>
    }

    return children
}