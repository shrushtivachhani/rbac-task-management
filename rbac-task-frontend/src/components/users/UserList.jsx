import React from 'react';

export default function UserList({ users = [] }) {
  return (
    <div>
      {users.length === 0 && <div className="text-sm text-slate-500">No users</div>}
      <ul>
        {users.map(u => (
          <li key={u._id || u.id} className="py-2 border-b flex justify-between items-center">
            <div>
              <div className="font-medium">{u.name}</div>
              <div className="text-sm text-slate-500">{u.email} • {u.role}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
