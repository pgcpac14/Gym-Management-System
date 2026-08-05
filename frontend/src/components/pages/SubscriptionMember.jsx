import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { memberApi as axiosInstance } from "../../api/axiosInstance"

export default function SubscriptionMember(){
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
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="text-primary mb-0">My Subscription</h3>
                <button className="btn btn-sm btn-outline-primary" onClick={loadStatus}>🔄 Refresh</button>
            </div>

            {loading && <p className="text-muted">Loading subscription details...</p>}

            {!loading && status && !status.hasSubscription && (
                <div className="card p-4 text-center">
                    <h5 className="mb-2">You're not subscribed yet</h5>
                    <p className="text-muted mb-3">
                        Subscribe to a package to unlock your workout plan, diet plan, and trainer support.
                    </p>
                    <div>
                        <Link to="/subscribe" className="btn btn-primary px-4">Subscribe Now</Link>
                    </div>
                </div>
            )}

            {!loading && status && status.hasSubscription && (
                <div className="card p-4">
                    <div className="row g-4">
                        <div className="col-md-6">
                            <h6 className="text-muted mb-1">Package</h6>
                            <h4 className="text-success">{status.packageName}</h4>
                        </div>
                        <div className="col-md-6">
                            <h6 className="text-muted mb-1">Duration</h6>
                            <h4>{status.durationMonths} Month{status.durationMonths > 1 ? "s" : ""}</h4>
                        </div>
                        <div className="col-md-6">
                            <h6 className="text-muted mb-1">Goal</h6>
                            <p className="fs-5 mb-0">{status.goalName || "Not Set"}</p>
                        </div>
                        <div className="col-md-6">
                            <h6 className="text-muted mb-1">Trainer Type</h6>
                            <p className="fs-5 mb-0">{status.trainerType || "-"}</p>
                        </div>
                        <div className="col-md-6">
                            <h6 className="text-muted mb-1">Assigned Trainer</h6>
                            <p className="fs-5 mb-0">
                                {status.trainerName || <span className="badge bg-warning text-dark">Pending Assignment</span>}
                            </p>
                        </div>
                        <div className="col-md-6">
                            <h6 className="text-muted mb-1">Total Fees Paid</h6>
                            <p className="fs-5 fw-semibold text-success mb-0">₹{status.fees}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}