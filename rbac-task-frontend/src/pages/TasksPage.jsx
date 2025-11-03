import React, { useEffect, useState } from 'react';
import { fetchTasks, createTask, deleteTask } from '../services/taskService';
import SimpleTable from '../components/SimpleTable';
import { fetchUsers, fetchUsers as getUsers } from '../services/userService';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ title:'', description:'', assignedTo:'', priority:'medium', deadline:'' });

  useEffect(()=> {
    (async ()=> {
      setTasks(await fetchTasks());
      setUsers(await getUsers());
    })();
  },[]);

  const createNew = async () => {
    if (!form.title || !form.assignedTo) return alert('title & assignedTo required');
    await createTask(form);
    setForm({ title:'', description:'', assignedTo:'', priority:'medium', deadline:'' });
    setTasks(await fetchTasks());
  };

  const remove = async (id) => {
    if (!confirm('Delete task?')) return;
    await deleteTask(id);
    setTasks(await fetchTasks());
  };

  const columns = [
    { key:'title', title:'Title' },
    { key:'status', title:'Status' },
    { key:'priority', title:'Priority' },
    { key:'deadline', title:'Deadline' }
  ];

  return (
    <div>
      <h2>Tasks</h2>
      <div className="card">
        <input placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
        <input placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        <select value={form.assignedTo} onChange={e=>setForm({...form, assignedTo:e.target.value})}>
          <option value="">-- assign to --</option>
          {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
        </select>
        <select value={form.priority} onChange={e=>setForm({...form, priority:e.target.value})}>
          <option value="low">low</option><option value="medium">medium</option><option value="high">high</option>
        </select>
        <input type="date" value={form.deadline} onChange={e=>setForm({...form, deadline:e.target.value})} />
        <button onClick={createNew} className="btn">Create Task</button>
      </div>

      <SimpleTable columns={columns} data={tasks} renderRowActions={(row)=>(
        <>
          <a className="btn-ghost" href={`/tasks/${row._id}`}>Open</a>
          <button className="btn-danger" onClick={()=>remove(row._id)}>Delete</button>
        </>
      )} />
    </div>
  );
}
