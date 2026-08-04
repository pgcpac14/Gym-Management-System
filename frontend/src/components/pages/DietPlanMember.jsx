import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import axiosInstance from "../../api/axiosInstance"

export default function DietPlanMember(){
    const auth = useSelector(state => state.auth)
    const [plan, setPlan] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        axiosInstance.get(`/member/diet-plan/${auth.userId}`)
            .then(resp => {
                setPlan(resp.data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    },[])

    return(
        <div>
            <h3 className="text-primary mb-3">My Diet Plan</h3>

            {loading && <p className="text-muted">Loading...</p>}

            {!loading && plan && !plan.hasPlan && (
                <div className="card p-4 text-center">
                    <h5 className="mb-2">No diet plan assigned yet</h5>
                    <p className="text-muted mb-0">
                        Your trainer hasn't assigned a diet plan yet. Check back soon, or reach out to your trainer directly.
                    </p>
                </div>
            )}

            {!loading && plan && plan.hasPlan && (
                <div className="card p-4">
                    <h6 className="text-muted mb-1">Goal</h6>
                    <p className="mb-3">{plan.goalName || "-"}</p>

                    <h6 className="text-muted mb-1">Diet Plan</h6>
                    <p className="mb-0">{plan.description}</p>
                </div>
            )}
        </div>
    )
}