import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProblem, getSolutions, saveSolution, deleteProblem } from '../api';
import { DifficultyBadge, TagList } from '../components/Badges';
import { Spinner, ErrorAlert, SuccessAlert, EmptyState } from '../components/UI';

const LANGUAGES = ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C', 'Go', 'Rust', 'C#', 'Kotlin', 'Swift'];
const VERDICTS  = ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Memory Limit Exceeded', 'Runtime Error', 'Compilation Error'];

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function verdictClass(v) {
  if (!v) return 'verdict-default';
  const lower = v.toLowerCase();
  if (lower.includes('accept')) return 'verdict-ac';
  if (lower.includes('wrong'))  return 'verdict-wa';
  if (lower.includes('time'))   return 'verdict-tle';
  return 'verdict-default';
}

function HistoryItem({ sol }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="history-item">
      <div className="history-item-header" onClick={() => setOpen(o => !o)}>
        <div className="history-meta">
          <span className="history-lang">{sol.language}</span>
          {sol.verdict && (
            <span className={`history-verdict ${verdictClass(sol.verdict)}`}>
              {sol.verdict}
            </span>
          )}
          <div className="history-stats">
            {sol.runtime && <span>⏱ {sol.runtime}</span>}
            {sol.memory  && <span>💾 {sol.memory}</span>}
          </div>
        </div>
        <div className="flex gap-3" style={{ alignItems: 'center', gap: 'var(--space-3)' }}>
          <span className="history-date">{formatDate(sol.created_at)}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{open ? '▲' : '▼'}</span>
        </div>
      </div>
      {open && (
        <pre className="history-code">{sol.code}</pre>
      )}
    </div>
  );
}

export default function ProblemDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [problem,   setProblem]   = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [savMsg,    setSavMsg]    = useState('');
  const [savErr,    setSavErr]    = useState('');
  const [saving,    setSaving]    = useState(false);
  const [deleting,  setDeleting]  = useState(false);

  const [code,     setCode]     = useState('');
  const [language, setLanguage] = useState('Python');
  const [verdict,  setVerdict]  = useState('Accepted');
  const [runtime,  setRuntime]  = useState('');
  const [memory,   setMemory]   = useState('');

  useEffect(() => {
    setLoading(true);
    getProblem(slug)
      .then(res => {
        setProblem(res.data);
        return getSolutions(res.data.id);
      })
      .then(res => setSolutions(res.data))
      .catch(() => setError('Failed to load problem.'))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleSave(e) {
    e.preventDefault();
    setSavMsg(''); setSavErr('');
    if (!code.trim()) { setSavErr('Code cannot be empty.'); return; }
    setSaving(true);
    try {
      await saveSolution({
        problem_id: problem.id,
        language,
        code,
        verdict,
        runtime,
        memory,
      });
      setSavMsg('Solution saved!');
      setCode('');
      // Refresh solutions
      const res = await getSolutions(problem.id);
      setSolutions(res.data);
    } catch {
      setSavErr('Failed to save solution. Check your backend.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${problem.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteProblem(slug);
      navigate('/problems');
    } catch {
      setError('Failed to delete problem.');
      setDeleting(false);
    }
  }

  if (loading) return <Spinner />;
  if (error)   return <ErrorAlert message={error} />;
  if (!problem) return null;

  const tags = typeof problem.tags === 'string'
    ? problem.tags.split(',').map(t => t.trim()).filter(Boolean)
    : problem.tags ?? [];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/problems')}
          style={{ marginBottom: 'var(--space-4)' }}>
          ← Back to Problems
        </button>

        <div className="problem-detail-header">
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 'var(--space-2)' }}>
              {problem.title}
            </h1>
            <div className="problem-meta">
              <DifficultyBadge difficulty={problem.difficulty} />
              {problem.platform && <span className="platform-badge">{problem.platform}</span>}
              {problem.url && (
                <a
                  href={problem.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost btn-sm"
                  onClick={e => e.stopPropagation()}
                >
                  🔗 View Problem
                </a>
              )}
            </div>
            {tags.length > 0 && (
              <div style={{ marginTop: 'var(--space-3)' }}>
                <TagList tags={tags} />
              </div>
            )}
          </div>
          <button
            className="btn btn-danger btn-sm"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting…' : '🗑 Delete'}
          </button>
        </div>
      </div>

      {/* Problem Statement */}
      {problem.statement && (
        <div className="problem-statement">
          {problem.statement}
        </div>
      )}

      {/* Code Editor */}
      <div className="solution-section">
        <h2 className="section-title">✍️ Add Solution</h2>

        {savMsg && <SuccessAlert message={savMsg} />}
        {savErr && <ErrorAlert  message={savErr} />}

        <form onSubmit={handleSave}>
          {/* Toolbar */}
          <div className="editor-toolbar">
            <select
              className="form-select"
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              {LANGUAGES.map(l => <option key={l}>{l}</option>)}
            </select>
            <select
              className="form-select"
              value={verdict}
              onChange={e => setVerdict(e.target.value)}
            >
              {VERDICTS.map(v => <option key={v}>{v}</option>)}
            </select>
          </div>

          {/* Code Textarea */}
          <textarea
            id="code-editor"
            className="form-textarea code-editor"
            style={{ width: '100%' }}
            placeholder={`# Write your ${language} solution here…\n\ndef solution():\n    pass`}
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Tab') {
                e.preventDefault();
                const s = e.target.selectionStart;
                const end = e.target.selectionEnd;
                const val = e.target.value;
                setCode(val.substring(0, s) + '  ' + val.substring(end));
                setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s + 2; }, 0);
              }
            }}
          />

          {/* Runtime + Memory */}
          <div className="verdict-grid" style={{ marginTop: 'var(--space-4)' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Runtime</label>
              <input
                className="form-input"
                placeholder="e.g. 64 ms"
                value={runtime}
                onChange={e => setRuntime(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Memory</label>
              <input
                className="form-input"
                placeholder="e.g. 16.4 MB"
                value={memory}
                onChange={e => setMemory(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={saving}
              >
                {saving ? '⏳ Saving…' : '💾 Save Solution'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Version History */}
      <div className="solution-section">
        <h2 className="section-title">
          📜 Solution History
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 400 }}>
            &nbsp;({solutions.length} version{solutions.length !== 1 ? 's' : ''})
          </span>
        </h2>

        {solutions.length === 0 ? (
          <EmptyState
            icon="🕰️"
            title="No solutions yet"
            subtitle="Save your first solution above"
          />
        ) : (
          <div className="history-list">
            {[...solutions]
              .sort((a, b) => new Date(b.created_at ?? 0) - new Date(a.created_at ?? 0))
              .map((sol, i) => <HistoryItem key={sol.id ?? i} sol={sol} />)
            }
          </div>
        )}
      </div>
    </div>
  );
}
