import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminDashBoard(){
    const auth = useSelector(state => state.auth)
    return(
        <>
        <div className="dashboard-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0 text-primary fw-bold">🏋️ Gym Management System</h5>
            <span className="text-muted">Welcome, <strong>{auth.name}</strong> | Admin</span>
        </div>
        <div className="d-flex">
            <div className="sidebar p-3">
                <h6 className="text-uppercase text-muted mb-3" style={{fontSize:"12px"}}>Admin Panel</h6>
                <ul className="nav nav-pills flex-column">
                    <li className="nav-item">
                        <NavLink to="" end className="nav-link">🏠 Dashboard</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="members" className="nav-link">👤 Members</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="trainers" className="nav-link">🏃 Trainers</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="create-trainer" className="nav-link">➕ Create Trainer</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="assign-trainer" className="nav-link">📌 Assign Trainer</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="subscriptions" className="nav-link">📋 Subscriptions</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="gym-earnings" className="nav-link">💰 Gym Earnings</NavLink>
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