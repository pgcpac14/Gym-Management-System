import { useState, useEffect } from "react"
import { adminApi as axiosInstance } from "../../api/axiosInstance"

export default function GymEarnings(){
    const [earnings, setEarnings] = useState(null)
    const [loading, setLoading] = useState(true)

    const loadEarnings = () => {
        setLoading(true)
        axiosInstance.get("/admin/earnings")
            .then(resp => {
                setEarnings(resp.data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }

    useEffect(()=>{
        loadEarnings()
    },[])

    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"]
    const currentMonthName = monthNames[new Date().getMonth()]

    return(
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="text-primary mb-0">Gym Earnings</h3>
                <button className="btn btn-sm btn-outline-primary" onClick={loadEarnings}>
                    🔄 Refresh
                </button>
            </div>

            {loading && <p className="text-muted">Loading earnings...</p>}

            {!loading && earnings && (
                <>
                <div className="row g-3 mb-4">
                    <div className="col-md-6">
                        <div className="card p-4 text-center h-100">
                            <h6 className="text-muted mb-2">💰 Lifetime Earnings</h6>
                            <h2 className="text-success fw-bold">₹{earnings.lifetimeEarnings}</h2>
                            <p className="text-muted mb-0">{earnings.totalPayments} total subscriptions</p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card p-4 text-center h-100">
                            <h6 className="text-muted mb-2">📅 {currentMonthName} Earnings</h6>
                            <h2 className="text-primary fw-bold">₹{earnings.monthlyEarnings}</h2>
                            <p className="text-muted mb-0">{earnings.monthlyPayments} subscriptions this month</p>
                        </div>
                    </div>
                </div>

                <div className="card p-3">
                    <h5 className="mb-3">Earnings by Package Type</h5>
                    {(!earnings.breakdown || earnings.breakdown.length === 0) && (
                        <p className="text-muted">No subscriptions yet.</p>
                    )}
                    {earnings.breakdown && earnings.breakdown.length > 0 && (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Package</th>
                                        <th>Members Subscribed</th>
                                        <th>Total Earned</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {earnings.breakdown.map((pkg) => (
                                        <tr key={pkg.packageName}>
                                            <td>{pkg.packageName}</td>
                                            <td>{pkg.membersCount}</td>
                                            <td className="fw-semibold text-success">₹{pkg.totalEarned}</td>
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