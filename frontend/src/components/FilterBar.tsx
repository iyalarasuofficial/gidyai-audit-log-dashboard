import React from 'react';

export interface Filters {
  severity?: string;
  status?: string;
  action?: string;
  resourceType?: string;
  actor?: string;
  resource?: string;
  ipAddress?: string;
}

interface FilterBarProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  onSearch: (search: string) => void;
  searchValue: string;
}

const SEVERITY_OPTIONS = ['', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const STATUS_OPTIONS = ['', 'Resolved', 'Unresolved', 'Investigating'];
const ACTION_OPTIONS = [
  '',
  'DELETE_USER',
  'CREATE_USER',
  'UPDATE_USER',
  'LOGIN',
  'LOGOUT',
  'ACCESS_RESOURCE',
  'MODIFY_RESOURCE',
  'DELETE_RESOURCE',
  'CREATE_POLICY',
  'DELETE_POLICY',
];
const RESOURCE_TYPE_OPTIONS = ['', 'USER', 'POLICY', 'ROLE', 'RESOURCE', 'API', 'CONFIG'];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  searchValue,
  onSearch,
}) => {
  const handleFilterChange = (field: keyof Filters, value: string) => {
    const newFilters = { ...filters, [field]: value || undefined };
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    onFilterChange({});
    onSearch('');
  };

  const hasActiveFilters =
    Object.values(filters).some((v) => v) || searchValue.trim() !== '';

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
            Severity
          </label>
          <select
            id="severity"
            value={filters.severity || ''}
            onChange={(e) => handleFilterChange('severity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All</option>
            {SEVERITY_OPTIONS.filter((v) => v).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All</option>
            {STATUS_OPTIONS.filter((v) => v).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="action" className="block text-sm font-medium text-gray-700 mb-1">
            Action
          </label>
          <select
            id="action"
            value={filters.action || ''}
            onChange={(e) => handleFilterChange('action', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All</option>
            {ACTION_OPTIONS.filter((v) => v).map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="resourceType" className="block text-sm font-medium text-gray-700 mb-1">
            Resource Type
          </label>
          <select
            id="resourceType"
            value={filters.resourceType || ''}
            onChange={(e) => handleFilterChange('resourceType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All</option>
            {RESOURCE_TYPE_OPTIONS.filter((v) => v).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by actor, resource, or IP..."
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};
