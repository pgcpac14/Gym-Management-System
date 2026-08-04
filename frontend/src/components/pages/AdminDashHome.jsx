import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import axiosInstance from "../../api/axiosInstance"

export default function AdminDashHome(){
    const auth = useSelector(state => state.auth)
    const [members, setMembers] = useState([])
    const [trainers, setTrainers] = useState([])
    const [earnings, setEarnings] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        setLoading(true)
        Promise.all([
            axiosInstance.get("/admin/members"),
            axiosInstance.get("/admin/trainers"),
            axiosInstance.get("/admin/earnings")
        ]).then(([membersResp, trainersResp, earningsResp]) => {
            setMembers(membersResp.data)
            setTrainers(trainersResp.data)
            setEarnings(earningsResp.data)
            setLoading(false)
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })
    },[])

    const subscribedCount = members.filter(m => m.packageName).length
    const unassignedTrainerCount = members.filter(m => m.trainerType === "Personal Trainer" && !m.trainerName).length

    return(
        <div>
            <h3 className="text-primary mb-1">Welcome back, {auth.name} 👋</h3>
            <p className="text-muted mb-4">Here's how the gym is doing today.</p>

            {loading && <p className="text-muted">Loading dashboard...</p>}

            {!loading && (
                <>
                <div className="row g-3 mb-4">
                    <div className="col-md-3">
                        <div className="card p-4 text-center h-100">
                            <h6 className="text-muted mb-2">👥 Total Members</h6>
                            <h2 className="fw-bold">{members.length}</h2>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card p-4 text-center h-100">
                            <h6 className="text-muted mb-2">🏋️ Total Trainers</h6>
                            <h2 className="fw-bold">{trainers.length}</h2>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card p-4 text-center h-100">
                            <h6 className="text-muted mb-2">📦 Active Subscriptions</h6>
                            <h2 className="fw-bold text-success">{subscribedCount}</h2>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card p-4 text-center h-100">
                            <h6 className="text-muted mb-2">⏳ Pending Trainer Assignment</h6>
                            <h2 className="fw-bold text-warning">{unassignedTrainerCount}</h2>
                        </div>
                    </div>
                </div>

                {earnings && (
                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <div className="card p-4 h-100">
                                <h6 className="text-muted mb-2">💰 Lifetime Earnings</h6>
                                <h3 className="text-success fw-bold">₹{earnings.lifetimeEarnings}</h3>
                                <p className="text-muted mb-0">{earnings.totalPayments} total subscriptions</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card p-4 h-100">
                                <h6 className="text-muted mb-2">📅 This Month's Earnings</h6>
                                <h3 className="text-primary fw-bold">₹{earnings.monthlyEarnings}</h3>
                                <p className="text-muted mb-0">{earnings.monthlyPayments} subscriptions this month</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="card p-4">
                    <h6 className="text-muted mb-3">Quick Links</h6>
                    <div className="d-flex flex-wrap gap-2">
                        <Link to="members" className="btn btn-sm btn-outline-primary">Members</Link>
                        <Link to="trainers" className="btn btn-sm btn-outline-primary">Trainers</Link>
                        <Link to="assign-trainer" className="btn btn-sm btn-outline-primary">Assign Trainer</Link>
                        <Link to="subscriptions" className="btn btn-sm btn-outline-primary">Subscriptions</Link>
                        <Link to="gym-earnings" className="btn btn-sm btn-outline-primary">Gym Earnings</Link>
                    </div>
                </div>
                </>
            )}
        </div>
    )
}