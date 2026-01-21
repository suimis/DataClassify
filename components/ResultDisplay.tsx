'use client';

import { Markdown } from './Markdown';
import DataTable from './DataTable';
import { DisplayClassificationResult, DisplayDataResults } from '@/lib/types';

interface ResultDisplayProps {
  results: DisplayDataResults;
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
        <div className="grow overflow-auto h-full">
          {results.type === 'table' ? (
            <DataTable
              data={results.data as DisplayClassificationResult[]}
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
