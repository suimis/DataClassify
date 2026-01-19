'use client';

import { FileText, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/FileUpload';
import FileProcessor from '@/components/FileProcessor';
import ResultDisplay from '@/components/ResultDisplay';

interface ProcessedDataItem {
  tableName?: string;
  field?: string;
  column?: string;
  fieldDescription?: string;
  meaning?: string;
}

interface ClassifiedDataItem {
  tableName: string;
  field: string;
  fieldDescription: string;
  firstLevelCategory: string;
  secondLevelCategory: string;
  thirdLevelCategory: string;
  fourthLevelCategory: string;
  sensitivityClassification: string;
  classificationReason: string;
  taggingMethod: string;
}

export default function ClassificationPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showFileProcessor, setShowFileProcessor] = useState(false);
  const [processedData, setProcessedData] = useState<
    ProcessedDataItem[] | null
  >(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<{
    type: string;
    data: ClassifiedDataItem[];
  } | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const bottomMarkerRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (file: File | null) => {
    if (file) {
      setUploadedFile(file);
      setShowFileProcessor(true);
      // 清除之前的结果
      setShowResults(false);
      setResults(null);
      setProcessedData(null);
    }
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    setShowFileProcessor(false);
    setShowResults(false);
    setResults(null);
    setProcessedData(null);
  };

  const handleFileProcessComplete = (data: ProcessedDataItem[]) => {
    console.log('FileProcessor completed. Received data:', data);
    setProcessedData(data);
    setShowFileProcessor(false);

    // 模拟AI分类处理 - 生成新的数据结构
    const classifiedData: ClassifiedDataItem[] = data.map((item) => ({
      tableName: item.tableName || '未知表',
      field: item.field || item.column || '未知字段',
      fieldDescription:
        item.fieldDescription || item.meaning || '字段描述待补充',
      firstLevelCategory: ['基础信息', '业务数据', '系统信息', '日志数据'][
        Math.floor(Math.random() * 4)
      ],
      secondLevelCategory: ['用户数据', '订单数据', '产品数据', '交易数据'][
        Math.floor(Math.random() * 4)
      ],
      thirdLevelCategory: ['身份信息', '联系方式', '地址信息', '账户信息'][
        Math.floor(Math.random() * 4)
      ],
      fourthLevelCategory: ['个人标识', '敏感信息', '一般信息', '公开信息'][
        Math.floor(Math.random() * 4)
      ],
      sensitivityClassification: ['高敏感', '中等敏感', '低敏感', '公开'][
        Math.floor(Math.random() * 4)
      ],
      classificationReason: '基于字段名称和业务上下文的AI自动分类',
      taggingMethod: 'AI自动分类',
    }));

    console.log('Classified data:', classifiedData);
    setResults({ type: 'table', data: classifiedData });
    setShowResults(true);
  };

  const handleClearResults = () => {
    setShowResults(false);
    setResults(null);
    setProcessedData(null);
    setUploadedFile(null);
    setShowFileProcessor(false);
  };

  // 回到底部
  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  // 设置Intersection Observer来检测是否到达底部
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 当底部标记不可见时显示按钮，可见时隐藏按钮
        setShowScrollToBottom(!entry.isIntersecting);
      },
      {
        threshold: 0.1, // 当10%的元素可见时触发
        root: contentRef.current, // 相对于内容区域观察
      },
    );

    if (bottomMarkerRef.current) {
      observer.observe(bottomMarkerRef.current);
    }

    return () => {
      if (bottomMarkerRef.current) {
        observer.unobserve(bottomMarkerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* 页面标题 */}
      <div className="px-6 py-2 border-b flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800/90">数据分类分级</h1>
        </div>
      </div>

      {/* 可滚动内容区域 */}
      <div
        ref={contentRef}
        className={`${
          !showResults && !showFileProcessor
            ? 'flex-1'
            : 'flex-1 overflow-y-auto'
        }`}
      >
        <div className="container mx-auto py-6 flex flex-col items-center">
          {/* 文件上传区域 - 只在没有结果时显示 */}
          {!showResults && !showFileProcessor && (
            <div className="w-full max-w-2xl">
              <FileUpload onFileUpload={handleFileUpload} isFullArea={true} />
            </div>
          )}

          {/* 文件处理器 */}
          {showFileProcessor && uploadedFile && (
            <div className="mb-6 w-full max-w-6xl">
              <FileProcessor
                file={uploadedFile}
                onProcessComplete={handleFileProcessComplete}
                onClearFile={handleClearFile}
              />
            </div>
          )}

          {/* 结果展示区域 */}
          {showResults && results && (
            <div className="mb-6 w-full max-w-6xl z-100">
              <ResultDisplay
                results={results}
                onClearResult={handleClearResults}
              />
            </div>
          )}

          {/* 底部标记元素 - 用于Intersection Observer检测 */}
          <div ref={bottomMarkerRef} className="h-1 w-full" />
        </div>
      </div>
    </div>
  );
}
