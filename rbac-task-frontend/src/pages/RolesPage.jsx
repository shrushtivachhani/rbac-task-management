import React, { useEffect, useState } from 'react';
import { fetchRoles, createRole } from '../services/roleService';
import SimpleTable from '../components/SimpleTable';

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState('');

  useEffect(()=>load(),[]);
  const load = async ()=>{ setRoles(await fetchRoles()); };

  const createNew = async () => {
    if (!name) return alert('Enter role name');
    await createRole({ roleName: name, accessLevel: 'Scoped', description: '' });
    setName('');
    load();
  };

  return (
    <div>
      <h2>Roles</h2>
      <div className="card">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Role name" />
        <button onClick={createNew} className="btn">Add Role</button>
      </div>
      <SimpleTable columns={[{key:'roleName', title:'Role'},{key:'accessLevel', title:'Access'}]} data={roles} />
    </div>
  );
}
