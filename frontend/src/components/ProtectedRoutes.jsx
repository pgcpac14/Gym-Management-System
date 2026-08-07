import { useState, useEffect } from "react"
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { memberApi } from "../api/axiosInstance";

export default function ProtectedRoutes({children,role}){
    const auth = useSelector(state=>state.auth)
    const [checking, setChecking] = useState(role === "MEMBER")
    const [gymExpired, setGymExpired] = useState(false)

    useEffect(()=>{
        if(role === "MEMBER" && auth.isLoggedIn && auth.role === "MEMBER"){
            memberApi.get(`/subscription/check/${auth.userId}`)
                .then(resp => {
                    const data = resp.data
                    if(data.hasSubscription && data.expired){
                        setGymExpired(true)
                    }
                    setChecking(false)
                })
                .catch(err => {
                    console.log(err)
                    setChecking(false)
                })
        } else {
            setChecking(false)
        }
    },[])

    if(!auth.isLoggedIn){
        return <Navigate to="/login"/>
    }

    if(auth.role !== role){
        return <Navigate to="/unauthorized"/>
    }

    if(checking){
        return <div className="container mt-5 text-center text-muted">Checking your subscription...</div>
    }

    if(gymExpired){
        return <Navigate to="/subscribe"/>
    }

    return children
}