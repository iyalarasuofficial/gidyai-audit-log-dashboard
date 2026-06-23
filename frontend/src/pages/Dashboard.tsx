import React, { useState, useEffect } from 'react';
import { fetchLogs, AuditLog, FetchLogsResponse } from '../api/logsApi';
import { LogTable } from '../components/LogTable';
import { FilterBar, Filters } from '../components/FilterBar';
import { Pagination } from '../components/Pagination';
import { UploadModal } from '../components/UploadModal';

export const Dashboard: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<Filters>({});
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('timestamp');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const loadLogs = async (page = 1, newFilters = filters, newSearch = search) => {
    setIsLoading(true);
    setError('');
    try {
      const response: FetchLogsResponse = await fetchLogs(
        page,
        pagination.limit,
         newFilters as Record<string, unknown>,
        newSearch,
        sort,
        order
      );

      setLogs(response.logs);
      setPagination(response.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch logs. Is the backend running?'
      );
      console.error('Load logs error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setTimeout(() => loadLogs(1, newFilters, search), 0);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadLogs(1, filters, search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSort = (field: string) => {
    if (sort === field) {
      const newOrder = order === 'asc' ? 'desc' : 'asc';
      setOrder(newOrder);
      loadLogs(1, filters, search);
    } else {
      setSort(field);
      setOrder('desc');
      loadLogs(1, filters, search);
    }
  };

  const handlePageChange = (page: number) => {
    loadLogs(page);
  };

  const handleUploadSuccess = () => {
    loadLogs(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-2xl font-bold">Security Audit Logs</h1>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="btn-primary"
            >
              + Upload Logs
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
            {error}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          searchValue={search}
          onSearch={setSearch}
        />

        <LogTable
          logs={logs}
          isLoading={isLoading}
          onSort={handleSort}
          currentSort={sort}
          currentOrder={order}
        />

        {logs.length > 0 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={handlePageChange}
          />
        )}
      </main>

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
};
