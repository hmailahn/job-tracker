import { useState } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { useAuthStore } from '../store/authStore';
import { useApplications, useUpdateApplicationStatus } from '../hooks/useApplications';
import ApplicationModal from '../components/ApplicationModal';
import BoardColumn from '../components/BoardColumn';
import { STATUS_ORDER } from '../types/application';
import type { ApplicationStatus, Application } from '../types/application';
import { useStats } from '../hooks/useStats';
import StatsBar from '../components/StatsBar';
import { useFilteredApplications } from '../hooks/useFilteredApplications';
import { useThemeStore } from '../store/themeStore';
import UserSettingsModal from '../components/UserSettingsModal';

export default function BoardPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: applications, isLoading, error } = useApplications();
  const filteredApplications = useFilteredApplications(applications, searchQuery);
  const stats = useStats(filteredApplications);
  const updateStatus = useUpdateApplicationStatus();
  const [showModal, setShowModal] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | undefined>(undefined);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const [showSettings, setShowSettings] = useState(false);


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // pixels of movement before a drag starts
      },
    })
  );

  function appsForStatus(status: ApplicationStatus) {
    return filteredApplications?.filter((a) => a.status === status) ?? [];
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const appId = active.id as number;
    const newStatus = over.id as ApplicationStatus;

    const app = applications?.find((a) => a.id === appId);
    if (!app || app.status === newStatus) return;

    updateStatus.mutate({ id: appId, status: newStatus });
  }

  function openNewModal() {
    setEditingApp(undefined);
    setShowModal(true);
  }

  function openEditModal(app: Application) {
    setEditingApp(app);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingApp(undefined);
  }

  return (
    <div>
      <nav className="navbar">
        <span className="nav-logo">Job Tracker</span>
        <div className="nav-right">
          {user && (
            <button className="nav-user nav-user-btn" onClick={() => setShowSettings(true)}>
              <span className="nav-avatar">{user.displayName[0].toUpperCase()}</span>
              {user.displayName}
            </button>
          )}
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
          </button>
          <button className="btn-logout" onClick={logout}>Sign out</button>
        </div>
      </nav>
      <div className="container container-wide">
        <div className="toolbar">
          <h2>Board</h2>
          <div className="toolbar-actions">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search company or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => setSearchQuery('')}>×</button>
              )}
            </div>
            <button className="btn-primary" onClick={openNewModal}>
              + Add application
            </button>
          </div>
        </div>

        {filteredApplications && filteredApplications.length > 0 && (
          <StatsBar
            total={stats.total}
            responseRate={stats.responseRate}
            activeCount={stats.activeCount}
            avgDaysToResponse={stats.avgDaysToResponse}
          />
        )}

        {isLoading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Failed to load applications</p>}

        {applications && (
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="board">
              {STATUS_ORDER.map((status) => (
                <BoardColumn
                  key={status}
                  status={status}
                  applications={appsForStatus(status)}
                  onCardClick={openEditModal}
                />
              ))}
            </div>
          </DndContext>
        )}
      </div>

      {showModal && <ApplicationModal application={editingApp} onClose={closeModal} />}
      {showSettings && <UserSettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}