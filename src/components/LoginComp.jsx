import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";

import axiosInstance from "../api/axiosInstance";

function LoginComp() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const loginHandler = async () => {

        try {

            const response = await axiosInstance.post(
                "/login",
                {
                    username,
                    password
                }
            );

            dispatch(
                loginSuccess(response.data)
            );

            navigate("/dashboard");

        }
        catch (err) {

            setError("Invalid Username or Password");

            console.log(err);
        }
    }

    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-4">

                    <div className="card p-4">

                        <h2 className="text-center mb-4">
                            Login
                        </h2>

                        {
                            error &&
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        }

                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Username"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                        />

                        <input
                            type="password"
                            className="form-control mb-3"
                            placeholder="Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />

                        <button
                            className="btn btn-primary"
                            onClick={loginHandler}
                        >
                            Login
                        </button>

                        <p className="mt-3">

                            New User ?

                            <Link to="/register">
                                Register Here
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default LoginComp;