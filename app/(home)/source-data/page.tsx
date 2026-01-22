'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResultDisplay from '@/components/ResultDisplay';
import dynamic from 'next/dynamic';

const LottieAnimation = dynamic(() => import('@/components/LottieAnimation'), {
  ssr: false,
});

// API 返回的数据类型
interface SourceDataItem {
  table_name: string;
  field_name: string;
  field_desc: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
  sensitivity_level: string;
}

// 转换后的展示数据类型
interface TransformedDataItem {
  dataSource: string;
  databaseName: string;
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

// API 响应类型
interface ApiResponse {
  data: SourceDataItem[];
  source: 'mock' | 'api';
}

export default function SourceDataPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    type: 'table' | 'markdown';
    data: TransformedDataItem[];
  } | null>(null);

  // 数据转换函数：将 API 返回的数据转换为展示所需格式
  const transformApiData = (
    apiData: SourceDataItem[],
  ): TransformedDataItem[] => {
    return apiData.map((item) => ({
      dataSource: 'hive',
      databaseName: 'ds_etl_prod',
      tableName: item.table_name,
      field: item.field_name,
      fieldDescription: item.field_desc,
      firstLevelCategory: item.level1,
      secondLevelCategory: item.level2,
      thirdLevelCategory: item.level3,
      fourthLevelCategory: item.level4,
      sensitivityClassification: item.sensitivity_level,
      classificationReason: '源数据查询',
      taggingMethod: '系统分类',
    }));
  };

  // 从 API 获取源数据
  const fetchSourceData = async () => {
    setLoading(true);
    setError(null);

    try {
      // 调用 Next.js API Route
      const response = await fetch('/api/source-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '获取数据失败');
      }

      const apiResponse: ApiResponse = await response.json();
      const transformedData = transformApiData(apiResponse.data);

      setResults({ type: 'table', data: transformedData });
    } catch (err) {
      console.error('获取源数据失败:', err);
      setError(err instanceof Error ? err.message : '加载数据失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 刷新数据
  const handleRefresh = () => {
    fetchSourceData();
  };

  // 清除结果
  const handleClearResults = () => {
    setResults(null);
    setError(null);
  };

  // 组件挂载时自动加载数据
  useEffect(() => {
    fetchSourceData();
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* 页面标题 */}
      <div className="px-6 py-2 border-b flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800/90">元数据管理</h1>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto m-2">
        <div className="container h-full mx-auto flex flex-col items-center">
          {/* 加载状态 */}
          {loading && !results && (
            <div className="w-full max-w-6xl h-full flex items-center justify-center py-12">
              <div className="relative flex flex-col justify-center items-center">
                <LottieAnimation width={120} height={120} />
              </div>
            </div>
          )}

          {/* 错误状态 */}
          {error && !loading && (
            <div className="w-full max-w-6xl">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                  <div>
                    <h3 className="text-red-800 font-medium">加载失败</h3>
                    <p className="text-red-600 mt-1">{error}</p>
                  </div>
                </div>
                <Button
                  onClick={handleRefresh}
                  className="mt-4"
                  variant="outline"
                  size="default"
                >
                  重试
                </Button>
              </div>
            </div>
          )}

          {/* 结果展示区域 */}
          {results && (
            <div className="mb-6 w-full h-full max-w-6xl">
              <ResultDisplay
                results={results}
                onClearResult={handleClearResults}
                onRefresh={handleRefresh}
                isLoading={loading}
              />
            </div>
          )}

          {/* 空状态（没有结果且不在加载中） */}
          {!results && !loading && !error && (
            <div className="w-full max-w-6xl flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 mx-auto mb-4 rounded-full b hover:opacity-90 hover:bg-[rgba(0,0,0,0.04)]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
