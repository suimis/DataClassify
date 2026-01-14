import { StandardExcelRow, FileProcessResult, DataMapping } from '../types';

/**
 * 数据处理工具类
 */
export class DataProcessingUtils {
  /**
   * 生成映射ID（从1开始自增）
   */
  static generateMappingId(
    data: Array<{ fieldName: string; fieldDescription: string }>
  ): Array<{
    mappingId: number;
    fieldDescription: string;
  }> {
    let mappingCounter = 1;
    return data.map((item) => ({
      mappingId: mappingCounter++,
      fieldDescription: item.fieldDescription,
    }));
  }

  /**
   * 还原原始数据
   */
  static restoreOriginalData(
    aiResults: Array<{
      mappingId: number;
      aiCategoryResult: string;
      aiLevelResult: string;
      confidence: number;
      judgmentBasis: string;
    }>,
    mappings: DataMapping[]
  ): Array<{
    originalFieldName: string;
    originalFieldDescription: string;
    aiCategoryResult: string;
    aiLevelResult: string;
    confidence: number;
    judgmentBasis: string;
  }> {
    return aiResults.map((result) => {
      const mapping = mappings.find((m) => m.mappingId === result.mappingId);
      return {
        originalFieldName: mapping?.originalFieldName || '',
        originalFieldDescription: mapping?.originalFieldDescription || '',
        aiCategoryResult: result.aiCategoryResult,
        aiLevelResult: result.aiLevelResult,
        confidence: result.confidence,
        judgmentBasis: result.judgmentBasis,
      };
    });
  }

  /**
   * 处理文件数据，生成映射关系
   */
  static processFileData(
    data: Array<{ tableName: string; field: string; fieldDescription: string }>,
    taskId: string
  ): {
    processedData: FileProcessResult[];
    mappings: DataMapping[];
  } {
    const processedData: FileProcessResult[] = [];
    const mappings: DataMapping[] = [];
    let mappingCounter = 1;

    data.forEach((item) => {
      const mappingId = mappingCounter++;

      processedData.push({
        tableName: item.tableName,
        field: item.field,
        fieldDescription: item.fieldDescription,
        mappingId,
      });

      mappings.push({
        id: `mapping_${Date.now()}_${mappingId}`,
        originalFieldName: item.field,
        originalFieldDescription: item.fieldDescription,
        mappingId,
        taskId,
        createdAt: new Date(),
      });
    });

    return { processedData, mappings };
  }

  /**
   * 验证标准Excel数据格式
   */
  static validateStandardExcelData(data: any[]): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const requiredColumns = [
      'level1',
      'level1Definition',
      'level2',
      'level2Definition',
      'level3',
      'level3Definition',
      'level4',
      'level4Definition',
      'dataExample',
      'sensitivityLevel',
    ];

    // 检查必需列是否存在
    if (data.length > 0) {
      const firstRow = data[0];
      requiredColumns.forEach((col) => {
        if (!(col in firstRow)) {
          errors.push(`缺少必需列: ${col}`);
        }
      });
    }

    // 检查数据完整性
    data.forEach((row, index) => {
      requiredColumns.forEach((col) => {
        if (!row[col] || row[col].toString().trim() === '') {
          errors.push(`第 ${index + 1} 行的 ${col} 列为空`);
        }
      });
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 计算置信度分数
   */
  static calculateConfidence(
    aiResponse: string,
    standardData: StandardExcelRow[]
  ): number {
    // 简单的置信度计算算法
    // 可以根据实际需求进行优化
    let confidence = 0.5; // 基础置信度

    // 检查AI响应中是否包含标准数据中的关键词
    const keywords = standardData.flatMap((row) => [
      row.level1,
      row.level2,
      row.level3,
      row.level4,
    ]);

    const responseLower = aiResponse.toLowerCase();
    const matchedKeywords = keywords.filter((keyword) =>
      responseLower.includes(keyword.toLowerCase())
    );

    // 根据匹配的关键词数量调整置信度
    if (matchedKeywords.length > 0) {
      confidence += Math.min(matchedKeywords.length * 0.1, 0.4);
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * 批量处理数据分片
   */
  static createBatches<T>(data: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * 生成任务ID
   */
  static generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 格式化文件大小
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 清理和标准化文本
   */
  static sanitizeText(text: string): string {
    return text
      .trim()
      .replace(/\s+/g, ' ') // 替换多个空格为单个空格
      .replace(/[\r\n]+/g, ' '); // 替换换行符为空格
  }

  /**
   * 检查敏感词
   */
  static containsSensitiveWords(
    text: string,
    sensitiveWords: string[]
  ): boolean {
    const textLower = text.toLowerCase();
    return sensitiveWords.some((word) =>
      textLower.includes(word.toLowerCase())
    );
  }
}
