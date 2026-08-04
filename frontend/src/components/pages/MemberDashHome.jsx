import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import axiosInstance from "../../api/axiosInstance"

export default function MemberDashHome(){
    const auth = useSelector(state => state.auth)
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(true)

    const loadStatus = () => {
        setLoading(true)
        axiosInstance.get(`/subscription/check/${auth.userId}`)
            .then(resp => {
                setStatus(resp.data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }

    useEffect(()=>{ loadStatus() },[])

    return(
        <div>
            <h3 className="text-primary mb-1">Welcome back, {auth.name} 👋</h3>
            <p className="text-muted mb-4">Here's a quick look at your fitness journey.</p>

            {loading && <p className="text-muted">Loading dashboard...</p>}

            {!loading && status && (
                <>
                <div className="row g-3 mb-4">
                    <div className="col-md-6">
                        <div className="card p-4 h-100">
                            <h6 className="text-muted mb-2">🎯 Your Goal</h6>
                            <h4 className="mb-0">{status.goalName || "Not Set"}</h4>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card p-4 h-100">
                            <h6 className="text-muted mb-2">📦 Subscription Status</h6>
                            {status.hasSubscription ? (
                                <>
                                <h4 className="text-success mb-1">{status.packageName}</h4>
                                <p className="text-muted mb-0">{status.durationMonths} Month{status.durationMonths > 1 ? "s" : ""} plan</p>
                                </>
                            ) : (
                                <>
                                <h4 className="text-danger mb-2">Not Subscribed</h4>
                                <Link to="/subscribe" className="btn btn-sm btn-primary">Subscribe Now</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {status.hasSubscription && (
                    <div className="card p-4 mb-4">
                        <h6 className="text-muted mb-3">🏋️ Trainer</h6>
                        <p className="mb-1"><strong>Type:</strong> {status.trainerType || "-"}</p>
                        <p className="mb-0"><strong>Assigned Trainer:</strong> {status.trainerName || "Not assigned yet"}</p>
                    </div>
                )}

                <div className="card p-4">
                    <h6 className="text-muted mb-3">Quick Links</h6>
                    <div className="d-flex flex-wrap gap-2">
                        <Link to="subscription" className="btn btn-sm btn-outline-primary">Subscription</Link>
                        <Link to="workout-plan" className="btn btn-sm btn-outline-primary">Workout Plan</Link>
                        <Link to="diet-plan" className="btn btn-sm btn-outline-primary">Diet Plan</Link>
                        <Link to="progress-report" className="btn btn-sm btn-outline-primary">Progress Report</Link>
                    </div>
                </div>
                </>
            )}
        </div>
    )
}