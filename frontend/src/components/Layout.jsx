import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Search, MoreVertical, Grid, LogOut } from 'lucide-react';
import { Outlet, Navigate, NavLink } from 'react-router-dom';

export default function Layout() {
  const { user, logout, token } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);

  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="flex flex-col h-screen bg-white text-slate-800">
      {/* Top Navbar */}
      <header className="h-16 px-4 flex items-center justify-between border-b border-transparent">
        <div className="flex items-center gap-3 w-64 shrink-0">
          <span className="font-bold text-xl tracking-tight text-slate-800">RVF VMS</span>
        </div>
        
        <div className="flex-1 flex justify-center max-w-3xl px-4">
          <div className="w-full flex items-center bg-slate-100/80 hover:bg-slate-100 rounded-full px-4 py-2.5 transition-colors">
            <Search className="w-5 h-5 text-slate-500 mr-3" />
            <input 
              type="text" 
              placeholder="Search vaccines, inventory, and requests" 
              className="bg-transparent border-none outline-none w-full text-sm placeholder:text-slate-500 text-slate-800"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 w-64 justify-end shrink-0">
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <Grid className="w-5 h-5" />
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
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
            <NavLink to="/" end className={({ isActive }) => `text-sm pb-3 font-medium ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>Dashboard</NavLink>
            <NavLink to="/inventory" className={({ isActive }) => `text-sm pb-3 font-medium ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>Inventory</NavLink>
            <NavLink to="/requests" className={({ isActive }) => `text-sm pb-3 font-medium ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>Requests</NavLink>
          </div>
          
          <div className="py-4">
            <div className="px-6 mb-2">
              <h3 className="text-sm font-medium text-slate-900 mb-2">Management</h3>
              <nav className="space-y-0.5 flex flex-col">
                {(user?.is_central || user?.stock?.is_central || user?.role === 'Admin') && (
                  <>
                    <NavLink to="/stocks" className={({ isActive }) => `flex items-center px-4 py-2 text-sm rounded-full transition-colors ${isActive ? 'bg-blue-100/50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-100'}`}>Stock Overview</NavLink>
                    <NavLink to="/vaccines" className={({ isActive }) => `flex items-center px-4 py-2 text-sm rounded-full transition-colors ${isActive ? 'bg-blue-100/50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-100'}`}>Vaccine Types</NavLink>
                  </>
                )}
                <NavLink to="/inventory" className={({ isActive }) => `flex items-center px-4 py-2 text-sm rounded-full transition-colors ${isActive ? 'bg-blue-100/50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-100'}`}>Current Inventory</NavLink>
                {(user?.is_central || user?.stock?.is_central || user?.role === 'Admin') && (
                  <NavLink to="/suppliers" className={({ isActive }) => `flex items-center px-4 py-2 text-sm rounded-full transition-colors ${isActive ? 'bg-blue-100/50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-100'}`}>Suppliers</NavLink>
                )}
              </nav>
            </div>

            <div className="mx-6 my-3 border-t border-slate-200"></div>

            <div className="px-6 mb-2">
              <h3 className="text-sm font-medium text-slate-900 mb-2">Operations</h3>
              <nav className="space-y-0.5 flex flex-col">
                {!(user?.is_central || user?.stock?.is_central) && (
                  <NavLink to="/requests/new" className={({ isActive }) => `flex items-center px-4 py-2 text-sm rounded-full transition-colors ${isActive ? 'bg-blue-100/50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-100'}`}>New Request</NavLink>
                )}
                <NavLink to="/transfers" className={({ isActive }) => `flex items-center px-4 py-2 text-sm rounded-full transition-colors ${isActive ? 'bg-blue-100/50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-100'}`}>Transfers</NavLink>
                <NavLink to="/reports" className={({ isActive }) => `flex items-center px-4 py-2 text-sm rounded-full transition-colors ${isActive ? 'bg-blue-100/50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-100'}`}>Reports</NavLink>
              </nav>
            </div>
            
            {(user?.is_central || user?.stock?.is_central || user?.role === 'Admin') && (
              <>
                <div className="mx-6 my-3 border-t border-slate-200"></div>
                <div className="px-6 mb-2">
                  <h3 className="text-sm font-medium text-slate-900 mb-2">Admin</h3>
                  <nav className="space-y-0.5 flex flex-col">
                    <NavLink to="/users" className={({ isActive }) => `flex items-center px-4 py-2 text-sm rounded-full transition-colors ${isActive ? 'bg-blue-100/50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-100'}`}>Users & Roles</NavLink>
                    <NavLink to="/settings" className={({ isActive }) => `flex items-center px-4 py-2 text-sm rounded-full transition-colors ${isActive ? 'bg-blue-100/50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-100'}`}>Settings</NavLink>
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
