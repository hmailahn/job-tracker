import { useState } from 'react';
import { changePassword } from '../api/user';

interface Props {
    onClose: () => void;
}

export default function UserSettingsModal({ onClose }: Props) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await changePassword(currentPassword, newPassword);
            setSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setError(err.response?.data?.error ?? 'Failed to update password.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <h3>Account settings</h3>
                <h4>Change password</h4>

                {error && <div className="error-banner">{error}</div>}
                {success && <div className="success-banner">Password updated successfully.</div>}

                <form onSubmit={handleSubmit}>
                    <label>
                        Current password
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        New password
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            minLength={6}
                            required
                        />
                    </label>
                    <label>
                        Confirm new password
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </label>

                    <div className="modal-actions">
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                            <button type="button" className="btn-ghost" onClick={onClose}>Close</button>
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Updating...' : 'Update password'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}