import React, { useEffect, useState } from 'react';
import { fetchUsers, createUser, deleteUser } from '../services/userService';
import SimpleTable from '../components/SimpleTable';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name:'', email:'', password:'123456', role:'Employee' });

  useEffect(() => { load(); }, []);
  const load = async () => {
    try { setUsers(await fetchUsers()); } catch (e) { console.error(e); }
  };

  const create = async () => {
    try {
      await createUser(form);
      setForm({ name:'', email:'', password:'123456', role:'Employee' });
      load();
    } catch (e) { alert('Create failed: ' + e.message); }
  };

  const remove = async (id) => {
    if (!confirm('Delete user?')) return;
    await deleteUser(id); load();
  };

  const columns = [
    { key:'name', title:'Name' },
    { key:'email', title:'Email' },
    { key:'role', title:'Role' },
    { key:'status', title:'Status' }
  ];

  return (
    <div>
      <h2>Users</h2>
      <div className="card">
        <h4>Create User</h4>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <select value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
          <option>Employee</option><option>ASM</option><option>BDM</option><option>HR</option><option>Admin</option><option>Super Employee</option>
        </select>
        <button onClick={create} className="btn">Create</button>
      </div>

      <SimpleTable columns={columns} data={users} renderRowActions={(row) => (
        <div>
          <button className="btn-ghost" onClick={()=>alert('Open update UI to edit user ' + row._id)}>Edit</button>
          <button className="btn-danger" onClick={()=>remove(row._id)}>Delete</button>
        </div>
      )} />
    </div>
  );
}
