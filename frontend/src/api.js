import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Problems ──────────────────────────────────────────────
export const getProblems = () => api.get('/problems');
export const getProblem  = (slug) => api.get(`/problems/${slug}`);
export const createProblem = (data) => api.post('/problems', data);
export const deleteProblem = (slug) => api.delete(`/problems/${slug}`);

// ── Solutions ─────────────────────────────────────────────
export const saveSolution = (data) => api.post('/solutions', data);
export const getSolutions = (problemId) => api.get(`/solutions/problem/${problemId}`);

export default api;
