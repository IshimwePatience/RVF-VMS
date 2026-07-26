import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios';

// Global Axios Interceptor to handle session expiration
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      
      const baseUrl = import.meta.env.BASE_URL || '/';
      const redirect = (path) => {
        const b = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const p = path.startsWith('/') ? path : `/${path}`;
        window.location.href = `${b}${p}`;
      };

      // Don't intercept if already on a login page
      if (!currentPath.includes('login') && !currentPath.includes('report-usage')) {
        if (currentPath.includes('/veterinary-portal')) {
          localStorage.removeItem('vet_token');
          localStorage.removeItem('vet_user');
          redirect('/report-usage');
        } else if (currentPath.includes('/lab-portal')) {
          localStorage.removeItem('lab_token');
          localStorage.removeItem('lab_user');
          redirect('/lab-login');
        } else if (currentPath.includes('/daro-portal')) {
          localStorage.removeItem('daro_token');
          localStorage.removeItem('daro_user');
          redirect('/daro-login');
        } else if (currentPath.includes('/rab-portal')) {
          localStorage.removeItem('rab_token');
          localStorage.removeItem('rab_user');
          redirect('/rab-login');
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          redirect('/login');
        }
      }
    }
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
