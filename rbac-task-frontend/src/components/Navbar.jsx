import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { logout as serverLogout } from '../services/authService';

export default function Navbar() {
  const { auth, setAuthState, logoutLocal } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await serverLogout();
    } catch (e) {}
    logoutLocal();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="brand"><Link to="/">RBAC Task</Link></div>
      <div className="nav-links">
        {auth?.user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/tasks">Tasks</Link>
            <Link to="/users">Users</Link>
            <Link to="/teams">Teams</Link>
            <Link to="/notifications">Notifications</Link>
            {auth.user.role === 'Admin' && <Link to="/roles">Roles</Link>}
            {auth.user.role === 'Admin' && <Link to="/audit">Audit</Link>}
            <button onClick={handleLogout} className="btn-ghost">Logout</button>
            <span className="role-badge">{auth.user.role}</span>
          </>
        ) : (
          <Link to="/">Login</Link>
        )}
      </div>
    </nav>
  );
}
