import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import FitCoreHeader from "./FitCoreHeader";

export default function UserDashBoard(){
    const auth = useSelector(state => state.auth)
    return(
        <>
        <FitCoreHeader welcomeName={auth.name} role="Member" />
        <div className="d-flex">
            <div className="sidebar p-3">
                <h6 className="text-uppercase text-muted mb-3" style={{fontSize:"12px"}}>Member Panel</h6>
                <ul className="nav nav-pills flex-column">
                    <li className="nav-item">
                        <NavLink to="" end className="nav-link">Dashboard</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="subscription" className="nav-link">Subscription</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="workout-plan" className="nav-link">Workout Plan</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="diet-plan" className="nav-link">Diet Plan</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="progress-report" className="nav-link">Progress Report</NavLink>
                    </li>
                    <li className="nav-item mt-3">
                        <NavLink to="logout" className="nav-link text-danger">Logout</NavLink>
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