import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import RolesPage from './pages/RolesPage';
import TeamsPage from './pages/TeamsPage';
import TasksPage from './pages/TasksPage';
import TaskDetail from './pages/TaskDetail';
import NotificationsPage from './pages/NotificationsPage';
import AuditPage from './pages/AuditPage';
import Navbar from './components/Navbar';
import { AuthContext } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const { auth } = useContext(AuthContext);

  return (
    <div className="app-root">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={auth?.accessToken ? <Navigate to="/dashboard" /> : <Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute roles={['Admin','HR','BDM','ASM','Super Employee']}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <ProtectedRoute roles={['Admin']}>
                <RolesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teams"
            element={
              <ProtectedRoute roles={['Admin','HR','BDM','ASM','Super Employee']}>
                <TeamsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute roles={['Admin','HR','BDM','ASM','Employee','Super Employee']}>
                <TasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/:id"
            element={
              <ProtectedRoute roles={['Admin','HR','BDM','ASM','Employee','Super Employee']}>
                <TaskDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute roles={['Admin','HR','BDM','ASM','Employee','Super Employee']}>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit"
            element={
              <ProtectedRoute roles={['Admin']}>
                <AuditPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </main>
    </div>
  );
}
