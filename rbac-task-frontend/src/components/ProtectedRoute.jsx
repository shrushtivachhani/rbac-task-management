import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, roles = [] }) {
  const { auth } = useContext(AuthContext);
  if (!auth?.accessToken) return <Navigate to="/" />;
  if (roles.length > 0 && !roles.includes(auth.user.role)) {
    return <div style={{ padding: 20 }}>Access denied — your role cannot view this page.</div>;
  }
  return children;
}
