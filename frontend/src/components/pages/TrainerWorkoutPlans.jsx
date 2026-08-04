import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { trainerApi as axiosInstance } from "../../api/axiosInstance"

export default function TrainerWorkoutPlans(){
    const auth = useSelector(state => state.auth)
    const [members, setMembers] = useState([])
    const [plans, setPlans] = useState([])
    const [selections, setSelections] = useState({})
    const [loading, setLoading] = useState(true)
    const [savingMid, setSavingMid] = useState(null)
    const [msg, setMsg] = useState("")

    const loadData = () => {
        setLoading(true)
        Promise.all([
            axiosInstance.get(`/trainer/my-members/${auth.userId}`),
            axiosInstance.get("/trainer/workout-plans")
        ]).then(([membersResp, plansResp]) => {
            setMembers(membersResp.data)
            setPlans(plansResp.data)
            setLoading(false)
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })
    }

    useEffect(()=>{ loadData() },[])

    const handleSelect = (mid, workoutPlanId) => {
        setSelections({ ...selections, [mid]: workoutPlanId })
    }

    const handleAssign = (mid) => {
        const workoutPlanId = selections[mid]
        if(!workoutPlanId) return

        setSavingMid(mid)
        setMsg("")
        axiosInstance.put("/trainer/assign-workout-plan", { mid, workoutPlanId: Number(workoutPlanId) })
            .then(() => {
                setMsg("Workout plan assigned successfully.")
                loadData()
            })
            .catch(err => {
                console.log(err)
                setMsg("Something went wrong. Please try again.")
            })
            .finally(() => setSavingMid(null))
    }

    return(
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="text-primary mb-0">Members Workout Plan</h3>
                <button className="btn btn-sm btn-outline-primary" onClick={loadData}>🔄 Refresh</button>
            </div>

            {msg && <p className="text-success">{msg}</p>}

            <div className="card p-3">
                {loading && <p className="text-muted">Loading...</p>}
                {!loading && members.length === 0 && <p className="text-muted">No members assigned to you yet.</p>}
                {!loading && members.length > 0 && (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Name</th>
                                    <th>Goal</th>
                                    <th>Current Plan</th>
                                    <th>Assign Plan</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map((m) => (
                                    <tr key={m.mid}>
                                        <td>{m.name}</td>
                                        <td><span className="badge bg-info text-dark">{m.goalName || "Not Set"}</span></td>
                                        <td>{m.workoutPlanName || <span className="badge bg-warning text-dark">Not Assigned</span>}</td>
                                        <td>
                                            <select
                                                className="form-select form-select-sm"
                                                defaultValue=""
                                                onChange={(e) => handleSelect(m.mid, e.target.value)}
                                            >
                                                <option value="" disabled>Choose a plan</option>
                                                {plans.map(p => (
                                                    <option key={p.woPid} value={p.woPid}>
                                                        {p.wname} ({p.goalName})
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                disabled={savingMid === m.mid || !selections[m.mid]}
                                                onClick={() => handleAssign(m.mid)}
                                            >
                                                {savingMid === m.mid ? "Saving..." : "Assign"}
                                            </button>
                                        </td>
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