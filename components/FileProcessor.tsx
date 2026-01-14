'use client';

import { useCallback, useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import LottieAnimation from './LottieAnimation';

interface ClassificationResult {
  field: string;
  meaning: string;
  classification?: string;
}

interface FileProcessorProps {
  file: File;
  onProcessComplete: (data: ClassificationResult[]) => void;
  onClearFile: () => void;
}

export default function FileProcessor({
  file,
  onProcessComplete,
  onClearFile,
}: FileProcessorProps) {
  const [fullData, setFullData] = useState<string[][]>([]);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [hasHeader, setHasHeader] = useState(true);
  const [fieldColumn, setFieldColumn] = useState<string>('');
  const [meaningColumn, setMeaningColumn] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = useCallback(async (file: File) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
    }) as string[][];
    setFullData(jsonData);
    setPreviewData(jsonData.slice(0, 10)); // 只显示前10行预览
  }, []);

  useEffect(() => {
    if (file) {
      setFieldColumn('');
      setMeaningColumn('');
      processFile(file);
    }
  }, [file, processFile]);

  // 当hasHeader状态变化时，重置列选择
  useEffect(() => {
    setFieldColumn('');
    setMeaningColumn('');
  }, [hasHeader]);

  const columnOptions =
    hasHeader && fullData.length > 0
      ? fullData[0]
      : fullData.length > 0
      ? fullData[0].map((_, index) => `列${index + 1}`)
      : [];

  const handleProcess = () => {
    if (!fieldColumn || !meaningColumn) return;

    setIsProcessing(true);

    // 模拟处理延迟
    setTimeout(() => {
      const fieldIndex = parseInt(fieldColumn);
      const meaningIndex = parseInt(meaningColumn);
      const startRow = hasHeader ? 1 : 0;

      const results: ClassificationResult[] = fullData
        .slice(startRow)
        .filter((row) => row[fieldIndex] && row[meaningIndex])
        .map((row) => ({
          field: row[fieldIndex] || '',
          meaning: row[meaningIndex] || '',
        }));

      setIsProcessing(false);
      onProcessComplete(results);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto px-4">
      <CardHeader>
        <CardTitle>文件处理配置</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 表头选择 */}
        <div className="flex items-center space-x-2 px-5">
          <Checkbox
            id="hasHeader"
            checked={hasHeader}
            onCheckedChange={(checked) => setHasHeader(checked as boolean)}
          />
          <Label htmlFor="hasHeader">文件包含表头</Label>
        </div>

        {/* 列选择 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">字段列</label>
            <Select value={fieldColumn} onValueChange={setFieldColumn}>
              <SelectTrigger>
                <SelectValue placeholder="选择字段列" />
              </SelectTrigger>
              <SelectContent>
                {columnOptions.map((option, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              中文含义列
            </label>
            <Select value={meaningColumn} onValueChange={setMeaningColumn}>
              <SelectTrigger>
                <SelectValue placeholder="选择中文含义列" />
              </SelectTrigger>
              <SelectContent>
                {columnOptions.map((option, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 数据预览 */}
        {previewData.length > 0 && (
          <div className="space-y-2">
            <Label>数据预览</Label>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    {(hasHeader
                      ? previewData[0]
                      : previewData[0]?.map((_, index) => `列${index + 1}`)
                    ).map((col, index) => (
                      <TableHead key={index}>{col}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData
                    .slice(hasHeader ? 1 : 0, hasHeader ? 6 : 5)
                    .map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <TableCell
                            key={cellIndex}
                            className="max-w-32 truncate"
                          >
                            {cell}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* 处理状态 */}
        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-8">
            <LottieAnimation width={100} height={100} />
            <p className="text-gray-600 mt-4">正在处理文件...</p>
          </div>
        )}

        {/* 处理按钮 */}
        <div className="flex gap-2">
          <Button
            onClick={handleProcess}
            disabled={!fieldColumn || !meaningColumn || isProcessing}
            className="flex-1"
          >
            {isProcessing ? '处理中...' : '开始处理'}
          </Button>
          <Button onClick={onClearFile} variant="outline" className="flex-1">
            清除文件
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
