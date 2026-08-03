import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";

export default function LogoutComp(){
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(()=>{
        dispatch(logout())
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate("/")
    },[]);

    return(
        <div className="container mt-4">
            <h4>Logging out...</h4>
        </div>
    )
}