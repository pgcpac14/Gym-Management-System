import { useState, useEffect } from "react"
import axiosInstance from "../../api/axiosInstance"

export default function Subscriptions(){
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

    const subscribed = members.filter(m => m.packageName)

    return(
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="text-primary mb-0">Subscriptions</h3>
                <button className="btn btn-sm btn-outline-primary" onClick={loadMembers}>🔄 Refresh</button>
            </div>

            <div className="card p-3">
                {loading && <p className="text-muted">Loading subscriptions...</p>}
                {!loading && subscribed.length === 0 && (
                    <p className="text-muted mb-0">No members have subscribed yet.</p>
                )}
                {!loading && subscribed.length > 0 && (
                    <>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Member</th>
                                    <th>Email</th>
                                    <th>Package</th>
                                    <th>Duration</th>
                                    <th>Price</th>
                                    <th>Trainer Type</th>
                                    <th>Assigned Trainer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscribed.map((m, index) => (
                                    <tr key={m.clientId}>
                                        <td>{index + 1}</td>
                                        <td>{m.name}</td>
                                        <td>{m.email}</td>
                                        <td><span className="badge bg-success">{m.packageName}</span></td>
                                        <td>{m.durationMonths} Month{m.durationMonths > 1 ? "s" : ""}</td>
                                        <td>₹{m.price}</td>
                                        <td>{m.trainerType || "-"}</td>
                                        <td>{m.trainerName || <span className="badge bg-warning text-dark">Not Assigned</span>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-muted mt-2 mb-0">Total Active Subscriptions: <strong>{subscribed.length}</strong></p>
                    </>
                )}
            </div>
        </div>
    )
}