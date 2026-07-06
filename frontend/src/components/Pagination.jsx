import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  startIndex, 
  endIndex, 
  onPageChange 
}) => {
  if (totalItems <= 0) return null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    // Just show a few surrounding pages to keep it clean like the design
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between py-4 px-6 border-t border-slate-100 bg-white rounded-b-2xl">
      <div className="text-[13px] font-medium text-slate-500">
        Showing {startIndex}–{endIndex} of {totalItems}
      </div>
      
      <div className="flex items-center space-x-1">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          &laquo;
        </button>
        
        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          &lsaquo;
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-bold transition-all ${
              currentPage === page 
                ? 'bg-[#148bb6] text-white shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          &rsaquo;
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          &raquo;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
