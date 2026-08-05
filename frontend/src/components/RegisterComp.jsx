import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { authApi, memberApi } from "../api/axiosInstance";
import FitCoreHeader from "./FitCoreHeader";

export default function RegisterComp() {
    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [phone, setphone] = useState("");
    const [age, setage] = useState("");
    const [gender, setgender] = useState("Male");
    const [goal_id, setgoal_id] = useState("");
    const [goals, setgoals] = useState([]);
    const [msg, setmsg] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        memberApi
            .get("/subscription/goals")
            .then((resp) => {
                setgoals(resp.data);
                if (resp.data.length > 0) {
                    setgoal_id(resp.data[0].gid);
                }
            })
            .catch((err) => console.log(err));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        authApi
            .post("/auth/register", {
                name,
                email,
                password,
                phone,
                age,
                gender,
                goal_id,
            })
            .then((resp) => {
                setmsg("Registration successful! Redirecting to login...");

                const selectedGoal = goals.find(
                    (g) => String(g.gid) === String(goal_id)
                );

                const goalName = selectedGoal
                    ? selectedGoal.gname
                    : "General Fitness";

                memberApi
                    .post("/subscription/generate-diet-plan", {
                        uid: resp.data.uid,
                        age,
                        gender,
                        goalName,
                    })
                    .catch((err) =>
                        console.log("AI diet plan generation failed:", err)
                    );

                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            })
            .catch((err) => {
                if (err.response && err.response.data) {
                    setmsg(err.response.data.message);
                } else {
                    setmsg("Registration failed. Please try again.");
                }
            });
    };

    return (
        <div>
            <FitCoreHeader />
            <div className="container mt-4 mb-4">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card p-4">
                            <div className="card-header bg-success text-white text-center mb-3">
                                <h4 className="mb-0">🏋️ Member Registration</h4>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter full name"
                                        value={name}
                                        onChange={(e) => setname(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setemail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setpassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter phone number"
                                        value={phone}
                                        onChange={(e) => setphone(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Enter age"
                                        value={age}
                                        onChange={(e) => setage(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Gender
                                    </label>
                                    <select
                                        className="form-select"
                                        value={gender}
                                        onChange={(e) => setgender(e.target.value)}
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Fitness Goal
                                    </label>
                                    <select
                                        className="form-select"
                                        value={goal_id}
                                        onChange={(e) =>
                                            setgoal_id(e.target.value)
                                        }
                                    >
                                        {goals.map((goal) => (
                                            <option
                                                key={goal.gid}
                                                value={goal.gid}
                                            >
                                                {goal.gname}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {msg && (
                                    <p
                                        className={
                                            msg.includes("successful")
                                                ? "text-success"
                                                : "text-danger"
                                        }
                                    >
                                        {msg}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-success w-100 mt-2"
                                >
                                    REGISTER
                                </button>

                                <p className="text-center mt-3 text-muted">
                                    Already registered?{" "}
                                    <NavLink to="/login">
                                        Login here
                                    </NavLink>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}