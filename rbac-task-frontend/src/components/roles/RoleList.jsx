import React from 'react';

export default function RoleList({ roles = [] }) {
  return (
    <div>
      {roles.length === 0 && <div className="text-sm text-slate-500">No roles</div>}
      <ul>
        {roles.map(r => (
          <li key={r._id || r.id} className="py-2 border-b">
            <div className="font-medium">{r.roleName || r.roleName || r.roleName}</div>
            <div className="text-sm text-slate-500">{r.description || r.accessLevel}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
