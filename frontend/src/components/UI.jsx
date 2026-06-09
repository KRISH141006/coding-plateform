export function Spinner() {
  return (
    <div className="loading-wrap">
      <div className="spinner" />
      <span>Loading…</span>
    </div>
  );
}

export function ErrorAlert({ message }) {
  return (
    <div className="alert alert-error">
      ⚠️ {message}
    </div>
  );
}

export function SuccessAlert({ message }) {
  return (
    <div className="alert alert-success">
      ✅ {message}
    </div>
  );
}

export function EmptyState({ icon = '📭', title = 'Nothing here yet', subtitle = '' }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">{icon}</span>
      <strong>{title}</strong>
      {subtitle && <span className="text-muted">{subtitle}</span>}
    </div>
  );
}
