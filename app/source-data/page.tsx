'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResultDisplay from '@/components/ResultDisplay';
import LottieAnimation from '@/components/LottieAnimation';

interface MockApiDataItem {
  table_name: string;
  field_name: string;
  field_desc: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
  sensitivity_level: string;
}

interface TransformedDataItem {
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

export default function SourceDataPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    type: 'table' | 'markdown';
    data: TransformedDataItem[];
  } | null>(null);

  // 模拟API数据
  const mockApiData: MockApiDataItem[] = [
    {
      table_name: 'Pak Sze Yu',
      field_name: 'Pak Sze Yu',
      field_desc: 'mpYogWtciH',
      level1: 'ANTQ830Dnq',
      level2: 'avW0tiFNAp',
      level3: 'Dt0HubxCTa',
      level4: 'SnSEsLZQMD',
      sensitivity_level: 'COlpXJa4nY',
    },
    {
      table_name: 'Shimizu Yuito',
      field_name: 'Shimizu Yuito',
      field_desc: 'Sex34IQTTC',
      level1: '5OEXXJjjvY',
      level2: 'ibA6BZ7MXE',
      level3: 'oO8Zp4Ls8r',
      level4: 'SMwMvvpGcp',
      sensitivity_level: 'nmoT61aZaU',
    },
    {
      table_name: 'Cynthia Dixon',
      field_name: 'Cynthia Dixon',
      field_desc: 'DOWsF3zsZ0',
      level1: 'YnSMmcZ2CB',
      level2: 'KIWzc1RMG2',
      level3: '1MvFbIDUbB',
      level4: 'PZz6rQSAYZ',
      sensitivity_level: '2MDdJ5PfoF',
    },
    {
      table_name: 'Tao Ziyi',
      field_name: 'Tao Ziyi',
      field_desc: 'dH8gUKZXGU',
      level1: 'Mm2ktufILz',
      level2: 'VdI2r72ONj',
      level3: '1JlUkJXJ7k',
      level4: 'GmBbiVsdNT',
      sensitivity_level: 'FEswNsCaSV',
    },
    {
      table_name: 'Grace Russell',
      field_name: 'Grace Russell',
      field_desc: 'Lk0r4K2Fz1',
      level1: '7NJ3E74LG6',
      level2: 'KMUoRkpLCX',
      level3: 'nVaomTQhAb',
      level4: 'DAQuPv4K2h',
      sensitivity_level: 'CipxL9w4JA',
    },
    {
      table_name: 'Chiba Rin',
      field_name: 'Chiba Rin',
      field_desc: 'mMUDD0fPeN',
      level1: 'ZN1b8bFmx6',
      level2: 'OeTuUhXrTE',
      level3: 'VeXlVPe5Vs',
      level4: 'TXpBtJ2Qgf',
      sensitivity_level: 'MXlUraxdtS',
    },
    {
      table_name: 'Pan Anqi',
      field_name: 'Pan Anqi',
      field_desc: 'jQdknWEC1A',
      level1: 'lG74FUSP7Y',
      level2: 'coOSFJP712',
      level3: 'yaImyxuEpg',
      level4: 'TYNkiAXIXm',
      sensitivity_level: 'lFadMFZOgZ',
    },
    {
      table_name: 'Fung Ting Fung',
      field_name: 'Fung Ting Fung',
      field_desc: 'GPoh8sWCEr',
      level1: 'ANvpX2E5Ky',
      level2: 'o66QcykqAM',
      level3: 'E21m9ulSy5',
      level4: '0nTq1kK8Ji',
      sensitivity_level: 'il7ZIGpIaK',
    },
    {
      table_name: 'Beverly Richardson',
      field_name: 'Beverly Richardson',
      field_desc: 'IMvkfxI61o',
      level1: 'IWJb8FYsiY',
      level2: 's2Vr2Koxpm',
      level3: 'rKSjjsygKX',
      level4: 'OoUJRPazEl',
      sensitivity_level: '0LxtgjsLg8',
    },
    {
      table_name: 'Tan Jiehong',
      field_name: 'Tan Jiehong',
      field_desc: 'NisXPLb6NC',
      level1: 'JOAxjnlb7T',
      level2: '32h8MDlv3D',
      level3: 'Vrkezq2S5N',
      level4: '38Nr7OV9uk',
      sensitivity_level: 'DUYOXmMee5',
    },
  ];

  // 数据转换函数
  const transformApiData = (
    apiData: MockApiDataItem[]
  ): TransformedDataItem[] => {
    return apiData.map((item) => ({
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

  // 模拟API请求
  const fetchSourceData = () => {
    setLoading(true);
    setError(null);

    // 模拟网络请求延迟
    setTimeout(() => {
      try {
        const transformedData = transformApiData(mockApiData);
        setResults({ type: 'table', data: transformedData });
        setLoading(false);
      } catch {
        setError('加载数据失败，请重试');
        setLoading(false);
      }
    }, 1000);
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
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">源数据</h1>
          <p className="text-gray-600 mt-1">查看已分类的源数据信息</p>
        </div>
        {!loading && (
          <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
        )}
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-6 flex flex-col items-center">
          {/* 加载状态 */}
          {loading && !results && (
            <div className="w-full max-w-6xl flex items-center justify-center py-12">
              <div className="relative flex flex-col justify-center items-center">
                <LottieAnimation width={120} height={120} />
                <p className="text-gray-600 mt-4 absolute bottom-0">
                  正在加载数据...
                </p>
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
                >
                  重试
                </Button>
              </div>
            </div>
          )}

          {/* 结果展示区域 */}
          {results && !loading && (
            <div className="mb-6 w-full max-w-6xl">
              <ResultDisplay
                results={results}
                onClearResult={handleClearResults}
              />
            </div>
          )}

          {/* 空状态（没有结果且不在加载中） */}
          {!results && !loading && !error && (
            <div className="w-full max-w-6xl flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">点击刷新按钮加载源数据</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
