import { useDroppable } from '@dnd-kit/core';
import type { Application, ApplicationStatus } from '../types/application';
import { STATUS_LABELS } from '../types/application';
import ApplicationCard from './ApplicationCard';

interface Props {
    status: ApplicationStatus;
    applications: Application[];
    onCardClick: (app: Application) => void;
}

const STATUS_COLORS: Record<ApplicationStatus, string> = {
    APPLIED: 'var(--applied)',
    PHONE_SCREEN: 'var(--phone)',
    INTERVIEW: 'var(--interview)',
    OFFER: 'var(--offer)',
    REJECTED: 'var(--rejected)',
    WITHDRAWN: 'var(--withdrawn)',
};

export default function BoardColumn({ status, applications, onCardClick }: Props) {
    const { setNodeRef, isOver } = useDroppable({ id: status });

    return (
        <div ref={setNodeRef} className={`board-column ${isOver ? 'board-column-over' : ''}`}>
            <div className="board-column-header">
                <span className="board-column-dot" style={{ background: STATUS_COLORS[status] }} />
                <span className="board-column-title">{STATUS_LABELS[status]}</span>
                <span className="board-column-count">{applications.length}</span>
            </div>
            <div className="board-column-cards">
                {applications.map((app) => (
                    <ApplicationCard key={app.id} app={app} onEdit={() => onCardClick(app)} />
                ))}
                {applications.length === 0 && (
                    <p className="board-column-empty">No applications</p>
                )}
            </div>
        </div>
    );
}