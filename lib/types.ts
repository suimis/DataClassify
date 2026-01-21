// 数据类型定义文件

// 分类分级标准接口
export interface ClassificationStandard {
  id: string;
  version: string;
  name: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  createdAt: Date;
  createdBy: string;
  isActive: boolean;
}

// 分类层级接口
export interface ClassificationHierarchy {
  id: string;
  standardId: string;
  level1: string;
  level1Definition: string;
  level2: string;
  level2Definition: string;
  level3: string;
  level3Definition: string;
  level4: string;
  level4Definition: string;
  dataExample: string;
  sensitivityLevel: string;
}

// 数据映射接口
export interface DataMapping {
  id: string;
  originalFieldName: string;
  originalFieldDescription: string;
  mappingId: number;
  taskId: string;
  createdAt: Date;
}

// AI打标结果接口
export interface AITaggingResult {
  id: string;
  taskId: string;
  mappingId: number;
  aiCategoryResult: string;
  aiLevelResult: string;
  confidence: number;
  judgmentBasis: string;
  parameters: {
    temperature: number;
    topP: number;
    maxTokens: number;
    model: string;
  };
  modelVersion: string;
  createdAt: Date;
}

// 人工校对接口
export interface HumanVerification {
  id: string;
  resultId: string;
  originalCategory: string;
  originalLevel: string;
  modifiedCategory: string;
  modifiedLevel: string;
  verificationStatus: 'pending' | 'confirmed' | 'rejected';
  verifier: string;
  verifiedAt: Date;
  comments: string;
}

// 任务接口
export interface ClassificationTask {
  id: string;
  name: string;
  description: string;
  standardId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalRecords: number;
  processedRecords: number;
  confidence: number;
  createdAt: Date;
  completedAt?: Date;
  createdBy: string;
}

// 文件处理结果接口
export interface FileProcessResult {
  tableName: string;
  field: string;
  fieldDescription: string;
  mappingId: number;
}

// 最终结果接口
export interface FinalResult {
  originalFieldName: string;
  originalFieldDescription: string;
  aiCategoryResult: string;
  aiLevelResult: string;
  confidence: number;
  judgmentBasis: string;
  verificationStatus?: 'pending' | 'confirmed' | 'rejected';
  modifiedCategory?: string;
  modifiedLevel?: string;
  verifier?: string;
  verifiedAt?: Date;
  comments?: string;
}

// AI配置接口
export interface AIConfig {
  provider: string;
  modelName: string;
  apiKey: string;
  baseUrl: string;
  maxTokens: number;
  temperature: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

// Prompt模板接口
export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 标准Excel解析结果接口
export interface StandardExcelRow {
  level1: string;
  level1Definition: string;
  level2: string;
  level2Definition: string;
  level3: string;
  level3Definition: string;
  level4: string;
  level4Definition: string;
  dataExample: string;
  sensitivityLevel: string;
}

// 上传文件接口
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

// API响应接口
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页接口
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 分页响应接口
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 搜索参数接口
export interface SearchParams {
  query: string;
  filters?: Record<string, any>;
  pagination?: PaginationParams;
}

// 导出格式类型
export type ExportFormat = 'excel' | 'csv' | 'json' | 'pdf';

// 导出配置接口
export interface ExportConfig {
  format: ExportFormat;
  includeHeaders: boolean;
  selectedColumns?: string[];
  fileName?: string;
}

// Page组件使用的ClassificationResult接口
export interface PageClassificationResult {
  field: string;
  meaning: string;
  classification?: string;
}

// Page组件使用的DataResults接口
export interface PageDataResults {
  type: 'table' | 'markdown';
  data: PageClassificationResult[] | string;
}

// ResultDisplay组件使用的ClassificationResult接口
export interface DisplayClassificationResult {
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

// ResultDisplay组件使用的DataResults接口
export interface DisplayDataResults {
  type: 'table' | 'markdown';
  data: DisplayClassificationResult[] | string;
}
