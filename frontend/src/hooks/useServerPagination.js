import { useState } from 'react';

export const useServerPagination = (serverData = [], totalItems = 0, itemsPerPage = 12) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const currentData = serverData;

  const next = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const jump = (page) => setCurrentPage(Math.min(Math.max(1, page), totalPages));

  return {
    currentData,
    currentPage,
    totalPages,
    totalItems,
    startIndex: totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1,
    endIndex: Math.min(currentPage * itemsPerPage, totalItems),
    next,
    prev,
    jump
  };
};
