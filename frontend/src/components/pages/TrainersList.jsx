import { useState, useEffect } from "react"
import axiosInstance from "../../api/axiosInstance"

export default function TrainersList(){
    const [trainers, setTrainers] = useState([])
    const [loading, setLoading] = useState(true)

    const loadTrainers = () => {
        setLoading(true)
        axiosInstance.get("/admin/trainers")
            .then(resp => {
                setTrainers(resp.data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }

    useEffect(()=>{ loadTrainers() },[])

    return(
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="text-primary mb-0">Trainers</h3>
                <button className="btn btn-sm btn-outline-primary" onClick={loadTrainers}>🔄 Refresh</button>
            </div>

            <div className="card p-3">
                {loading && <p className="text-muted">Loading trainers...</p>}

                {!loading && trainers.length === 0 && (
                    <p className="text-muted">No trainers registered yet.</p>
                )}

                {!loading && trainers.length > 0 && (
                    <>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Specialization</th>
                                    <th>Joined On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trainers.map((trainer, index) => (
                                    <tr key={trainer.trainer_id}>
                                        <td>{index + 1}</td>
                                        <td>{trainer.name}</td>
                                        <td>{trainer.email}</td>
                                        <td>{trainer.phone}</td>
                                        <td><span className="badge bg-info text-dark">{trainer.specialization}</span></td>
                                        <td>{new Date(trainer.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-muted mt-2 mb-0">Total Trainers: <strong>{trainers.length}</strong></p>
                    </>
                )}
            </div>
        </div>
    )
}