import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { trainerApi as axiosInstance } from "../../api/axiosInstance"

export default function MyMembers(){
    const auth = useSelector(state => state.auth)
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)

    const loadMembers = () => {
        setLoading(true)
        axiosInstance.get(`/trainer/my-members/${auth.userId}`)
            .then(resp => {
                setMembers(resp.data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }

    useEffect(()=>{ loadMembers() },[])

    return(
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="text-primary mb-0">My Members</h3>
                <button className="btn btn-sm btn-outline-primary" onClick={loadMembers}>🔄 Refresh</button>
            </div>

            <div className="card p-3">
                {loading && <p className="text-muted">Loading members...</p>}
                {!loading && members.length === 0 && <p className="text-muted">No members assigned to you yet.</p>}
                {!loading && members.length > 0 && (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Goal</th>
                                    <th>Package</th>
                                    <th>Workout Plan</th>
                                    <th>Diet Plan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map((m, index) => (
                                    <tr key={m.mid}>
                                        <td>{index + 1}</td>
                                        <td>{m.name}</td>
                                        <td>{m.email}</td>
                                        <td>{m.phone}</td>
                                        <td><span className="badge bg-info text-dark">{m.goalName || "Not Set"}</span></td>
                                        <td>{m.packageName || "-"}</td>
                                        <td>{m.workoutPlanName || <span className="badge bg-warning text-dark">Not Assigned</span>}</td>
                                        <td>{m.dietPlanName || <span className="badge bg-warning text-dark">Not Assigned</span>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}