import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { logout, user } = useAuth();
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <div className="text-lg font-semibold">RBAC Task System</div>
      <div className="flex items-center gap-4">
        <div className="text-sm">Role: <strong>{user?.role}</strong></div>
        <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
      </div>
    </header>
  );
}
