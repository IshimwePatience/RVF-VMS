import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="requests" element={<div className="p-8">Requests Placeholder</div>} />
              <Route path="stocks" element={<div className="p-8">Stock Overview Placeholder</div>} />
              <Route path="vaccines" element={<div className="p-8">Vaccine Types Placeholder</div>} />
              <Route path="suppliers" element={<div className="p-8">Suppliers Placeholder</div>} />
              <Route path="requests/new" element={<div className="p-8">New Request Placeholder</div>} />
              <Route path="transfers" element={<div className="p-8">Transfers Placeholder</div>} />
              <Route path="reports" element={<div className="p-8">Reports Placeholder</div>} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
