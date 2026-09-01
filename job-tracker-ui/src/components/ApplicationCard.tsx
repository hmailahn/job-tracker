import { useDraggable } from '@dnd-kit/core';
import type { Application } from '../types/application';

interface Props {
    app: Application;
    onClick: () => void;
}

export default function ApplicationCard({ app, onClick }: Props) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: app.id!,
    });

    const style = transform
        ? {
            transform: `translate(${transform.x}px, ${transform.y}px)`,
            opacity: isDragging ? 0.5 : 1,
            zIndex: isDragging ? 10 : 1,
        }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="app-card"
            onClick={(e) => {
                // avoid triggering click right after a drag
                if (!isDragging) onClick();
            }}
        >
            <p className="app-card-role">{app.role}</p>
            <p className="app-card-company">{app.company}</p>
            <div className="app-card-meta">
                {(app.salaryMin || app.salaryMax) ? (
                    <span className="app-card-salary">
                        {app.salaryMin && `$${Math.round(app.salaryMin / 1000)}k`}
                        {app.salaryMin && app.salaryMax && '–'}
                        {app.salaryMax && `$${Math.round(app.salaryMax / 1000)}k`}
                    </span>
                ) : <span />}
                <span className="app-card-date">
                    {new Date(app.appliedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
            </div>
        </div>
    );
}