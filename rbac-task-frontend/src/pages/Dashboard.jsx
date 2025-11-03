import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { fetchTasks } from '../services/taskService';
import useSocket from '../hooks/useSocket';
import { fetchNotifications } from '../services/notificationService';

export default function Dashboard() {
  const { auth } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const t = await fetchTasks();
        setTasks(t);
        const n = await fetchNotifications();
        setNotifs(n);
      } catch (e) {}
    })();
  }, []);

  useSocket((payload) => {
    setNotifs(prev => [payload, ...prev]);
  });

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, <strong>{auth.user?.name}</strong> — role: {auth.user?.role}</p>
      <section>
        <h3>Recent tasks</h3>
        <ul>
          {tasks.slice(0,5).map(t => <li key={t._id}>{t.title} — {t.status}</li>)}
        </ul>
      </section>
      <section>
        <h3>Notifications</h3>
        <ul>
          {notifs.slice(0,5).map((n, i) => <li key={i}>{n.message || JSON.stringify(n)}</li>)}
        </ul>
      </section>
    </div>
  );
}
