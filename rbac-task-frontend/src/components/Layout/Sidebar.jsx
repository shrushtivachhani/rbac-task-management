import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role;

  const links = [
    { to: '/dashboard/shared/tasks', label: 'Tasks', roles: ['Admin','HR','BDM','ASM','Employee','Super Employee'] },
    { to: '/dashboard/admin/users', label: 'Users', roles: ['Admin'] },
    { to: '/dashboard/admin/roles', label: 'Roles', roles: ['Admin'] },
    { to: '/dashboard/hr/team', label: 'HR Team', roles: ['HR','Admin'] },
    { to: '/dashboard/bdm/teams', label: 'ASM Teams', roles: ['BDM','Admin'] },
    { to: '/dashboard/asm/members', label: 'My Team', roles: ['ASM','Admin'] },
    { to: '/dashboard/employee/mytasks', label: 'My Tasks', roles: ['Employee'] },
    { to: '/dashboard/super/overview', label: 'Overview', roles: ['Super Employee','Admin'] }
  ];

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-3">
      <div className="mb-4 font-bold">Navigation</div>
      <nav className="flex flex-col gap-2">
        {links.filter(l => l.roles.includes(role)).map(l => (
          <NavLink key={l.to} to={l.to} className={({isActive}) => `p-2 rounded ${isActive ? 'bg-sky-100' : 'hover:bg-slate-50'}`}>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
