import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
        <label className="block mb-2 text-sm">Email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full p-2 border rounded mb-4" placeholder="admin@example.com" />
        <label className="block mb-2 text-sm">Password</label>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full p-2 border rounded mb-4" placeholder="Password" />
        <button className="w-full py-2 bg-sky-600 text-white rounded hover:bg-sky-700">Login</button>
      </form>
    </div>
  );
}
