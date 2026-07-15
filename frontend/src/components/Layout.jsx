import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { Search, MoreVertical, Grid, LogOut, Bell, CheckCircle2, Clock } from 'lucide-react';
import { Outlet, Navigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import minisanteLogo from '../assets/images/RAB_Logo2.png';
import GlobalSearch from './GlobalSearch';

export default function Layout() {
  const { user, logout, token, socket } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const queryClient = useQueryClient();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showReminderDropdown, setShowReminderDropdown] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(
    localStorage.getItem('remindersEnabled') !== 'false'
  );
  const [reminderTime, setReminderTime] = useState(
    parseInt(localStorage.getItem('reminderTime') || '5', 10)
  );

  useEffect(() => {
    localStorage.setItem('remindersEnabled', remindersEnabled);
    localStorage.setItem('reminderTime', reminderTime.toString());
  }, [remindersEnabled, reminderTime]);

  useQuery({
    queryKey: ['reminders'],
    queryFn: async () => {
      const res = await axios.get('/rvf-api/notifications/reminders');
      const { pendingRequests, unconfirmedDeliveries, unreceivedShipments, pendingFollowUps } = res.data;

      if (pendingRequests > 0) {
        addToast(`Reminder: You have ${pendingRequests} pending request(s) to review.`, 'info');
      }
      if (unconfirmedDeliveries > 0) {
        addToast(`Reminder: You have ${unconfirmedDeliveries} incoming delivery(s) waiting to be confirmed.`, 'info');
      }
      if (unreceivedShipments > 0) {
        addToast(`Reminder: You have ${unreceivedShipments} shipment(s) currently in transit. Please follow up.`, 'info');
      }
      if (pendingFollowUps > 0) {
        addToast(`Reminder: You have ${pendingFollowUps} pending veterinary follow-up(s) to complete.`, 'info');
      }
      return res.data;
    },
    enabled: remindersEnabled && !!token,
    refetchInterval: Math.max(1, reminderTime) * 60 * 1000,
  });

  const { data: notificationsData = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await axios.get('/rvf-api/notifications');
      return res.data;
    },
    enabled: !!token,
  });

  const notifications = notificationsData;

  useEffect(() => {
    if (socket) {
      const handleNotification = (notif) => {
        queryClient.setQueryData(['notifications'], old => [notif, ...(old || [])]);
        if (remindersEnabled) {
          addToast(notif.message, 'info');
        }
      };
      socket.on('notification', handleNotification);
      return () => {
        socket.off('notification', handleNotification);
      };
    }
  }, [socket, remindersEnabled, queryClient, addToast]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`/rvf-api/notifications/${id}/read`);
      queryClient.setQueryData(['notifications'], old => 
        (old || []).map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (!token) return <Navigate to="/login" replace />;

  const hasPerm = (permId) => {
    if (user?.role !== 'Admin' || user?.stock?.id) return true;
    if (!user?.settings?.permissions) return true;
    return user.settings.permissions.includes(permId);
  };

  return (
    <div className="flex flex-col h-screen bg-white text-slate-800">
      {/* Top Navbar */}
      <header className="h-16 px-4 flex items-center justify-between border-b border-transparent">
        <div className="flex items-center gap-3 w-80 shrink-0">
          <img src={minisanteLogo} alt="MINISANTE" className="h-10 object-contain" />
          <span className="text-[22px] text-[#5f6368] font-medium tracking-tight">Rvf Vet Input hub</span>
        </div>

        <div className="flex-1 flex justify-center max-w-3xl px-4">
          <GlobalSearch />
        </div>

        <div className="flex items-center gap-4 w-64 justify-end shrink-0">

          {/* Reminders Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowReminderDropdown(!showReminderDropdown);
                setShowNotifDropdown(false);
                setShowDropdown(false);
              }}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative"
            >
              <Clock className="w-5 h-5" />
            </button>

            {showReminderDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">Reminders Settings</h3>
                </div>
                <div className="p-4 flex flex-col gap-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-semibold text-slate-700">Enable Reminders</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={remindersEnabled}
                        onChange={(e) => setRemindersEnabled(e.target.checked)}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${remindersEnabled ? 'bg-[#12aeec]' : 'bg-slate-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${remindersEnabled ? 'translate-x-4' : ''}`}></div>
                    </div>
                  </label>

                  <div className={`flex flex-col gap-2 transition-opacity ${!remindersEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                    <label className="text-sm font-semibold text-slate-700">Reminder Interval (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#12aeec] transition-colors"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                setShowReminderDropdown(false);
                setShowDropdown(false);
              }}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">Notifications</h3>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-slate-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => !notif.is_read && markAsRead(notif.id)}
                        className={`px-4 py-3 border-b border-slate-50 last:border-0 cursor-pointer transition-colors ${notif.is_read ? 'opacity-60' : 'bg-blue-50/50 hover:bg-blue-50'}`}
                      >
                        <div className="flex gap-3">
                          <div className={`mt-0.5 shrink-0 ${notif.is_read ? 'text-slate-400' : 'text-[#12aeec]'}`}>
                            <Bell className="w-4 h-4" />
                          </div>
                          <div>
                            <p className={`text-sm ${notif.is_read ? 'text-slate-600' : 'text-slate-900 font-medium'}`}>
                              {notif.message}
                            </p>
                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1 block">
                              {new Date(notif.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowDropdown(!showDropdown);
                setShowNotifDropdown(false);
                setShowReminderDropdown(false);
              }}
              className="w-8 h-8 rounded-full bg-[#9ca3af] text-white flex items-center justify-center font-bold text-sm hover:ring-2 hover:ring-slate-200 transition-all focus:outline-none"
            >
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-50">
                <div className="px-4 py-2 border-b border-slate-100 mb-1">
                  <p className="text-sm font-medium text-slate-800">{user?.username}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-[280px] shrink-0 overflow-y-auto flex flex-col">
          {/* Top horizontal tabs for sidebar */}
          <div className="flex items-center gap-6 px-6 py-2 border-b border-slate-100">
            {hasPerm('dashboard') && <NavLink to="/" end className={({ isActive }) => `text-sm pb-3 font-medium ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>Dashboard</NavLink>}
            <NavLink to="/inventory" className={({ isActive }) => `text-sm pb-3 font-medium ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>Inventory</NavLink>
            <NavLink to="/requests" className={({ isActive }) => `text-sm pb-3 font-medium ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>Requests</NavLink>
          </div>

          <div className="py-4">
            <div className="px-6 mb-2">
              <h3 className="text-sm font-medium text-slate-900 mb-2">Management</h3>
              <nav className="space-y-0.5 flex flex-col">
                {(user?.is_central || user?.stock?.is_central || user?.role === 'Admin' || (user?.stock?.district && !user?.stock?.sector && !user?.stock?.is_endpoint)) && hasPerm('stock_overview') && (
                  <NavLink to="/stocks" className={({ isActive }) => `flex items-center px-4 py-2 text-sm rounded-full transition-colors ${isActive ? 'bg-blue-100/50 text-blue-700 font-medium' : 'text-slate-800 font-medium hover:bg-slate-100'}`}>Stock Overview</NavLink>
                )}
                {hasPerm('inventory') && (
                  <NavLink to="/inventory" className={({ isActive }) => `flex items-center px-4 py-2 text-sm rounded-full transition-colors ${isActive ? 'bg-blue-100/50 text-blue-700 font-medium' : 'text-slate-800 font-medium hover:bg-slate-100'}`}>Current Inventory</NavLink>
                )}
                {(user?.is_central || user?.stock?.is_central || user?.role === 'Admin') && (
                  <>
                    {hasPerm('vaccines') && <NavLink to="/vaccines" className={({ isActive }) => `flex items-center px-4 py-2 text-sm rounded-full transition-colors ${isActive ? 'bg-blue-100/50 text-blue-700 font-medium' : 'text-slate-800 font-medium hover:bg-slate-100'}`}>Vaccine Types</NavLink>}
                    {hasPerm('suppliers') && <NavLink to="/suppliers" className={({ isActive }) => `flex items-center px-4 py-2 text-sm rounded-full transition-colors ${isActive ? 'bg-blue-100/50 text-blue-700 font-medium' : 'text-slate-800 font-medium hover:bg-slate-100'}`}>Suppliers</NavLink>}
                  </>
                )}
                {(user?.role === 'Admin' || user?.stock?.is_endpoint || (user?.stock?.district && !user?.stock?.sector && !user?.stock?.is_endpoint)) && hasPerm('veterinaries') && (
                  <NavLink to="/veterinaries" className={({ isActive }) => `flex items-center px-4 py-2 text-sm rounded-full transition-colors ${isActive ? 'bg-blue-100/50 text-blue-700 font-medium' : 'text-slate-800 font-medium hover:bg-slate-100'}`}>Veterinaries</NavLink>
                )}
                {(user?.role === 'Admin') && hasPerm('lab_technicians') && (
                  <NavLink to="/lab-technicians" className={({ isActive }) => `flex items-center px-4 py-2 text-sm rounded-full transition-colors ${isActive ? 'bg-blue-100/50 text-blue-700 font-medium' : 'text-slate-800 font-medium hover:bg-slate-100'}`}>Lab Technicians</NavLink>
                )}
              </nav>
            </div>

            <div className="mx-6 my-3 border-t border-slate-200"></div>

            <div className="px-6 mb-2">
              <h3 className="text-sm font-medium text-slate-900 mb-2">Operations</h3>
              <nav className="space-y-0.5 flex flex-col">
                {!(user?.is_central || user?.stock?.is_central) && hasPerm('new_request') && (
                  <NavLink to="/requests/new" className={({ isActive }) => `flex items-center px-4 py-2 text-sm rounded-full transition-colors ${isActive ? 'bg-blue-100/50 text-blue-700 font-medium' : 'text-slate-800 font-medium hover:bg-slate-100'}`}>New Request</NavLink>
                )}
                {user?.stock?.is_endpoint && hasPerm('administer') && (
                  <NavLink to="/administrations" className={({ isActive }) => `flex items-center px-4 py-2 text-sm rounded-full transition-colors ${isActive ? 'bg-blue-100/50 text-blue-700 font-medium' : 'text-slate-800 font-medium hover:bg-slate-100'}`}>Administer Vaccines</NavLink>
                )}
                {hasPerm('transfers') && (
                  <NavLink to="/transfers" className={({ isActive }) => `flex items-center px-4 py-2 text-sm rounded-full transition-colors ${isActive ? 'bg-blue-100/50 text-blue-700 font-medium' : 'text-slate-800 font-medium hover:bg-slate-100'}`}>Transfers</NavLink>
                )}
                {(user?.is_central || user?.stock?.is_central || user?.role === 'Admin' || (user?.stock?.district && !user?.stock?.is_endpoint)) && hasPerm('reports') && (
                  <NavLink to="/reports" className={({ isActive }) => `flex items-center px-4 py-2 text-sm rounded-full transition-colors ${isActive ? 'bg-blue-100/50 text-blue-700 font-medium' : 'text-slate-800 font-medium hover:bg-slate-100'}`}>
                    {(user?.role === 'Admin' || user?.is_central || user?.stock?.is_central) ? 'Reports' : 'Usage Reports'}
                  </NavLink>
                )}
              </nav>
            </div>

            {(user?.is_central || user?.stock?.is_central || user?.role === 'Admin') && (
              <>
                <div className="mx-6 my-3 border-t border-slate-200"></div>
                <div className="px-6 mb-2">
                  <h3 className="text-sm font-medium text-slate-900 mb-2">Admin</h3>
                  <nav className="space-y-0.5 flex flex-col">
                    {hasPerm('users') && <NavLink to="/users" className={({ isActive }) => `flex items-center px-4 py-2 text-sm rounded-full transition-colors ${isActive ? 'bg-blue-100/50 text-blue-700 font-medium' : 'text-slate-800 font-medium hover:bg-slate-100'}`}>Users & Roles</NavLink>}
                    {hasPerm('settings') && <NavLink to="/settings" className={({ isActive }) => `flex items-center px-4 py-2 text-sm rounded-full transition-colors ${isActive ? 'bg-blue-100/50 text-blue-700 font-medium' : 'text-slate-800 font-medium hover:bg-slate-100'}`}>Settings</NavLink>}
                  </nav>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-white p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
