import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { memberApi as axiosInstance } from "../../api/axiosInstance"
import { generateAIDietPlan } from "../../api/aiApi"

function renderBoldText(text){
    if(!text) return null
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, idx) => {
        if(part.startsWith("**") && part.endsWith("**")){
            return <strong key={idx}>{part.slice(2, -2)}</strong>
        }
        return <span key={idx}>{part}</span>
    })
}

export default function DietPlanMember(){
    const auth = useSelector(state => state.auth)
    const [plan, setPlan] = useState(null)
    const [loading, setLoading] = useState(true)

    const [aiPlan, setAiPlan] = useState(null)
    const [aiLoading, setAiLoading] = useState(true)
    const [dismissed, setDismissed] = useState(false)
    const [askingWeight, setAskingWeight] = useState(false)
    const [askingPreference, setAskingPreference] = useState(false)
    const [generating, setGenerating] = useState(false)
    const [weight, setWeight] = useState("")

    const [displayedText, setDisplayedText] = useState("")

    useEffect(()=>{
        axiosInstance.get(`/member/diet-plan/${auth.userId}`)
            .then(resp => { setPlan(resp.data); setLoading(false) })
            .catch(err => { console.log(err); setLoading(false) })

        axiosInstance.get(`/member/ai-diet-plan/${auth.userId}`)
            .then(resp => {
                setAiPlan(resp.data.dietPlan)
                setAiLoading(false)
            })
            .catch(err => { console.log(err); setAiLoading(false) })
    },[])

    useEffect(()=>{
        if(!aiPlan) return

        const seenKey = `aiTypewriterSeen_${auth.userId}`
        const alreadySeen = localStorage.getItem(seenKey)

        if(alreadySeen){
            setDisplayedText(aiPlan)
            return
        }

        let i = 0
        const interval = setInterval(()=>{
            setDisplayedText(aiPlan.slice(0, i))
            i += 3
            if(i > aiPlan.length){
                clearInterval(interval)
                localStorage.setItem(seenKey, "true")
            }
        }, 15)
        return ()=> clearInterval(interval)
    },[aiPlan])

    const handleGenerate = async (dietPreference) => {
        setGenerating(true)
        setAskingPreference(false)
        try {
            const generated = await generateAIDietPlan(auth.userId, dietPreference, parseFloat(weight))
            setAiPlan(generated)
        } catch (err) {
            console.log(err)
            setAiPlan("Could not generate your diet plan right now. Please try again later.")
        } finally {
            setGenerating(false)
        }
    }

    return(
        <div>
            <h3 className="text-primary mb-3">My Diet Plan</h3>

            {/* AI-Generated Diet Plan */}
            {aiLoading && <p className="text-muted">Checking for your AI diet plan...</p>}

            {!aiLoading && aiPlan && (
                <div className="card p-4 mb-4 border-success">
                    <h5 className="text-success mb-3">🤖 AI-Suggested Diet Plan</h5>
                    <div style={{ whiteSpace: "pre-wrap" }}>{renderBoldText(displayedText)}</div>
                </div>
            )}

            {!aiLoading && !aiPlan && !dismissed && !askingWeight && !askingPreference && !generating && (
                <div className="card p-4 mb-4 text-center">
                    <h5 className="mb-3">Would you like a personalized AI-generated diet plan?</h5>
                    <div className="d-flex gap-3 justify-content-center">
                        <button className="btn btn-success px-4" onClick={()=>setAskingWeight(true)}>Yes</button>
                        <button className="btn btn-outline-secondary px-4" onClick={()=>setDismissed(true)}>No</button>
                    </div>
                </div>
            )}

            {askingWeight && (
                <div className="card p-4 mb-4 text-center">
                    <h5 className="mb-3">What is your current weight (kg)?</h5>
                    <input
                        type="number"
                        className="form-control w-50 mx-auto mb-3"
                        placeholder="e.g. 65"
                        value={weight}
                        onChange={(e)=>setWeight(e.target.value)}
                    />
                    <button
                        className="btn btn-success px-4"
                        disabled={!weight || parseFloat(weight) <= 0}
                        onClick={()=>{ setAskingWeight(false); setAskingPreference(true) }}
                    >
                        Continue
                    </button>
                </div>
            )}

            {askingPreference && (
                <div className="card p-4 mb-4 text-center">
                    <h5 className="mb-3">Are you Vegetarian or Non-Vegetarian?</h5>
                    <div className="d-flex gap-3 justify-content-center">
                        <button className="btn btn-success px-4" onClick={()=>handleGenerate("Vegetarian")}>Vegetarian</button>
                        <button className="btn btn-warning px-4" onClick={()=>handleGenerate("Non-Vegetarian")}>Non-Vegetarian</button>
                    </div>
                </div>
            )}

            {generating && (
                <div className="card p-4 mb-4 text-center">
                    <p className="text-muted mb-0">Generating your personalized diet plan...</p>
                </div>
            )}

            {/* Trainer-Assigned Diet Plan */}
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