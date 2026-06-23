import React, { useState } from 'react';
import { uploadLogs } from '../api/logsApi';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [jsonText, setJsonText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    uploaded?: number;
    failed?: number;
  }>({ type: null, message: '' });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonText(content);
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!jsonText.trim()) {
      setUploadStatus({
        type: 'error',
        message: 'Please paste JSON or select a file',
      });
      return;
    }

    try {
      setIsLoading(true);
      const logs = JSON.parse(jsonText);

      if (!Array.isArray(logs)) {
        setUploadStatus({
          type: 'error',
          message: 'Expected JSON array of logs',
        });
        return;
      }

      const result = await uploadLogs(logs);

      setUploadStatus({
        type: 'success',
        message: result.message,
        uploaded: result.uploaded,
        failed: result.failed,
      });

      setTimeout(() => {
        setJsonText('');
        setUploadStatus({ type: null, message: '' });
        onSuccess();
        onClose();
      }, 2000);
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to parse JSON or upload logs',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-96 max-w-full max-h-screen overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Upload Audit Logs</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-light"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select JSON file or paste JSON array:
            </label>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder='[{"actor":"user@company.com","role":"admin","action":"DELETE_USER",...}]'
              className="w-full h-48 p-3 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-md text-center">
            <input
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              disabled={isLoading}
              className="cursor-pointer w-full"
            />
          </div>

          {uploadStatus.type && (
            <div className={`mb-4 p-4 rounded-md ${
              uploadStatus.type === 'success'
                ? 'bg-green-50 border-l-4 border-green-500 text-green-700'
                : 'bg-red-50 border-l-4 border-red-500 text-red-700'
            }`}>
              <p className="font-medium">{uploadStatus.message}</p>
              {uploadStatus.uploaded !== undefined && (
                <p className="text-sm mt-2">
                  ✓ {uploadStatus.uploaded} uploaded | ✕ {uploadStatus.failed} failed
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="btn-secondary disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={isLoading || !jsonText.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
