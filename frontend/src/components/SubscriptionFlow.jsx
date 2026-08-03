import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { memberApi as axiosInstance } from "../api/axiosInstance"

export default function SubscriptionFlow(){
    const auth = useSelector(state => state.auth)
    const navigate = useNavigate()

    const [step, setStep] = useState(1)
    const [packages, setPackages] = useState([])
    const [selectedPackage, setSelectedPackage] = useState(null)
    const [wantsTrainer, setWantsTrainer] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState("UPI")
    const [msg, setMsg] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [checkingStatus, setCheckingStatus] = useState(true)

    // Guard: if already subscribed, skip this page entirely
    useEffect(()=>{
        axiosInstance.get(`/subscription/check/${auth.userId}`)
            .then(resp => {
                if(resp.data.hasSubscription){
                    navigate("/member", { replace: true })
                } else {
                    setCheckingStatus(false)
                }
            })
            .catch(err => {
                console.log(err)
                setCheckingStatus(false)
            })
    },[])

    useEffect(()=>{
        if(!checkingStatus){
            axiosInstance.get("/subscription/packages")
                .then(resp => setPackages(resp.data))
                .catch(err => console.log(err))
        }
    },[checkingStatus])

    const handlePackageSelect = (pkg) => {
        setSelectedPackage(pkg)
        setStep(2)
    }

    const handleTrainerChoice = (choice) => {
        setWantsTrainer(choice)
        setStep(3)
    }

    const handleConfirm = () => {
        setSubmitting(true)
        setMsg("")

        axiosInstance.post("/subscription/save", {
            clientId: auth.userId,
            subscriptionId: selectedPackage.pid,
            wantsTrainer: wantsTrainer,
            paymentMethod: paymentMethod,
            amount: selectedPackage.price
        })
        .then(()=>{ navigate("/member", { replace: true }) })
        .catch((err)=>{
            if(err.response && err.response.data && err.response.data.message){
                setMsg(err.response.data.message)
                if(err.response.data.message.includes("already exists")){
                    setTimeout(()=>{ navigate("/member", { replace: true }) }, 1500)
                }
            } else {
                setMsg("Something went wrong. Please try again.")
            }
            setSubmitting(false)
        })
    }

    if(checkingStatus){
        return <div className="container mt-5 text-center">Loading...</div>
    }

    return(
        <div className="container mt-5 mb-5">
          <div className="row justify-content-center">
            <div className="col-md-7">
              <div className="card p-4">
                <div className="card-header bg-primary text-white text-center mb-4">
                  <h4 className="mb-0">🏋️ Complete Your Subscription</h4>
                </div>

                {/* STEP 1 - Package Selection */}
                {step === 1 && (
                    <>
                    <h5 className="mb-3">Step 1: Choose a Package</h5>
                    <div className="row g-3">
                        {packages.map((pkg)=>(
                            <div className="col-md-6" key={pkg.pid}>
                                <div className="card p-3 text-center h-100">
                                    <h5>{pkg.pname}</h5>
                                    <p className="text-muted mb-1">{pkg.duration} Month{pkg.duration > 1 ? "s" : ""}</p>
                                    <p className="fw-bold text-primary fs-4">₹{pkg.price}</p>
                                    <button className="btn btn-primary" onClick={()=>handlePackageSelect(pkg)}>Select</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    </>
                )}

                {/* STEP 2 - Trainer Choice */}
                {step === 2 && (
                    <>
                    <h5 className="mb-3">Step 2: Do you want a Trainer?</h5>
                    <p className="text-muted">Selected: <strong>{selectedPackage.pname} — ₹{selectedPackage.price}</strong></p>
                    <p className="text-muted small">Note: If you choose Yes, the Admin will assign a trainer to you after registration.</p>
                    <div className="d-flex gap-3 justify-content-center mt-4">
                        <button className="btn btn-success px-4" onClick={()=>handleTrainerChoice(true)}>
                            Yes, I want a Trainer
                        </button>
                        <button className="btn btn-outline-secondary px-4" onClick={()=>handleTrainerChoice(false)}>
                            No, I don't want a Trainer
                        </button>
                    </div>
                    <button className="btn btn-link mt-3" onClick={()=>setStep(1)}>← Back</button>
                    </>
                )}

                {/* STEP 3 - Payment + Confirm */}
                {step === 3 && (
                    <>
                    <h5 className="mb-3">Step 3: Confirm Your Subscription</h5>
                    <ul className="list-group mb-3">
                        <li className="list-group-item">Package: <strong>{selectedPackage.pname}</strong></li>
                        <li className="list-group-item">Duration: <strong>{selectedPackage.duration} Month{selectedPackage.duration > 1 ? "s" : ""}</strong></li>
                        <li className="list-group-item">Plan Price: <strong>₹{selectedPackage.price}</strong></li>
                        <li className="list-group-item">
                            Trainer: <strong>{wantsTrainer ? "Personal Trainer (+₹1000, admin will assign)" : "General Trainer (Free)"}</strong>
                        </li>
                        <li className="list-group-item">
                            Total: <strong>₹{selectedPackage.price + (wantsTrainer ? 1000 : 0)}</strong>
                        </li>
                    </ul>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Payment Method</label>
                        <select className="form-select" value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value)}>
                            <option value="UPI">UPI</option>
                            <option value="Cash">Cash</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Debit Card">Debit Card</option>
                            <option value="Net Banking">Net Banking</option>
                        </select>
                    </div>
                    {msg && <p className="text-danger">{msg}</p>}
                    <button className="btn btn-primary w-100" onClick={handleConfirm} disabled={submitting}>
                        {submitting ? "Confirming..." : `Confirm & Pay ₹${selectedPackage.price + (wantsTrainer ? 1000 : 0)}`}
                    </button>
                    <button className="btn btn-link mt-2" onClick={()=>setStep(2)}>← Back</button>
                    </>
                )}

              </div>
            </div>
          </div>
        </div>
    )
}