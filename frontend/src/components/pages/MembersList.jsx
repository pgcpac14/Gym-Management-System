import { useState, useEffect } from "react"
import { adminApi as axiosInstance } from "../../api/axiosInstance"

export default function MembersList(){
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)

    const loadMembers = () => {
        setLoading(true)
        axiosInstance.get("/admin/members")
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
                <h3 className="text-primary mb-0">Members</h3>
                <button className="btn btn-sm btn-outline-primary" onClick={loadMembers}>🔄 Refresh</button>
            </div>

            <div className="card p-3">
                {loading && <p className="text-muted">Loading members...</p>}
                {!loading && members.length === 0 && <p className="text-muted">No members have joined yet.</p>}
                {!loading && members.length > 0 && (
                    <>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Age</th>
                                    <th>Gender</th>
                                    <th>Goal</th>
                                    <th>Package</th>
                                    <th>Trainer</th>
                                    <th>Trainer Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map((member, index) => (
                                    <tr key={member.clientId}>
                                        <td>{index + 1}</td>
                                        <td>{member.name}</td>
                                        <td>{member.email}</td>
                                        <td>{member.phone}</td>
                                        <td>{member.age}</td>
                                        <td>{member.gender}</td>
                                        <td><span className="badge bg-info text-dark">{member.goalName || "Not Set"}</span></td>
                                        <td>{member.packageName || "Not Subscribed"}</td>
                                        <td>{member.trainerName || "Not Assigned"}</td>
                                        <td>{member.trainerType || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-muted mt-2 mb-0">Total Members: <strong>{members.length}</strong></p>
                    </>
                )}
            </div>
        </div>
    )
}