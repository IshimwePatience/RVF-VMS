import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

export const AuthContext = createContext();

const getStoragePrefix = () => {
  const path = window.location.pathname;
  if (path.includes('veterinary')) return 'vet_';
  if (path.includes('lab')) return 'lab_';
  if (path.includes('daro')) return 'daro_';
  if (path.includes('rab')) return 'rab_';
  return 'admin_';
};

const prefix = getStoragePrefix();
const TOKEN_KEY = `${prefix}token`;
const USER_KEY = `${prefix}user`;

const initialToken = localStorage.getItem(TOKEN_KEY) || localStorage.getItem('token'); // Fallback for transition
if (initialToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY) || localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || localStorage.getItem('token'));
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // User is initialized synchronously now
      
      const newSocket = io('/', {
        path: '/rvf-api/socket.io',
        auth: { token },
        transports: ['polling'],
        upgrade: false // Explicitly disable WebSocket upgrade to prevent Nginx 400 errors
      });
      setSocket(newSocket);
      
      return () => newSocket.close();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      if (socket) socket.close();
    }
    setLoading(false);
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('token'); // cleanup old
    localStorage.removeItem('user'); // cleanup old
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, socket, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
