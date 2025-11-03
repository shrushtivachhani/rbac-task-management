import React, { useEffect, useState } from 'react';
import Header from '../../components/Layout/Header';
import Sidebar from '../../components/Layout/Sidebar';
import api from '../../api/api';
import UserList from '../../components/users/UserList';
import RoleList from '../../components/roles/RoleList';
import TaskList from '../../components/tasks/TaskList';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [uRes, rRes, tRes] = await Promise.all([
          api.get('/users'),
          api.get('/roles'),
          api.get('/tasks')
        ]);
        setUsers(uRes.data);
        setRoles(rRes.data);
        setTasks(tRes.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen">
        <Header />
        <main className="p-6 space-y-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded p-4 shadow">
              <h2 className="font-semibold mb-2">Users</h2>
              <UserList users={users} refresh={() => {}} />
            </div>
            <div className="bg-white rounded p-4 shadow">
              <h2 className="font-semibold mb-2">Roles</h2>
              <RoleList roles={roles} refresh={() => {}} />
            </div>
          </section>

          <section className="bg-white rounded p-4 shadow">
            <h2 className="font-semibold mb-2">All Tasks</h2>
            <TaskList tasks={tasks} refresh={() => {}} />
          </section>
        </main>
      </div>
    </div>
  );
}
