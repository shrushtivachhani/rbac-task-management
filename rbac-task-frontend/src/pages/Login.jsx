import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { AuthContext } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const { setAuthState } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      const resp = await login({ email, password });
      setAuthState({ accessToken: resp.accessToken, user: resp.user });
      navigate('/dashboard');
    } catch (e) {
      setErr(e.response?.data?.message || e.message || 'Login failed');
    }
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />
        <label>Password</label>
        <input value={password} type="password" onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="btn">Login</button>
        {err && <div className="error">{err}</div>}
      </form>
    </div>
  );
}
