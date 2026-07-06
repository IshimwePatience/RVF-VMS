import { useState, useMemo } from 'react';

export const usePagination = (data = [], itemsPerPage = 12) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  
  // Ensure current page is valid when data changes
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const currentData = useMemo(() => {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  }, [data, currentPage, itemsPerPage]);

  const next = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const jump = (page) => setCurrentPage(Math.min(Math.max(1, page), totalPages));

  return {
    currentData,
    currentPage,
    totalPages,
    totalItems: data.length,
    startIndex: data.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1,
    endIndex: Math.min(currentPage * itemsPerPage, data.length),
    next,
    prev,
    jump
  };
};
