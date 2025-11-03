import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTask, updateTask } from '../services/taskService';

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  useEffect(()=>{ (async ()=> setTask(await fetchTask(id)))(); },[id]);

  const save = async () => {
    await updateTask(id, task);
    alert('Saved');
  };

  if (!task) return <div>Loading...</div>;
  return (
    <div>
      <h2>Task: {task.title}</h2>
      <div className="card">
        <label>Title</label>
        <input value={task.title} onChange={e=>setTask({...task, title: e.target.value})} />
        <label>Description</label>
        <textarea value={task.description} onChange={e=>setTask({...task, description: e.target.value})} />
        <label>Status</label>
        <select value={task.status} onChange={e=>setTask({...task, status: e.target.value})}>
          <option value="todo">todo</option><option value="in_progress">in_progress</option><option value="done">done</option><option value="blocked">blocked</option>
        </select>
        <button onClick={save} className="btn">Save</button>
      </div>
    </div>
  );
}
