import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { uploadPdfFile } from '../services/api';

interface FileUploadInputProps {
  label: string;
  value?: string;
  onChange: (filePath: string) => void;
  required?: boolean;
  maxSizeMb?: number;
  helperText?: string;
}

export const FileUploadInput: React.FC<FileUploadInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  maxSizeMb = 5,
  helperText,
}) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate PDF type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Invalid format. Only PDF files (.pdf) are allowed.');
      return;
    }

    // Validate size
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`File size exceeds maximum limit of ${maxSizeMb} MB.`);
      return;
    }

    setError('');
    setUploading(true);

    try {
      const result = await uploadPdfFile(file);
      onChange(result.filePath);
    } catch (err: any) {
      setError(err.message || 'Failed to upload PDF file.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
        {label} {required && <span className="text-dmrc-red">*</span>}
      </label>

      {value ? (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3.5 py-2.5">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-emerald-800 hover:underline truncate"
            >
              {value.split('/').pop()}
            </a>
            <span className="bg-emerald-200/60 text-emerald-900 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">PDF Verified</span>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="text-slate-400 hover:text-red-600 p-1 rounded-md transition-colors"
            title="Remove attachment"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <label className={`flex items-center justify-between border border-dashed rounded-lg px-4 py-3 cursor-pointer transition-all ${
            uploading ? 'bg-slate-50 border-slate-300' : 'bg-white border-slate-300 hover:border-dmrc-red hover:bg-slate-50/50'
          }`}>
            <div className="flex items-center space-x-3">
              {uploading ? (
                <Loader2 className="w-5 h-5 text-dmrc-red animate-spin" />
              ) : (
                <UploadCloud className="w-5 h-5 text-slate-400" />
              )}
              <div>
                <span className="text-xs font-semibold text-slate-700">
                  {uploading ? 'Uploading PDF Document...' : 'Choose PDF Document'}
                </span>
                <p className="text-[11px] text-slate-400">PDF format only, max {maxSizeMb}MB</p>
              </div>
            </div>

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      )}

      {helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
