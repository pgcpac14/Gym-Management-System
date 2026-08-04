import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { trainerApi as axiosInstance } from "../../api/axiosInstance"

export default function TrainerProgressReports(){
    const auth = useSelector(state => state.auth)
    const [members, setMembers] = useState([])
    const [selectedMid, setSelectedMid] = useState("")
    const [reports, setReports] = useState([])
    const [weight, setWeight] = useState("")
    const [notes, setNotes] = useState("")
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [msg, setMsg] = useState("")

    useEffect(()=>{
        axiosInstance.get(`/trainer/my-members/${auth.userId}`)
            .then(resp => {
                setMembers(resp.data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    },[])

    const loadReports = (mid) => {
        axiosInstance.get(`/trainer/progress-reports/${mid}`)
            .then(resp => setReports(resp.data))
            .catch(err => console.log(err))
    }

    const handleSelectMember = (mid) => {
        setSelectedMid(mid)
        setMsg("")
        if(mid){
            loadReports(mid)
        } else {
            setReports([])
        }
    }

    const handleSubmit = () => {
        if(!selectedMid) return
        setSubmitting(true)
        setMsg("")
        axiosInstance.post("/trainer/progress-report", {
            mid: Number(selectedMid),
            weight: weight ? Number(weight) : null,
            notes: notes
        })
        .then(() => {
            setMsg("Progress report added successfully.")
            setWeight("")
            setNotes("")
            loadReports(selectedMid)
        })
        .catch(err => {
            console.log(err)
            setMsg("Something went wrong. Please try again.")
        })
        .finally(() => setSubmitting(false))
    }

    return(
        <div>
            <h3 className="text-primary mb-3">Members Progress Report</h3>

            {loading && <p className="text-muted">Loading members...</p>}

            {!loading && (
                <div className="card p-4 mb-4">
                    <label className="form-label fw-semibold">Select Member</label>
                    <select
                        className="form-select mb-3"
                        value={selectedMid}
                        onChange={(e) => handleSelectMember(e.target.value)}
                    >
                        <option value="">-- Choose a member --</option>
                        {members.map(m => (
                            <option key={m.mid} value={m.mid}>{m.name}</option>
                        ))}
                    </select>

                    {selectedMid && (
                        <>
                        <div className="row g-3 mb-3">
                            <div className="col-md-4">
                                <label className="form-label">Weight (kg)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                />
                            </div>
                            <div className="col-md-8">
                                <label className="form-label">Notes</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Improved endurance, form corrections..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>
                        {msg && <p className="text-success">{msg}</p>}
                        <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                            {submitting ? "Saving..." : "Add Progress Report"}
                        </button>
                        </>
                    )}
                </div>
            )}

            {selectedMid && (
                <div className="card p-3">
                    <h6 className="mb-3">History</h6>
                    {reports.length === 0 && <p className="text-muted">No progress reports yet.</p>}
                    {reports.length > 0 && (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Date</th>
                                        <th>Weight (kg)</th>
                                        <th>Notes</th>
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
            )}
        </div>
    )
}