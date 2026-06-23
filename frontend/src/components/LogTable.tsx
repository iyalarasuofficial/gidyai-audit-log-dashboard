import React from 'react';
import { AuditLog } from '../api/logsApi';

interface LogTableProps {
  logs: AuditLog[];
  isLoading: boolean;
  onSort: (field: string) => void;
  currentSort: string;
  currentOrder: 'asc' | 'desc';
}

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case 'CRITICAL':
      return 'badge-critical';
    case 'HIGH':
      return 'badge-high';
    case 'MEDIUM':
      return 'badge-medium';
    case 'LOW':
      return 'badge-low';
    default:
      return 'badge-low';
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Resolved':
      return 'badge-resolved';
    case 'Unresolved':
      return 'badge-unresolved';
    case 'Investigating':
      return 'badge-investigating';
    default:
      return 'badge-unresolved';
  }
};

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const SortableHeader: React.FC<{
  label: string;
  field: string;
  currentSort: string;
  currentOrder: 'asc' | 'desc';
  onClick: () => void;
}> = ({ label, field, currentSort, currentOrder, onClick }) => (
  <th 
    onClick={onClick} 
    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
  >
    <div className="flex items-center gap-2">
      {label}
      {currentSort === field && (
        <span className="text-green-600">{currentOrder === 'asc' ? '▲' : '▼'}</span>
      )}
    </div>
  </th>
);

export const LogTable: React.FC<LogTableProps> = ({
  logs,
  isLoading,
  onSort,
  currentSort,
  currentOrder,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-500">Loading logs...</div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-500">No logs found. Try adjusting your filters.</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <SortableHeader
              label="Actor"
              field="actor"
              currentSort={currentSort}
              currentOrder={currentOrder}
              onClick={() => onSort('actor')}
            />
            <SortableHeader
              label="Action"
              field="action"
              currentSort={currentSort}
              currentOrder={currentOrder}
              onClick={() => onSort('action')}
            />
            <SortableHeader
              label="Severity"
              field="severity"
              currentSort={currentSort}
              currentOrder={currentOrder}
              onClick={() => onSort('severity')}
            />
            <SortableHeader
              label="Status"
              field="status"
              currentSort={currentSort}
              currentOrder={currentOrder}
              onClick={() => onSort('status')}
            />
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Resource</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">IP Address</th>
            <SortableHeader
              label="Timestamp"
              field="timestamp"
              currentSort={currentSort}
              currentOrder={currentOrder}
              onClick={() => onSort('timestamp')}
            />
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-700">{log.actor}</td>
              <td className="px-4 py-3 text-sm font-semibold text-blue-600">{log.action}</td>
              <td className="px-4 py-3 text-sm">
                <span className={getSeverityBadge(log.severity)}>
                  {log.severity}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                <span className={getStatusBadge(log.status)}>
                  {log.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate" title={log.resource}>
                {log.resource}
              </td>
              <td className="px-4 py-3 text-sm font-mono text-gray-600">{log.ipAddress}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{formatDate(log.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
