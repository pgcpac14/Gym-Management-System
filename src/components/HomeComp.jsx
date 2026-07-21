import { NavLink } from "react-router-dom"

export default function HomeComp(){
    return(
        <>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
          <div className="container-fluid">
            <span className="navbar-brand fitcore-logo">
    🏋️ FitCore</span>
            <ul className="navbar-nav ms-auto d-flex flex-row gap-2">
              <li className="nav-item">
                <NavLink className="btn btn-light btn-sm" to="/login">Login</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="btn btn-outline-light btn-sm" to="/register">Register</NavLink>
              </li>
            </ul>
          </div>
        </nav>

        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h1 className="fw-bold text-primary mb-3">Welcome to Gym Management System</h1>
              <p className="text-muted mb-4">Manage your gym members, trainers, and schedules all in one place.</p>
              <div className="d-flex justify-content-center gap-3">
                <NavLink to="/login" className="btn btn-primary px-4 py-2">Login</NavLink>
                <NavLink to="/register" className="btn btn-outline-primary px-4 py-2">Register as Member</NavLink>
              </div>
            </div>
          </div>

          <div className="row mt-5 g-4">
            <div className="col-md-4">
              <div className="card p-4 text-center">
                <h4>👤 Members</h4>
                <p className="text-muted">Track and manage all gym members easily.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 text-center">
                <h4>🏃 Trainers</h4>
                <p className="text-muted">Assign trainers and manage workout plans.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 text-center">
                <h4>📋 Subscriptions</h4>
                <p className="text-muted">Handle gym subscriptions and payments.</p>
              </div>
            </div>
          </div>
        </div>
        </>
    )
}