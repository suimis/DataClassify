import * as XLSX from 'xlsx';
import {
  StandardExcelRow,
  ClassificationHierarchy,
  ClassificationStandard,
} from '../types';

/**
 * Excel解析工具类
 */
export class ExcelParserUtils {
  /**
   * 解析标准Excel文件
   */
  static async parseStandardExcel(file: File): Promise<{
    data: StandardExcelRow[];
    standard: ClassificationStandard;
  }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // 转换数据格式
          const standardData: StandardExcelRow[] = jsonData.map((row: any) => ({
            level1: row['一级分类'] || row['level1'] || '',
            level1Definition:
              row['一级分类定义'] || row['level1Definition'] || '',
            level2: row['二级分类'] || row['level2'] || '',
            level2Definition:
              row['二级分类定义'] || row['level2Definition'] || '',
            level3: row['三级分类'] || row['level3'] || '',
            level3Definition:
              row['三级分类定义'] || row['level3Definition'] || '',
            level4: row['四级分类'] || row['level4'] || '',
            level4Definition:
              row['四级分类定义'] || row['level4Definition'] || '',
            dataExample: row['数据项示例'] || row['dataExample'] || '',
            sensitivityLevel:
              row['敏感性分级'] || row['sensitivityLevel'] || '',
          }));

          // 创建标准记录
          const standard: ClassificationStandard = {
            id: `standard_${Date.now()}`,
            version: this.generateVersion(),
            name: file.name.replace(/\.[^/.]+$/, ''),
            description: `分类分级标准文件 - ${file.name}`,
            fileUrl: '', // 这里应该上传到文件存储服务
            fileName: file.name,
            fileSize: file.size,
            createdAt: new Date(),
            createdBy: 'system',
            isActive: true,
          };

          resolve({ data: standardData, standard });
        } catch (error) {
          reject(
            new Error(
              `Excel文件解析失败: ${
                error instanceof Error ? error.message : '未知错误'
              }`,
            ),
          );
        }
      };

      reader.onerror = () => {
        reject(new Error('文件读取失败'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * 解析数据Excel文件
   */
  static async parseDataExcel(file: File): Promise<
    Array<{
      tableName: string;
      field: string;
      fieldDescription: string;
    }>
  > {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // 转换数据格式，支持多种列名
          const parsedData = jsonData.map((row: any) => ({
            tableName:
              row['表名'] || row['tableName'] || row['Table Name'] || '',
            field:
              row['字段名'] ||
              row['field'] ||
              row['Field'] ||
              row['字段'] ||
              '',
            fieldDescription:
              row['字段描述'] ||
              row['fieldDescription'] ||
              row['Field Description'] ||
              row['描述'] ||
              '',
          }));

          resolve(parsedData);
        } catch (error) {
          reject(
            new Error(
              `数据Excel文件解析失败: ${
                error instanceof Error ? error.message : '未知错误'
              }`,
            ),
          );
        }
      };

      reader.onerror = () => {
        reject(new Error('文件读取失败'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * 将分类层级数据转换为Excel工作簿
   */
  static convertHierarchyToExcel(
    hierarchies: ClassificationHierarchy[],
  ): XLSX.WorkBook {
    const worksheetData = hierarchies.map((hierarchy) => ({
      一级分类: hierarchy.level1,
      一级分类定义: hierarchy.level1Definition,
      二级分类: hierarchy.level2,
      二级分类定义: hierarchy.level2Definition,
      三级分类: hierarchy.level3,
      三级分类定义: hierarchy.level3Definition,
      四级分类: hierarchy.level4,
      四级分类定义: hierarchy.level4Definition,
      数据项示例: hierarchy.dataExample,
      敏感性分级: hierarchy.sensitivityLevel,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '分类分级标准');

    return workbook;
  }

  /**
   * 将结果数据转换为Excel工作簿
   */
  static convertResultsToExcel(results: any[]): XLSX.WorkBook {
    const worksheetData = results.map((result) => ({
      原始字段名: result.originalFieldName || '',
      原始字段描述: result.originalFieldDescription || '',
      AI分类结果: result.aiCategoryResult || '',
      AI分级结果: result.aiLevelResult || '',
      置信度: result.confidence || 0,
      判定依据: result.judgmentBasis || '',
      校对状态: result.verificationStatus || '',
      修改后分类: result.modifiedCategory || '',
      修改后分级: result.modifiedLevel || '',
      校对人: result.verifier || '',
      校对时间: result.verifiedAt
        ? new Date(result.verifiedAt).toLocaleString()
        : '',
      备注: result.comments || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '分类分级结果');

    return workbook;
  }

  /**
   * 下载Excel文件
   */
  static downloadExcel(workbook: XLSX.WorkBook, fileName: string) {
    XLSX.writeFile(workbook, fileName);
  }

  /**
   * 验证Excel文件格式
   */
  static validateExcelFile(file: File): { isValid: boolean; error?: string } {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];

    const validExtensions = ['.xlsx', '.xls', '.csv'];

    if (!validTypes.includes(file.type)) {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!validExtensions.includes(extension)) {
        return {
          isValid: false,
          error: '不支持的文件格式，请上传Excel文件（.xlsx, .xls, .csv）',
        };
      }
    }

    // 检查文件大小（限制为10MB）
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: '文件大小超过限制，最大支持10MB',
      };
    }

    return { isValid: true };
  }

  /**
   * 获取Excel文件基本信息
   */
  static async getExcelFileInfo(file: File): Promise<{
    sheetNames: string[];
    rowCount: number;
    columnCount: number;
  }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });

          let totalRowCount = 0;
          let maxColumnCount = 0;

          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            if (jsonData.length > 0) {
              totalRowCount += jsonData.length;
              const firstRow = jsonData[0] as Record<string, unknown>;
              const columnCount = Object.keys(firstRow).length;
              maxColumnCount = Math.max(maxColumnCount, columnCount);
            }
          });

          resolve({
            sheetNames: workbook.SheetNames,
            rowCount: totalRowCount,
            columnCount: maxColumnCount,
          });
        } catch (error) {
          reject(
            new Error(
              `获取Excel文件信息失败: ${
                error instanceof Error ? error.message : '未知错误'
              }`,
            ),
          );
        }
      };

      reader.onerror = () => {
        reject(new Error('文件读取失败'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * 生成版本号
   */
  private static generateVersion(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const time =
      String(date.getHours()).padStart(2, '0') +
      String(date.getMinutes()).padStart(2, '0');
    return `v${year}${month}${day}.${time}`;
  }

  /**
   * 预览Excel文件前几行
   */
  static async previewExcelFile(
    file: File,
    previewRows: number = 5,
  ): Promise<{
    headers: string[];
    rows: any[];
  }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          if (jsonData.length === 0) {
            resolve({ headers: [], rows: [] });
            return;
          }

          const headers = Object.keys(jsonData[0] as Record<string, unknown>);
          const previewData = jsonData.slice(0, previewRows);

          resolve({ headers, rows: previewData });
        } catch (error) {
          reject(
            new Error(
              `Excel文件预览失败: ${
                error instanceof Error ? error.message : '未知错误'
              }`,
            ),
          );
        }
      };

      reader.onerror = () => {
        reject(new Error('文件读取失败'));
      };

      reader.readAsArrayBuffer(file);
    });
  }
}
