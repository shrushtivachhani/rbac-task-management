import React, { useEffect, useState } from 'react';
import { fetchNotifications, markRead } from '../services/notificationService';

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([]);
  useEffect(()=>{ (async ()=> setNotifs(await fetchNotifications()))(); }, []);

  const markAll = async () => {
    const ids = notifs.filter(n=> !n.isRead).map(n=> n._id || n.id);
    if (!ids.length) return;
    await markRead(ids);
    setNotifs(await fetchNotifications());
  };

  return (
    <div>
      <h2>Notifications</h2>
      <button onClick={markAll} className="btn">Mark all read</button>
      <ul>
        {notifs.map(n => <li key={n._id}>{n.message} {n.isRead ? '(read)' : '(new)'}</li>)}
      </ul>
    </div>
  );
}
