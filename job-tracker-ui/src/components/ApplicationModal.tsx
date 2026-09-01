import { useState } from 'react';
import { useCreateApplication, useUpdateApplicationFull, useDeleteApplication } from '../hooks/useApplications';
import type { Application, ApplicationStatus } from '../types/application';

interface Props {
    application?: Application;
    onClose: () => void;
}

export default function ApplicationModal({ application, onClose }: Props) {
    const isEditing = !!application;
    const createApplication = useCreateApplication();
    const updateApplication = useUpdateApplicationFull();
    const deleteApplication = useDeleteApplication();

    const [company, setCompany] = useState(application?.company ?? '');
    const [role, setRole] = useState(application?.role ?? '');
    const [jobUrl, setJobUrl] = useState(application?.jobUrl ?? '');
    const [status, setStatus] = useState<ApplicationStatus>(application?.status ?? 'APPLIED');
    const [appliedDate, setAppliedDate] = useState(
        application?.appliedDate ?? new Date().toISOString().slice(0, 10)
    );
    const [salaryMin, setSalaryMin] = useState(application?.salaryMin?.toString() ?? '');
    const [salaryMax, setSalaryMax] = useState(application?.salaryMax?.toString() ?? '');
    const [notes, setNotes] = useState(application?.notes ?? '');
    const [error, setError] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!company.trim() || !role.trim()) {
            setError('Company and role are required.');
            return;
        }
        setError(null);

        const payload = {
            company,
            role,
            jobUrl: jobUrl || undefined,
            status,
            appliedDate,
            salaryMin: salaryMin ? Number(salaryMin) : undefined,
            salaryMax: salaryMax ? Number(salaryMax) : undefined,
            notes: notes || undefined,
        };

        try {
            if (isEditing && application.id) {
                await updateApplication.mutateAsync({ id: application.id, application: payload as Application });
            } else {
                await createApplication.mutateAsync(payload);
            }
            onClose();
        } catch {
            setError('Failed to save application. Please try again.');
        }
    }

    async function handleDelete() {
        if (!application?.id) return;
        await deleteApplication.mutateAsync(application.id);
        onClose();
    }

    const isSaving = createApplication.isPending || updateApplication.isPending;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <h3>{isEditing ? 'Edit application' : 'New application'}</h3>

                {error && <div className="error-banner">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <label>
                            Company
                            <input value={company} onChange={(e) => setCompany(e.target.value)} required />
                        </label>
                        <label>
                            Role
                            <input value={role} onChange={(e) => setRole(e.target.value)} required />
                        </label>
                    </div>

                    <label>
                        Job URL
                        <input value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} placeholder="https://..." />
                    </label>

                    <div className="form-row">
                        <label>
                            Status
                            <select value={status} onChange={(e) => setStatus(e.target.value as ApplicationStatus)}>
                                <option value="APPLIED">Applied</option>
                                <option value="PHONE_SCREEN">Phone screen</option>
                                <option value="INTERVIEW">Interview</option>
                                <option value="OFFER">Offer</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="WITHDRAWN">Withdrawn</option>
                            </select>
                        </label>
                        <label>
                            Applied date
                            <input type="date" value={appliedDate} onChange={(e) => setAppliedDate(e.target.value)} required />
                        </label>
                    </div>

                    <div className="form-row">
                        <label>
                            Salary min
                            <input type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} placeholder="80000" />
                        </label>
                        <label>
                            Salary max
                            <input type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} placeholder="100000" />
                        </label>
                    </div>

                    <label>
                        Notes
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
                    </label>

                    <div className="modal-actions">
                        {confirmDelete ? (
                            <div className="delete-confirm-full">
                                <span>Delete this application?</span>
                                <div className="delete-confirm-buttons">
                                    <button type="button" className="btn-ghost" onClick={() => setConfirmDelete(false)}>Cancel</button>
                                    <button type="button" className="btn-danger" onClick={handleDelete}>Yes, delete</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {isEditing && (
                                    <button type="button" className="btn-danger-ghost" onClick={() => setConfirmDelete(true)}>
                                        Delete
                                    </button>
                                )}
                                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                                    <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
                                    <button type="submit" className="btn-primary" disabled={isSaving}>
                                        {isSaving ? 'Saving...' : isEditing ? 'Save changes' : 'Add application'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
