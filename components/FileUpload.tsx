'use client';

import { useRef, useState, useCallback } from 'react';
import { Paperclip, Upload } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File | null) => void;
  isFullArea?: boolean;
}

export default function FileUpload({
  onFileUpload,
  isFullArea = false,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileUpload(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const allowedExtensions = ['csv', 'xlsx', 'xls'];

        if (allowedExtensions.includes(fileExtension || '')) {
          onFileUpload(file);
        }
      }
    },
    [onFileUpload]
  );

  // 如果是完整区域模式，返回完整的上传区域
  if (isFullArea) {
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onClick={handleUploadClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              上传文件进行数据分类
            </h3>
            <p className="text-sm text-gray-600">
              支持 CSV、Excel 等格式的数据文件，系统将自动进行智能分类
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Upload className="w-4 h-4 mr-2" />
            选择文件
          </button>
        </div>
      </>
    );
  }

  // 默认模式，返回小按钮
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleUploadClick}
        className=" cursor-pointer size-9 rounded-full flex justify-center items-center duration-200 hover:opacity-90 hover:bg-[rgba(0,0,0,0.04)] disabled:cursor-not-allowed"
      >
        <Paperclip className="w-4 h-4" />
      </button>
    </>
  );
}
