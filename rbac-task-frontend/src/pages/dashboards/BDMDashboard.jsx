import React, { useEffect, useState } from 'react';
import Header from '../../components/Layout/Header';
import Sidebar from '../../components/Layout/Sidebar';
import api from '../../api/api';
import TaskList from '../../components/tasks/TaskList';

export default function BDMDashboard() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await api.get('/tasks');
      setTasks(res.data);
    })();
  }, []);
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <h1 className="text-2xl font-semibold">BDM Dashboard</h1>
          <div className="mt-4 bg-white p-4 rounded shadow">
            <TaskList tasks={tasks} refresh={() => {}} />
          </div>
        </main>
      </div>
    </div>
  );
}
