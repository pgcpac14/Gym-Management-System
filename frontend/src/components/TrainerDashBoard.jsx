import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import FitCoreHeader from "./FitCoreHeader";

export default function TrainerDashBoard(){
    const auth = useSelector(state => state.auth)
    return(
        <>
        <FitCoreHeader welcomeName={auth.name} role="Trainer" />
        <div className="d-flex">
            <div className="sidebar p-3">
                <h6 className="text-uppercase text-muted mb-3" style={{fontSize:"12px"}}>Trainer Panel</h6>
                <ul className="nav nav-pills flex-column">
                    <li className="nav-item">
                        <NavLink to="" end className="nav-link">🏠 Dashboard</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="my-members" className="nav-link">👥 My Members</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="workout-plans" className="nav-link">💪 Members Workout Plan</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="diet-plans" className="nav-link">🥗 Members Diet Plan</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="progress-reports" className="nav-link">📈 Members Progress</NavLink>
                    </li>
                    <li className="nav-item mt-3">
                        <NavLink to="logout" className="nav-link text-danger">🚪 Logout</NavLink>
                    </li>
                </ul>
            </div>
            <div className="p-4 flex-grow-1">
                <Outlet />
            </div>
        </div>
        </>
    )
}