import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/api';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const routeForRole = (role) => {
  switch (role) {
    case 'Admin': return '/dashboard/admin';
    case 'HR': return '/dashboard/hr';
    case 'BDM': return '/dashboard/bdm';
    case 'ASM': return '/dashboard/asm';
    case 'Employee': return '/dashboard/employee';
    case 'Super Employee': return '/dashboard/super';
    default: return '/login';
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = jwt_decode(token);
        setUser({ id: payload.userId, role: payload.role, teamId: payload.teamId || null });
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        console.warn('Invalid token');
        localStorage.removeItem('accessToken');
      }
    }
    setAuthReady(true);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user: userObj } = res.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setUser({ id: userObj.id, role: userObj.role, teamId: userObj.teamId });
      toast.success('Logged in');
      navigate(routeForRole(userObj.role));
      return res.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await api.post('/auth/logout', { refreshToken });
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      navigate('/login');
    }
  };

  const value = { user, login, logout, authReady, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
