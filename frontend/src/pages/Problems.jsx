import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProblems } from '../api';
import { DifficultyBadge, TagList } from '../components/Badges';
import { Spinner, ErrorAlert, EmptyState } from '../components/UI';

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function Problems() {
  const [problems, setProblems]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [filter, setFilter]       = useState('All');
  const [search, setSearch]       = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getProblems()
      .then(res => setProblems(res.data))
      .catch(() => setError('Failed to load problems.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const filtered = problems.filter(p => {
    const matchDiff = filter === 'All' || p.difficulty?.toLowerCase() === filter.toLowerCase();
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase()) ||
                        p.tags?.toString().toLowerCase().includes(search.toLowerCase());
    return matchDiff && matchSearch;
  });

  return (
    <div>
      <div className="page-header">
        <h1>Problems</h1>
        <p>{problems.length} problem{problems.length !== 1 ? 's' : ''} tracked</p>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* Toolbar */}
      <div className="flex-between gap-3 mb-4" style={{ marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
        <div className="flex gap-2">
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`btn btn-sm ${filter === d ? 'btn-primary' : 'btn-ghost'}`}
            >
              {d}
            </button>
          ))}
        </div>
        <input
          className="form-input"
          style={{ maxWidth: 260 }}
          placeholder="🔍  Search by title or tag…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No problems found"
          subtitle={search || filter !== 'All' ? 'Try adjusting your search or filter' : 'Add your first problem using the sidebar'}
        />
      ) : (
        <table className="problems-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Tags</th>
              <th>Platform</th>
              <th>Added</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, idx) => (
              <tr key={p.id ?? p.slug} onClick={() => navigate(`/problems/${p.slug}`)}>
                <td style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', fontSize: 12 }}>
                  {String(idx + 1).padStart(2, '0')}
                </td>
                <td>
                  <span className="problem-title-link">{p.title}</span>
                </td>
                <td>
                  <DifficultyBadge difficulty={p.difficulty} />
                </td>
                <td>
                  <TagList tags={p.tags} />
                </td>
                <td>
                  {p.platform
                    ? <span className="platform-badge">{p.platform}</span>
                    : <span className="text-muted">—</span>
                  }
                </td>
                <td className="problem-date">{formatDate(p.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
