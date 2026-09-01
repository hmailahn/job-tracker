import { useDraggable } from '@dnd-kit/core';
import type { Application } from '../types/application';

interface Props {
    app: Application;
    onEdit: () => void;
}

export default function ApplicationCard({ app, onEdit }: Props) {
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
        <div ref={setNodeRef} style={style} className="app-card">
            <div className="app-card-drag" {...listeners} {...attributes}>
                <div className="app-card-top">
                    <p className="app-card-role">{app.role}</p>
                    <button
                        className="app-card-edit"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                        aria-label="Edit application"
                    >
                        ✎
                    </button>
                </div>
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
        </div>
    );
}
