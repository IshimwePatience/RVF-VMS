import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
import Administration from './pages/Administration';
import ReportUsage from './pages/ReportUsage';
import Reports from './pages/Reports';
import VeterinaryPortal from './pages/VeterinaryPortal/VeterinaryPortal';
import Veterinaries from './pages/Veterinaries';
import LabPortal from './pages/LabPortal/LabPortal';
import { AuthContext } from './context/AuthContext';

const CentralOnlyRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  if (!user?.is_central && !user?.stock?.is_central && user?.role !== 'Admin') {
    return <Navigate to="/inventory" replace />;
  }
  return children;
};

const DistrictOrCentralRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  if (!user?.is_central && !user?.stock?.is_central && user?.role !== 'Admin' && !user?.stock?.district) {
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

const EndpointOnlyRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  if (!user?.stock?.is_endpoint) {
    return <Navigate to="/inventory" replace />;
  }
  return children;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 10000, // Auto update every 10 seconds across the entire app
      refetchOnWindowFocus: true,
      staleTime: 5000,
    },
  },
});

function App() {
  React.useEffect(() => {
    const handleOffline = () => {
      window.location.reload();
    };

    const checkConnection = () => {
      if (navigator.connection) {
        const { effectiveType } = navigator.connection;
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          window.location.reload();
        }
      }
    };

    window.addEventListener('offline', handleOffline);
    if (navigator.connection) {
      navigator.connection.addEventListener('change', checkConnection);
      checkConnection(); // Check initial state
    }

    return () => {
      window.removeEventListener('offline', handleOffline);
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', checkConnection);
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
      <AuthProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="requests" element={<Requests />} />
              <Route path="requests/new" element={<NewRequest />} />
              <Route path="transfers" element={<Transfers />} />
              <Route path="administrations" element={<EndpointOnlyRoute><Administration /></EndpointOnlyRoute>} />
              <Route path="veterinaries" element={<Veterinaries />} />
              <Route path="stocks" element={<DistrictOrCentralRoute><Stocks /></DistrictOrCentralRoute>} />
              <Route path="vaccines" element={<CentralOnlyRoute><Vaccines /></CentralOnlyRoute>} />
              <Route path="suppliers" element={<CentralOnlyRoute><Suppliers /></CentralOnlyRoute>} />
              <Route path="reports" element={<DistrictOrCentralRoute><Reports /></DistrictOrCentralRoute>} />
              <Route path="users" element={<AdminOnlyRoute><Users /></AdminOnlyRoute>} />
              <Route path="settings" element={<AdminOnlyRoute><Settings /></AdminOnlyRoute>} />
            </Route>
            <Route path="/veterinary-login" element={<ReportUsage mode="login" />} />
            <Route path="/veterinary-signup" element={<ReportUsage mode="register" />} />
            <Route path="/veterinary-portal/:phone" element={<VeterinaryPortal />} />
            <Route path="/lab-portal" element={<LabPortal />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
