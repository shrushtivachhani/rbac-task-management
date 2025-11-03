import React, { createContext, useState, useEffect } from 'react';
import { getAuthTokens, clearAuth } from '../services/authService';
import { io } from 'socket.io-client';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const tokens = getAuthTokens();
  const [auth, setAuth] = useState({ accessToken: tokens?.accessToken, user: tokens?.user });

  useEffect(() => {
    // If logged in, connect socket with user id room for notifications
    if (auth?.user?.id) {
      const socket = io(import.meta.env.VITE_API_BASE.replace('/api',''), { // connect to server root
        transports: ['websocket']
      });
      socket.emit('join', auth.user.id);
      // store socket on window for quick use (small convenience)
      window._socket = socket;
      return () => socket.disconnect();
    }
  }, [auth?.user?.id]);

  const setAuthState = (data) => {
    setAuth({ accessToken: data?.accessToken, user: data?.user });
  };

  const logoutLocal = () => {
    clearAuth();
    setAuth({ accessToken: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, setAuthState, logoutLocal }}>
      {children}
    </AuthContext.Provider>
  );
}
