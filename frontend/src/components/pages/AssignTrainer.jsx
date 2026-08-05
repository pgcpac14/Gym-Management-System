import { useState, useEffect } from "react"
import { adminApi as axiosInstance } from "../../api/axiosInstance"

export default function AssignTrainer(){
    const [unassignedMembers, setUnassignedMembers] = useState([])
    const [assignedMembers, setAssignedMembers] = useState([])
    const [trainers, setTrainers] = useState([])
    const [selectedTrainer, setSelectedTrainer] = useState({})
    const [reassignTrainer, setReassignTrainer] = useState({})
    const [msg, setMsg] = useState("")
    const [loading, setLoading] = useState(true)

    const loadData = () => {
        setLoading(true)
        Promise.all([
            axiosInstance.get("/admin/unassigned-members"),
            axiosInstance.get("/admin/assigned-members"),
            axiosInstance.get("/admin/trainers")
        ])
        .then(([unassignedResp, assignedResp, trainersResp]) => {
            setUnassignedMembers(unassignedResp.data)
            setAssignedMembers(assignedResp.data)
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

    const handleReassign = (clientId) => {
        const trainerId = reassignTrainer[clientId]
        if(!trainerId){
            setMsg("Please select a new trainer first")
            return
        }

        axiosInstance.put("/admin/assign-trainer", { clientId, trainerId: Number(trainerId) })
            .then(()=>{
                setMsg("Trainer reassigned successfully")
                loadData()
            })
            .catch(()=>{
                setMsg("Failed to reassign trainer")
            })
    }

    const handleUnassign = (clientId) => {
        axiosInstance.put("/admin/unassign-trainer", { clientId })
            .then(()=>{
                setMsg("Trainer unassigned successfully")
                loadData()
            })
            .catch(()=>{
                setMsg("Failed to unassign trainer")
            })
    }

    return(
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="text-primary mb-0">Assign Trainers</h3>
                <button className="btn btn-sm btn-outline-primary" onClick={loadData}>🔄 Refresh</button>
            </div>

            {msg && <p className="text-success fw-semibold">{msg}</p>}

            {loading && <p className="text-muted">Loading...</p>}

            {!loading && (
                <>
                {/* ===== UNASSIGNED MEMBERS ===== */}
                <div className="card p-3 mb-4">
                    <h5 className="mb-3">Members Needing a Trainer</h5>

                    {unassignedMembers.length === 0 && (
                        <p className="text-success mb-0">✅ All members who requested a trainer have been assigned one.</p>
                    )}

                    {unassignedMembers.length > 0 && (
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
                    )}
                </div>

                {/* ===== ALREADY ASSIGNED — REASSIGN / UNASSIGN ===== */}
                <div className="card p-3">
                    <h5 className="mb-3">Currently Assigned Members</h5>

                    {assignedMembers.length === 0 && (
                        <p className="text-muted mb-0">No members have a trainer assigned yet.</p>
                    )}

                    {assignedMembers.length > 0 && (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Member Name</th>
                                        <th>Current Trainer</th>
                                        <th>Reassign To</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignedMembers.map((member, index) => (
                                        <tr key={member.clientId}>
                                            <td>{index + 1}</td>
                                            <td>{member.name}</td>
                                            <td><span className="badge bg-success">{member.trainerName}</span></td>
                                            <td>
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={reassignTrainer[member.clientId] || ""}
                                                    onChange={(e)=>setReassignTrainer({
                                                        ...reassignTrainer,
                                                        [member.clientId]: e.target.value
                                                    })}
                                                >
                                                    <option value="">-- Select New Trainer --</option>
                                                    {trainers.map(trainer => (
                                                        <option key={trainer.trainerId} value={trainer.trainerId}>
                                                            {trainer.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="d-flex gap-2">
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={()=>handleReassign(member.clientId)}
                                                >
                                                    Reassign
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={()=>handleUnassign(member.clientId)}
                                                >
                                                    Unassign
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                </>
            )}
        </div>
    )
}