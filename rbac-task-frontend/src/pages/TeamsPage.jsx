import React, { useEffect, useState } from 'react';
import { fetchTeams, createTeam } from '../services/teamService';
import SimpleTable from '../components/SimpleTable';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ teamName:'', roleType:'Employee', teamLeadId:'' });

  useEffect(()=>load(),[]);
  const load = async ()=> setTeams(await fetchTeams());

  const createNew = async () => {
    if (!form.teamName) return alert('teamName required');
    await createTeam(form); setForm({ teamName:'', roleType:'Employee', teamLeadId:'' }); load();
  };

  return (
    <div>
      <h2>Teams</h2>
      <div className="card">
        <input placeholder="Team name" value={form.teamName} onChange={e=>setForm({...form, teamName:e.target.value})} />
        <select value={form.roleType} onChange={e=>setForm({...form, roleType:e.target.value})}>
          <option>Employee</option><option>ASM</option><option>BDM</option><option>HR</option>
        </select>
        <input placeholder="Team lead id (optional)" value={form.teamLeadId} onChange={e=>setForm({...form, teamLeadId:e.target.value})} />
        <button onClick={createNew} className="btn">Create team</button>
      </div>

      <SimpleTable columns={[{key:'teamName',title:'Team'},{key:'roleType',title:'Type'}]} data={teams} />
    </div>
  );
}
