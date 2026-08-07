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

    const doAssign = (mid) => {
        const workoutPlanId = selections[mid]
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

    const handleAssign = (mid, memberGoalName) => {
        const workoutPlanId = selections[mid]
        if(!workoutPlanId) return

        const selectedPlan = plans.find(p => String(p.woPid) === String(workoutPlanId))
        const planGoalName = selectedPlan ? selectedPlan.goalName : null

        const isMismatch = planGoalName && memberGoalName && planGoalName !== memberGoalName

        if(isMismatch){
            const confirmed = window.confirm(
                `This member's goal is "${memberGoalName}" — you're about to assign a "${planGoalName}" plan instead. Assign anyway?`
            )
            if(!confirmed) return
        }

        doAssign(mid)
    }

    // Group plans by goal for optgroup rendering, matching-goal plans listed first per member
    const groupPlansByGoal = (memberGoalName) => {
        const matching = plans.filter(p => p.goalName === memberGoalName)
        const others = plans.filter(p => p.goalName !== memberGoalName)

        const otherGroups = {}
        others.forEach(p => {
            const key = p.goalName || "Other"
            if(!otherGroups[key]) otherGroups[key] = []
            otherGroups[key].push(p)
        })

        return { matching, otherGroups }
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
                                {members.map((m) => {
                                    const { matching, otherGroups } = groupPlansByGoal(m.goalName)
                                    return (
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

                                                {matching.length > 0 && (
                                                    <optgroup label={`Recommended — ${m.goalName}`}>
                                                        {matching.map(p => (
                                                            <option key={p.woPid} value={p.woPid}>
                                                                {p.wname}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                )}

                                                {Object.keys(otherGroups).map(goalKey => (
                                                    <optgroup key={goalKey} label={`Other — ${goalKey}`}>
                                                        {otherGroups[goalKey].map(p => (
                                                            <option key={p.woPid} value={p.woPid}>
                                                                {p.wname}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                disabled={savingMid === m.mid || !selections[m.mid]}
                                                onClick={() => handleAssign(m.mid, m.goalName)}
                                            >
                                                {savingMid === m.mid ? "Saving..." : "Assign"}
                                            </button>
                                        </td>
                                    </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}