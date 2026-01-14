'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react'; // Add Download icon
import ExcelViewer from './ExcelViewer';
import { Markdown } from './Markdown';

interface ClassificationResult {
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
}

export default function ResultDisplay({
  results,
  onClearResult,
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
    <Card className="w-full h-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">
          {results.type === 'table' ? '数据分类结果' : '分析结果'}
        </CardTitle>
        <div className="flex gap-2">
          {results.type === 'markdown' && (
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              下载Markdown
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onClearResult}>
            清除结果
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col px-5">
          <div className="flex-grow overflow-auto">
            {results.type === 'table' ? (
              <ExcelViewer data={results.data as ClassificationResult[]} />
            ) : (
              <Markdown>{results.data as string}</Markdown>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
