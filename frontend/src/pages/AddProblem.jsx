import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProblem } from '../api';
import { ErrorAlert, SuccessAlert } from '../components/UI';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const PLATFORMS    = ['LeetCode', 'Codeforces', 'HackerRank', 'AtCoder', 'CodeChef', 'GeeksforGeeks', 'Other'];

const INITIAL = {
  title: '', slug: '', difficulty: 'Easy',
  tags: '', url: '', platform: 'LeetCode', statement: '',
};

function slugify(str) {
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

export default function AddProblem() {
  const [form,    setForm]    = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => {
      const updated = { ...f, [name]: value };
      if (name === 'title' && !f.slug) {
        updated.slug = slugify(value);
      }
      return updated;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSuccess('');

    if (!form.title.trim() || !form.slug.trim()) {
      setError('Title and slug are required.');
      return;
    }

    setLoading(true);
    try {
      await createProblem({
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      setSuccess(`"${form.title}" added successfully!`);
      setForm(INITIAL);
    } catch (err) {
      const msg = err.response?.data?.detail ?? 'Failed to add problem. Check the backend.';
      setError(Array.isArray(msg) ? msg.map(m => m.msg).join('; ') : msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Add Problem</h1>
        <p>Manually track a new coding problem.</p>
      </div>

      {error   && <ErrorAlert   message={error}   />}
      {success && (
        <div>
          <SuccessAlert message={success} />
          <div className="flex gap-3 mb-4" style={{ marginBottom: 'var(--space-5)', gap: 'var(--space-3)', display: 'flex' }}>
            <button className="btn btn-primary" onClick={() => navigate('/problems')}>
              View Problems →
            </button>
            <button className="btn btn-ghost" onClick={() => setSuccess('')}>
              Add Another
            </button>
          </div>
        </div>
      )}

      <div className="form-card">
        <form onSubmit={handleSubmit}>

          {/* Title & Slug */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Title <span>*</span>
              </label>
              <input
                id="title" name="title" className="form-input"
                placeholder="Two Sum"
                value={form.title} onChange={handleChange} required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="slug">
                Slug <span>*</span>
              </label>
              <input
                id="slug" name="slug" className="form-input mono"
                placeholder="two-sum"
                value={form.slug} onChange={handleChange} required
              />
            </div>
          </div>

          {/* Difficulty & Platform */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="difficulty">Difficulty</label>
              <select
                id="difficulty" name="difficulty" className="form-select"
                value={form.difficulty} onChange={handleChange}
              >
                {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="platform">Platform</label>
              <select
                id="platform" name="platform" className="form-select"
                value={form.platform} onChange={handleChange}
              >
                {PLATFORMS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label" htmlFor="tags">
              Tags <small style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(comma-separated)</small>
            </label>
            <input
              id="tags" name="tags" className="form-input"
              placeholder="array, hash-map, two-pointers"
              value={form.tags} onChange={handleChange}
            />
          </div>

          {/* URL */}
          <div className="form-group">
            <label className="form-label" htmlFor="url">Problem URL</label>
            <input
              id="url" name="url" type="url" className="form-input"
              placeholder="https://leetcode.com/problems/two-sum/"
              value={form.url} onChange={handleChange}
            />
          </div>

          {/* Problem Statement */}
          <div className="form-group">
            <label className="form-label" htmlFor="statement">Problem Statement</label>
            <textarea
              id="statement" name="statement" className="form-textarea"
              placeholder="Paste the problem description here…"
              rows={6}
              value={form.statement} onChange={handleChange}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3" style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Adding…' : '✚ Add Problem'}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate('/problems')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
