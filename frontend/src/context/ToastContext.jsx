import React, { createContext, useState, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'error') => {
    const id = Date.now();
    setToasts((prev) => [{ id, message, type }, ...prev].slice(0, 3)); // Keep max 3 for stacked effect

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none">
          <div className="relative w-[400px] flex justify-center">
            {toasts.map((toast, index) => {
              // Calculate stacked offset styles
              const translateY = index * -8; // 8px UP per index because they stack under the top one
              const scale = 1 - index * 0.05; // Slightly shrink background cards
              const opacity = 1 - index * 0.2; // Fade background cards
              
              return (
                <div
                  key={toast.id}
                  className="absolute top-0 w-full rounded-[6px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex p-4 transition-all duration-300 pointer-events-auto"
                  style={{
                    backgroundColor: '#12aeec', // Matching the theme color
                    transform: `translateY(${translateY}px) scale(${scale})`,
                    zIndex: 50 - index,
                    opacity: opacity,
                  }}
                >
                  <div className="mr-3 flex-shrink-0 mt-0.5">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="white"/>
                    </svg>
                  </div>
                  <div className="text-white text-[14px] font-bold leading-[1.5]">
                    {toast.message}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};
