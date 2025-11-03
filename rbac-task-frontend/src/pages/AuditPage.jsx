import React, { useEffect, useState } from 'react';
import { fetchAudit } from '../services/auditService';

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  useEffect(()=>{ (async ()=> setLogs((await fetchAudit()).logs))(); }, []);

  return (
    <div>
      <h2>Audit Logs</h2>
      <ul>
        {logs?.map(l => <li key={l._id}>{new Date(l.timestamp).toLocaleString()} - {l.actionType || l.action} - {l.details}</li>)}
      </ul>
    </div>
  );
}
