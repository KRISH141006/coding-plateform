import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar      from './components/Sidebar';
import Dashboard    from './pages/Dashboard';
import Problems     from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import AddProblem   from './pages/AddProblem';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/"               element={<Dashboard />} />
            <Route path="/problems"       element={<Problems />} />
            <Route path="/problems/:slug" element={<ProblemDetail />} />
            <Route path="/add"            element={<AddProblem />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
