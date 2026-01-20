'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react'; // Add Download icon
import ExcelViewer from './ExcelViewer';
import { Markdown } from './Markdown';
import DataTable from './DataTable';

interface ClassificationResult {
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

interface DataResults {
  type: 'table' | 'markdown';
  data: ClassificationResult[] | string;
}

interface ResultDisplayProps {
  results: DataResults;
  onClearResult: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function ResultDisplay({
  results,
  onClearResult,
  onRefresh,
  isLoading = false,
}: ResultDisplayProps) {
  const handleDownload = () => {
    if (results.type !== 'markdown') return;

    const content = results.data as string;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `数据治理分析报告_${
      new Date().toISOString().split('T')[0]
    }.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <div className="w-full h-full">
      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-auto h-full">
          {results.type === 'table' ? (
            <DataTable
              data={results.data as ClassificationResult[]}
              onRefresh={onRefresh}
              isLoading={isLoading}
            />
          ) : (
            <Markdown>{results.data as string}</Markdown>
          )}
        </div>
      </div>
    </div>
  );
}
