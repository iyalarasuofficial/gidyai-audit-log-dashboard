import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  total,
  limit,
  onPageChange,
}) => {
  const startRecord = (currentPage - 1) * limit + 1;
  const endRecord = Math.min(currentPage * limit, total);

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handlePageInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const page = parseInt((e.target as HTMLInputElement).value);
      if (page > 0 && page <= totalPages) {
        onPageChange(page);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6 flex flex-wrap justify-between items-center gap-4">
      <div className="text-sm text-gray-600">
        Showing <span className="font-semibold text-gray-900">{startRecord}</span> to{' '}
        <span className="font-semibold text-gray-900">{endRecord}</span> of{' '}
        <span className="font-semibold text-gray-900">{total}</span> results
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        <div className="flex items-center gap-2 text-sm">
          Page{' '}
          <input
            type="number"
            value={currentPage}
            onKeyDown={handlePageInput}
            min={1}
            max={totalPages}
            className="w-12 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-green-500"
          />{' '}
          of {totalPages}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );
};
