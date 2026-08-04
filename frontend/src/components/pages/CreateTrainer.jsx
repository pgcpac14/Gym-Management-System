import { useState } from "react"
import axiosInstance from "../../api/axiosInstance"

export default function CreateTrainer(){
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        gender: ""
    })
    const [submitting, setSubmitting] = useState(false)
    const [msg, setMsg] = useState("")
    const [msgType, setMsgType] = useState("")

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitting(true)
        setMsg("")

        axiosInstance.post("/admin/create-trainer", form)
            .then(() => {
                setMsgType("success")
                setMsg("Trainer account created successfully.")
                setForm({ name: "", email: "", password: "", phone: "", gender: "" })
            })
            .catch(err => {
                setMsgType("danger")
                setMsg(err.response?.data?.message || "Something went wrong. Please try again.")
            })
            .finally(() => setSubmitting(false))
    }

    return(
        <div>
            <h3 className="text-primary mb-3">Create Trainer Account</h3>

            <div className="card p-4" style={{maxWidth: "500px"}}>
                {msg && <div className={`alert alert-${msgType}`}>{msg}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            className="form-control"
                            value={form.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Gender</label>
                        <select
                            name="gender"
                            className="form-select"
                            value={form.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Select --</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? "Creating..." : "Create Trainer"}
                    </button>
                </form>
            </div>
        </div>
    )
}