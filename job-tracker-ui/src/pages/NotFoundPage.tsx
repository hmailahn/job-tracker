import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div className="auth-wrapper">
            <div className="auth-card" style={{ textAlign: 'center' }}>
                <h1>Job Tracker</h1>
                <h2>Page not found</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 1.5rem' }}>
                    The page you're looking for doesn't exist.
                </p>
                <Link to="/board" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', padding: '10px 20px' }}>
                    Back to board
                </Link>
            </div>
        </div>
    );
}