export default function FitCoreHeader({ welcomeName, role }){
    return(
        <div className="dashboard-header d-flex justify-content-between align-items-center">
            <h3 className="fitcore-logo">🏋️ FitCore</h3>
            {welcomeName && (
                <span className="text-muted">
                    Welcome, <strong>{welcomeName}</strong> {role ? `| ${role}` : ""}
                </span>
            )}
        </div>
    )
}