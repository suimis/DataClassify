'use client';

import DataTable from './DataTable';

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

interface ExcelViewerProps {
  data: ClassificationResult[];
}

export default function ExcelViewer({ data }: ExcelViewerProps) {
  return (
    <div className="w-full">
      <DataTable data={data} />
    </div>
  );
}
