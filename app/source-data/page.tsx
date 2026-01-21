'use client';

import { useState, useEffect, Suspense } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResultDisplay from '@/components/ResultDisplay';
import dynamic from 'next/dynamic';

const LottieAnimation = dynamic(() => import('@/components/LottieAnimation'), {
  ssr: false,
});

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
      table_name: 'daily_summary',
      field_name: 'mchnt_cd',
      field_desc: '商户代码',
      level1: '业务数据',
      level2: '基础信息',
      level3: '单位基础信息',
      level4: '单位入网信息',
      sensitivity_level: 'C',
    },
    {
      table_name: 'daily_summary',
      field_name: 'mchnt_tp',
      field_desc: '商户类型',
      level1: '业务数据',
      level2: '衍生信息',
      level3: '商户衍生信息',
      level4: '商户标签',
      sensitivity_level: 'C',
    },
    {
      table_name: 'daily_summary',
      field_name: 'pri_acct_no_conv',
      field_desc: '加密卡号',
      level1: '业务数据',
      level2: '基础信息',
      level3: '个人基础信息',
      level4: '个人银行卡信息',
      sensitivity_level: 'C',
    },
    {
      table_name: 'daily_summary',
      field_name: 'acpt_ins_id_cd',
      field_desc: '受理机构标识码',
      level1: '业务数据',
      level2: '基础信息',
      level3: '单位基础信息',
      level4: '单位入网信息',
      sensitivity_level: 'C',
    },
    {
      table_name: 'daily_summary',
      field_name: 'acq_ins_id_cd',
      field_desc: '收单机构标识码',
      level1: '业务数据',
      level2: '基础信息',
      level3: '单位基础信息',
      level4: '单位入网信息',
      sensitivity_level: 'C',
    },
    {
      table_name: 'daily_summary',
      field_name: 'afternoon_amt_sum',
      field_desc: '汇总-下午交易金额(12-17点)',
      level1: '业务数据',
      level2: '衍生信息',
      level3: '个人衍生信息',
      level4: '个人金额笔数类',
      sensitivity_level: 'C',
    },
    {
      table_name: 'daily_summary',
      field_name: 'afternoon_cnt_sum',
      field_desc: '汇总-下午交易笔数(12-17点)',
      level1: '业务数据',
      level2: '衍生信息',
      level3: '个人衍生信息',
      level4: '个人金额笔数类',
      sensitivity_level: 'C',
    },
    {
      table_name: 'daily_summary',
      field_name: 'amt_max',
      field_desc: '清算交易金额最大值',
      level1: '业务数据',
      level2: '衍生信息',
      level3: '个人衍生信息',
      level4: '个人金额笔数类',
      sensitivity_level: 'C',
    },
    {
      table_name: 'daily_summary',
      field_name: 'amt_min',
      field_desc: '清算交易金额最小值',
      level1: '业务数据',
      level2: '衍生信息',
      level3: '个人衍生信息',
      level4: '个人金额笔数类',
      sensitivity_level: 'C',
    },
    {
      table_name: 'daily_summary',
      field_name: 'amt_sum',
      field_desc: '清算交易金额求和',
      level1: '业务数据',
      level2: '衍生信息',
      level3: '个人衍生信息',
      level4: '个人金额笔数类',
      sensitivity_level: 'C',
    },
  ];

  // 数据转换函数
  const transformApiData = (
    apiData: MockApiDataItem[],
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
