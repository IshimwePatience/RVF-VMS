import React from 'react';
import rabLogo from '../assets/images/RAB_Logo2.png';

export default function LoginSkeleton({ children }) {
  return (
    <div className="relative h-screen w-full bg-white overflow-hidden text-slate-800">
      {/* Background Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
        <img src={rabLogo} alt="RAB Logo" className="w-[600px] md:w-[800px] max-w-full h-auto object-contain" />
      </div>
      
      {/* Modal Overlay Content */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}
