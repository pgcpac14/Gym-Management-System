import { useState } from "react"
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { useNavigate, NavLink } from "react-router-dom";
import { authApi, memberApi } from "../api/axiosInstance";

export default function LoginComp(){
    const[email,setemail]=useState("");
    const[password,setpassword]=useState("");
    const[msg,setmsg]=useState("")
    const navigate = useNavigate();
    const dispatch=useDispatch();

    const handleSubmit=(e)=>{
        e.preventDefault();
        authApi.post("/auth/login", { email, password })
        .then(resp => {
            const data = resp.data;
            dispatch(login({
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role,
                token: data.token,
            }));

            if (data.role === "ADMIN") {
                navigate("/admin");
            }
            else if (data.role === "TRAINER") {
                navigate("/trainer");
            }
            else if (data.role === "MEMBER") {
                memberApi.get(`/subscription/check/${data.id}`)
                    .then(subResp => {
                        if(subResp.data.hasSubscription){
                            navigate("/member")
                        } else {
                            navigate("/subscribe")
                        }
                    })
                    .catch(()=>{ navigate("/subscribe") })
            }
            else {
                navigate("/");
            }
        })
        .catch(err => {
            if(err.response && err.response.status===404){
                setmsg("Wrong Email or Password")
            } else {
                setmsg("Something went wrong. Please try again.")
            }
        })
    }

    return(
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-5">
              <div className="card p-4">
                <div className="card-header bg-primary text-white text-center mb-3">
                  <h4 className="mb-0">🏋️ Gym Management System</h4>
                </div>
                <h5 className="text-center mb-4">Login to your account</h5>
                <form>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input type="email" className="form-control" placeholder="Enter your email" value={email} onChange={(e)=>setemail(e.target.value)}/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <input type="password" className="form-control" placeholder="Enter your password" value={password} onChange={(e)=>setpassword(e.target.value)}/>
                  </div>
                  {msg && <p className="text-danger">{msg}</p>}
                  <button type="submit" className="btn btn-primary w-100 mt-2" onClick={handleSubmit}>LOGIN</button>
                  <p className="text-center mt-3 text-muted">
                    Not registered? <NavLink to="/register">Register here</NavLink>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
    )
}