import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">⚡</div>
        <span className="logo-text">CodeVault</span>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-label">Navigation</span>

        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">📊</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/problems"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">📚</span>
          Problems
        </NavLink>

        <NavLink
          to="/add"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">➕</span>
          Add Problem
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <span>CodeVault v1.0</span>
      </div>
    </aside>
  );
}
