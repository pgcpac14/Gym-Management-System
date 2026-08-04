import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { trainerApi as axiosInstance } from "../../api/axiosInstance"

export default function TrainerDashHome(){
    const auth = useSelector(state => state.auth)
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)

    const loadMembers = () => {
        setLoading(true)
        axiosInstance.get(`/trainer/my-members/${auth.userId}`)
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

    const noWorkout = members.filter(m => !m.workoutPlanName).length
    const noDiet = members.filter(m => !m.dietPlanName).length

    return(
        <div>
            <h3 className="text-primary mb-1">Welcome back, {auth.name} 👋</h3>
            <p className="text-muted mb-4">Here's an overview of your assigned members.</p>

            {loading && <p className="text-muted">Loading dashboard...</p>}

            {!loading && (
                <>
                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <div className="card p-4 text-center h-100">
                            <h6 className="text-muted mb-2">👥 Total Members</h6>
                            <h2 className="fw-bold">{members.length}</h2>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card p-4 text-center h-100">
                            <h6 className="text-muted mb-2">💪 Missing Workout Plan</h6>
                            <h2 className="fw-bold text-warning">{noWorkout}</h2>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card p-4 text-center h-100">
                            <h6 className="text-muted mb-2">🥗 Missing Diet Plan</h6>
                            <h2 className="fw-bold text-warning">{noDiet}</h2>
                        </div>
                    </div>
                </div>

                <div className="card p-4">
                    <h6 className="text-muted mb-3">Quick Links</h6>
                    <div className="d-flex flex-wrap gap-2">
                        <Link to="my-members" className="btn btn-sm btn-outline-primary">My Members</Link>
                        <Link to="workout-plans" className="btn btn-sm btn-outline-primary">Workout Plans</Link>
                        <Link to="diet-plans" className="btn btn-sm btn-outline-primary">Diet Plans</Link>
                        <Link to="progress-reports" className="btn btn-sm btn-outline-primary">Progress Reports</Link>
                    </div>
                </div>
                </>
            )}
        </div>
    )
}