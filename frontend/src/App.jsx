import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Suppliers from './pages/Suppliers';
import Stocks from './pages/Stocks';
import Vaccines from './pages/Vaccines';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Requests from './pages/Requests';
import NewRequest from './pages/NewRequest';
import Transfers from './pages/Transfers';
import { AuthContext } from './context/AuthContext';

const CentralOnlyRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  if (!user?.is_central && !user?.stock?.is_central && user?.role !== 'Admin') {
    return <Navigate to="/inventory" replace />;
  }
  return children;
};

const AdminOnlyRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  if (user?.role !== 'Admin' && !user?.is_central) {
    return <Navigate to="/inventory" replace />;
  }
  return children;
};

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
              <Route path="requests" element={<Requests />} />
              <Route path="requests/new" element={<NewRequest />} />
              <Route path="transfers" element={<Transfers />} />
              <Route path="stocks" element={<CentralOnlyRoute><Stocks /></CentralOnlyRoute>} />
              <Route path="vaccines" element={<CentralOnlyRoute><Vaccines /></CentralOnlyRoute>} />
              <Route path="suppliers" element={<CentralOnlyRoute><Suppliers /></CentralOnlyRoute>} />
              <Route path="reports" element={<div className="p-8">Reports Placeholder</div>} />
              <Route path="users" element={<AdminOnlyRoute><Users /></AdminOnlyRoute>} />
              <Route path="settings" element={<AdminOnlyRoute><Settings /></AdminOnlyRoute>} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
