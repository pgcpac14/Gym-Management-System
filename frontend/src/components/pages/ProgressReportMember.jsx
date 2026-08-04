import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import axiosInstance from "../../api/axiosInstance"

export default function ProgressReportMember(){
    const auth = useSelector(state => state.auth)
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)

    const loadReports = () => {
        setLoading(true)
        axiosInstance.get(`/member/progress-reports/${auth.userId}`)
            .then(resp => {
                setReports(resp.data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }

    useEffect(()=>{ loadReports() },[])

    return(
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="text-primary mb-0">My Progress Report</h3>
                <button className="btn btn-sm btn-outline-primary" onClick={loadReports}>🔄 Refresh</button>
            </div>

            <div className="card p-3">
                {loading && <p className="text-muted">Loading...</p>}
                {!loading && reports.length === 0 && (
                    <p className="text-muted mb-0">
                        No progress reports yet. Your trainer will log updates here after your sessions.
                    </p>
                )}
                {!loading && reports.length > 0 && (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Date</th>
                                    <th>Weight (kg)</th>
                                    <th>Trainer Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map(r => (
                                    <tr key={r.reportId}>
                                        <td>{r.reportDate}</td>
                                        <td>{r.weight ?? "-"}</td>
                                        <td>{r.notes || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}