'use client';

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

interface ExcelViewerProps {
  data: ClassificationResult[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function ExcelViewer({
  data,
  onRefresh,
  isLoading = false,
}: ExcelViewerProps) {
  return (
    <div className="w-full">
      <DataTable data={data} onRefresh={onRefresh} isLoading={isLoading} />
    </div>
  );
}
