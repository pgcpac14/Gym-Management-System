import { useState, useEffect } from "react"
import axiosInstance from "../../api/axiosInstance"

export default function AssignTrainer(){
    const [unassignedMembers, setUnassignedMembers] = useState([])
    const [trainers, setTrainers] = useState([])
    const [selectedTrainer, setSelectedTrainer] = useState({})
    const [msg, setMsg] = useState("")
    const [loading, setLoading] = useState(true)

    const loadData = () => {
        setLoading(true)
        Promise.all([
            axiosInstance.get("/admin/unassigned-members"),
            axiosInstance.get("/admin/trainers")
        ])
        .then(([membersResp, trainersResp]) => {
            setUnassignedMembers(membersResp.data)
            setTrainers(trainersResp.data)
            setLoading(false)
        })
        .catch(err => {
            console.log(err)
            setLoading(false)
        })
    }

    useEffect(()=>{ loadData() },[])

    const handleAssign = (clientId) => {
        const trainerId = selectedTrainer[clientId]
        if(!trainerId){
            setMsg("Please select a trainer first")
            return
        }

        axiosInstance.put("/admin/assign-trainer", { clientId, trainerId: Number(trainerId) })
            .then(()=>{
                setMsg("Trainer assigned successfully")
                loadData()
            })
            .catch(()=>{
                setMsg("Failed to assign trainer")
            })
    }

    return(
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="text-primary mb-0">Assign Trainers</h3>
                <button className="btn btn-sm btn-outline-primary" onClick={loadData}>🔄 Refresh</button>
            </div>

            {msg && <p className="text-success fw-semibold">{msg}</p>}

            <div className="card p-3">
                {loading && <p className="text-muted">Loading...</p>}

                {!loading && unassignedMembers.length === 0 && (
                    <p className="text-success">✅ All members who requested a trainer have been assigned one.</p>
                )}

                {!loading && unassignedMembers.length > 0 && (
                    <>
                    <p className="text-muted mb-3">
                        Members below have requested a trainer but have not been assigned one yet.
                    </p>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Member Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Goal</th>
                                    <th>Package</th>
                                    <th>Select Trainer</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {unassignedMembers.map((member, index) => (
                                    <tr key={member.clientId}>
                                        <td>{index + 1}</td>
                                        <td>{member.name}</td>
                                        <td>{member.email}</td>
                                        <td>{member.phone}</td>
                                        <td><span className="badge bg-info text-dark">{member.goalName}</span></td>
                                        <td>{member.packageName}</td>
                                        <td>
                                            <select
                                                className="form-select form-select-sm"
                                                value={selectedTrainer[member.clientId] || ""}
                                                onChange={(e)=>setSelectedTrainer({
                                                    ...selectedTrainer,
                                                    [member.clientId]: e.target.value
                                                })}
                                            >
                                                <option value="">-- Select Trainer --</option>
                                                {trainers.map(trainer => (
                                                    <option key={trainer.trainerId} value={trainer.trainerId}>
                                                        {trainer.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={()=>handleAssign(member.clientId)}
                                            >
                                                Assign
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    </>
                )}
            </div>
        </div>
    )
}