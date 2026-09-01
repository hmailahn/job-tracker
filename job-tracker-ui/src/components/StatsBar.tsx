interface Props {
    total: number;
    responseRate: number;
    activeCount: number;
    avgDaysToResponse: number | null;
}

export default function StatsBar({ total, responseRate, activeCount, avgDaysToResponse }: Props) {
    return (
        <div className="stats-bar">
            <div className="stat-card">
                <span className="stat-label">Total applications</span>
                <span className="stat-value">{total}</span>
            </div>
            <div className="stat-card">
                <span className="stat-label">Response rate</span>
                <span className="stat-value">{responseRate}%</span>
            </div>
            <div className="stat-card">
                <span className="stat-label">Active</span>
                <span className="stat-value">{activeCount}</span>
            </div>
            <div className="stat-card">
                <span className="stat-label">Avg. days waiting</span>
                <span className="stat-value">{avgDaysToResponse ?? '—'}</span>
            </div>
        </div>
    );
}