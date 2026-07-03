import React from 'react';
import { Search, Shield, Grid, MoreVertical } from 'lucide-react';

export default function LoginSkeleton({ children }) {
  return (
    <div className="relative h-screen w-full bg-white overflow-hidden text-slate-800">
      {/* Background Skeleton layout matching Layout.jsx */}
      <div className="absolute inset-0 flex flex-col pointer-events-none opacity-50">
        <header className="h-16 px-4 flex items-center justify-between border-b border-transparent">
          <div className="flex items-center gap-3 w-64 shrink-0">
            <div className="h-6 w-24 bg-slate-200 rounded"></div>
          </div>
          <div className="flex-1 flex justify-center max-w-3xl px-4">
            <div className="w-full flex items-center bg-slate-100 rounded-full px-4 py-2.5 h-10"></div>
          </div>
          <div className="flex items-center gap-4 w-64 justify-end shrink-0">
            <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
            <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
            <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
          </div>
        </header>
        
        <div className="flex flex-1 overflow-hidden">
          <div className="w-[280px] shrink-0 flex flex-col">
            <div className="flex items-center gap-6 px-6 py-2 border-b border-slate-100">
              <div className="h-5 w-20 bg-slate-200 rounded pb-3"></div>
              <div className="h-5 w-20 bg-slate-300 rounded pb-3 border-b-2 border-slate-300"></div>
              <div className="h-5 w-20 bg-slate-200 rounded pb-3"></div>
            </div>
            <div className="py-4 px-6 space-y-4">
              <div className="h-4 w-24 bg-slate-200 rounded mb-4"></div>
              <div className="h-8 w-full bg-slate-100 rounded-full"></div>
              <div className="h-8 w-full bg-slate-100 rounded-full"></div>
              <div className="h-8 w-full bg-slate-200 rounded-full"></div>
            </div>
          </div>
          <main className="flex-1 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="h-8 w-48 bg-slate-200 rounded"></div>
              <div className="flex gap-4">
                <div className="h-9 w-32 bg-slate-200 rounded-full"></div>
                <div className="h-9 w-40 bg-slate-200 rounded-full"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 h-64 flex flex-col">
                  <div className="h-36 bg-slate-100 rounded-xl mb-4 w-full"></div>
                  <div className="h-5 w-3/4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
      
      {/* Modal Overlay Content */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}
