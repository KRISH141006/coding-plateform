import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProblems } from '../api';
import { DifficultyBadge } from '../components/Badges';
import { Spinner, ErrorAlert, EmptyState } from '../components/UI';

export default function Dashboard() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getProblems()
      .then(res => setProblems(res.data))
      .catch(() => setError('Failed to load problems. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const total  = problems.length;
  const easy   = problems.filter(p => p.difficulty?.toLowerCase() === 'easy').length;
  const medium = problems.filter(p => p.difficulty?.toLowerCase() === 'medium').length;
  const hard   = problems.filter(p => p.difficulty?.toLowerCase() === 'hard').length;
  const recent = [...problems]
    .sort((a, b) => new Date(b.created_at ?? 0) - new Date(a.created_at ?? 0))
    .slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Your personal coding progress at a glance.</p>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card" style={{ '--stat-color': 'var(--accent)' }}>
          <div className="stat-icon">🧩</div>
          <div className="stat-label">Total Solved</div>
          <div className="stat-value">{total}</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': 'var(--easy)' }}>
          <div className="stat-icon">🟢</div>
          <div className="stat-label">Easy</div>
          <div className="stat-value">{easy}</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': 'var(--medium)' }}>
          <div className="stat-icon">🟡</div>
          <div className="stat-label">Medium</div>
          <div className="stat-value">{medium}</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': 'var(--hard)' }}>
          <div className="stat-icon">🔴</div>
          <div className="stat-label">Hard</div>
          <div className="stat-value">{hard}</div>
        </div>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="card mb-4" style={{ marginBottom: 'var(--space-8)' }}>
          <div className="card-header">
            <span className="card-title">Difficulty Distribution</span>
            <span className="text-sm text-muted">{total} total</span>
          </div>
          <div style={{ display: 'flex', height: 10, borderRadius: 6, overflow: 'hidden', gap: 2 }}>
            {easy   > 0 && <div style={{ flex: easy,   background: 'var(--easy)',   borderRadius: 4 }} />}
            {medium > 0 && <div style={{ flex: medium, background: 'var(--medium)', borderRadius: 4 }} />}
            {hard   > 0 && <div style={{ flex: hard,   background: 'var(--hard)',   borderRadius: 4 }} />}
          </div>
          <div className="flex gap-4 mt-2" style={{ marginTop: 'var(--space-3)', fontSize: 12, color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--easy)' }}>● Easy ({easy})</span>
            <span style={{ color: 'var(--medium)' }}>● Medium ({medium})</span>
            <span style={{ color: 'var(--hard)' }}>● Hard ({hard})</span>
          </div>
        </div>
      )}

      {/* Recent Problems */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Problems</span>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/problems')}>
            View all →
          </button>
        </div>

        {recent.length === 0 ? (
          <EmptyState
            icon="📝"
            title="No problems yet"
            subtitle="Add your first problem to get started"
          />
        ) : (
          <div className="recent-list">
            {recent.map(p => (
              <div
                key={p.id ?? p.slug}
                className="recent-item"
                onClick={() => navigate(`/problems/${p.slug}`)}
              >
                <span className="recent-title">{p.title}</span>
                <div className="recent-right">
                  {p.platform && (
                    <span className="platform-badge">{p.platform}</span>
                  )}
                  <DifficultyBadge difficulty={p.difficulty} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
