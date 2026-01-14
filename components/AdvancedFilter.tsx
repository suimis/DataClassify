'use client';

import React, { useState, useEffect } from 'react';
import { X, Filter, RotateCcw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

interface FilterCondition {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'in' | 'notIn' | 'regex';
  value: string | string[];
  logic: 'AND' | 'OR';
}

interface AdvancedFilterProps {
  data: ClassificationResult[];
  onFilterChange: (filteredData: ClassificationResult[]) => void;
}

const fieldOptions = [
  { value: 'tableName', label: '表名', type: 'text' },
  { value: 'field', label: '字段', type: 'text' },
  { value: 'fieldDescription', label: '字段描述', type: 'text' },
  { value: 'firstLevelCategory', label: '一级分类', type: 'select' },
  { value: 'secondLevelCategory', label: '二级分类', type: 'select' },
  { value: 'thirdLevelCategory', label: '三级分类', type: 'select' },
  { value: 'fourthLevelCategory', label: '四级分类', type: 'select' },
  { value: 'sensitivityClassification', label: '敏感性分类', type: 'select' },
  { value: 'taggingMethod', label: '打标方式', type: 'select' },
];

const operatorOptions = [
  { value: 'equals', label: '等于' },
  { value: 'contains', label: '包含' },
  { value: 'in', label: '包含于' },
  { value: 'notIn', label: '不包含于' },
  { value: 'regex', label: '正则表达式' },
];

export default function AdvancedFilter({
  data,
  onFilterChange,
}: AdvancedFilterProps) {
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [pendingFilters, setPendingFilters] = useState<FilterCondition[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [availableOptions, setAvailableOptions] = useState<{
    [key: string]: string[];
  }>({});
  const [regexError, setRegexError] = useState<string | null>(null);

  // 获取所有可用的选项值
  useEffect(() => {
    const options: { [key: string]: string[] } = {};

    fieldOptions.forEach((field) => {
      if (field.type === 'select') {
        const values = [
          ...new Set(
            data.map(
              (item) =>
                item[field.value as keyof ClassificationResult] as string
            )
          ),
        ];
        options[field.value] = values;
      }
    });

    setAvailableOptions(options);
  }, [data]);

  // 同步 filters 到 pendingFilters
  useEffect(() => {
    setPendingFilters(filters);
  }, [filters]);

  const addFilter = () => {
    const newFilter: FilterCondition = {
      id: Date.now().toString(),
      field: 'sensitivityClassification',
      operator: 'in',
      value: [],
      logic: 'AND',
    };
    setFilters([...filters, newFilter]);
  };

  const removeFilter = (id: string) => {
    setFilters(filters.filter((filter) => filter.id !== id));
  };

  const updateFilter = (id: string, updates: Partial<FilterCondition>) => {
    setFilters(
      filters.map((filter) =>
        filter.id === id ? { ...filter, ...updates } : filter
      )
    );
  };

  const clearAllFilters = () => {
    setFilters([]);
    setPendingFilters([]);
    // 立即触发筛选显示全部数据
    onFilterChange(data);
  };

  const applyFilters = () => {
    setRegexError(null);

    if (pendingFilters.length === 0) {
      onFilterChange(data);
      setIsFilterOpen(false);
      return;
    }

    try {
      const filteredData = data.filter((item) => {
        return pendingFilters.every((filter) => {
          const fieldValue = item[
            filter.field as keyof ClassificationResult
          ] as string;

          switch (filter.operator) {
            case 'equals':
              // 处理 equals 操作符，支持数组和字符串值
              if (Array.isArray(filter.value)) {
                return filter.value.includes(fieldValue);
              } else {
                return fieldValue === filter.value;
              }
            case 'contains':
              // 安全地处理 toLowerCase() 调用
              const searchValue =
                typeof filter.value === 'string' ? filter.value : '';
              const fieldValueLower =
                typeof fieldValue === 'string' ? fieldValue.toLowerCase() : '';
              return fieldValueLower.includes(searchValue.toLowerCase());
            case 'in':
              return (
                Array.isArray(filter.value) && filter.value.includes(fieldValue)
              );
            case 'notIn':
              return (
                Array.isArray(filter.value) &&
                !filter.value.includes(fieldValue)
              );
            case 'regex':
              try {
                const regexValue =
                  typeof filter.value === 'string' ? filter.value : '';
                const regex = new RegExp(regexValue, 'i');
                return regex.test(fieldValue);
              } catch (e) {
                setRegexError(`无效的正则表达式: ${filter.value}`);
                return false;
              }
            default:
              return true;
          }
        });
      });

      onFilterChange(filteredData);
      setIsFilterOpen(false);
    } catch (error) {
      setRegexError('应用筛选时发生错误');
    }
  };

  const getFilterDescription = (filter: FilterCondition) => {
    const field =
      fieldOptions.find((f) => f.value === filter.field)?.label || filter.field;
    const operator =
      operatorOptions.find((o) => o.value === filter.operator)?.label ||
      filter.operator;
    const value = Array.isArray(filter.value)
      ? filter.value.join(', ')
      : filter.value;
    return `${field} ${operator} "${value}"`;
  };

  return (
    <div className="w-full">
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>高级筛选</span>
              {filters.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {filters.length}
                </Badge>
              )}
            </div>
            <Plus className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[600px] p-4 z-[9999] pointer-events-auto">
          <div className="space-y-4">
            {/* 筛选条件列表 */}
            <div className="space-y-3">
              {filters.map((filter, index) => (
                <div
                  key={filter.id}
                  className="flex items-center gap-2 p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-2 flex-1">
                    {/* 逻辑选择 */}
                    {index > 0 && (
                      <Select
                        value={filter.logic}
                        onValueChange={(value: 'AND' | 'OR') =>
                          updateFilter(filter.id, { logic: value })
                        }
                      >
                        <SelectTrigger className="w-20 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-[10000]">
                          <SelectItem value="AND">AND</SelectItem>
                          <SelectItem value="OR">OR</SelectItem>
                        </SelectContent>
                      </Select>
                    )}

                    {/* 字段选择 */}
                    <Select
                      value={filter.field}
                      onValueChange={(value) =>
                        updateFilter(filter.id, {
                          field: value,
                          operator:
                            fieldOptions.find((f) => f.value === value)
                              ?.type === 'select'
                              ? 'in'
                              : 'contains',
                          value:
                            fieldOptions.find((f) => f.value === value)
                              ?.type === 'select'
                              ? []
                              : '',
                        })
                      }
                    >
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[10000]">
                        {fieldOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* 操作符选择 */}
                    <Select
                      value={filter.operator}
                      onValueChange={(value: FilterCondition['operator']) =>
                        updateFilter(filter.id, { operator: value })
                      }
                    >
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[10000]">
                        {operatorOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* 值选择 */}
                    <div className="flex-1">
                      {filter.operator === 'regex' ? (
                        // 正则表达式操作符总是使用输入框
                        <Input
                          placeholder="输入正则表达式，如: ^test.*"
                          value={(filter.value as string) || ''}
                          onChange={(e) =>
                            updateFilter(filter.id, { value: e.target.value })
                          }
                          className="h-8 border-blue-300 focus:border-blue-500"
                        />
                      ) : fieldOptions.find((f) => f.value === filter.field)
                          ?.type === 'select' ? (
                        // 选择类型的字段使用下拉框
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full h-8 justify-start"
                            >
                              {Array.isArray(filter.value) &&
                              filter.value.length > 0
                                ? filter.value.join(', ')
                                : '选择值...'}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-48 z-[10001]">
                            {availableOptions[filter.field]?.map((option) => (
                              <DropdownMenuItem
                                key={option}
                                onSelect={() => {
                                  const currentValues = Array.isArray(
                                    filter.value
                                  )
                                    ? filter.value
                                    : [];
                                  const newValues = currentValues.includes(
                                    option
                                  )
                                    ? currentValues.filter((v) => v !== option)
                                    : [...currentValues, option];
                                  updateFilter(filter.id, { value: newValues });
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={
                                      Array.isArray(filter.value) &&
                                      filter.value.includes(option)
                                    }
                                    onChange={() => {}}
                                    className="rounded"
                                  />
                                  {option}
                                </div>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        // 文本类型的字段使用输入框
                        <Input
                          placeholder="输入值..."
                          value={(filter.value as string) || ''}
                          onChange={(e) =>
                            updateFilter(filter.id, { value: e.target.value })
                          }
                          className="h-8"
                        />
                      )}
                    </div>
                  </div>

                  {/* 删除按钮 */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFilter(filter.id)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {filters.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>暂无筛选条件</p>
                  <p className="text-sm">点击下方按钮添加筛选条件</p>
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addFilter}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  添加条件
                </Button>
                {filters.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    清除全部
                  </Button>
                )}
              </div>
              <Button onClick={applyFilters} size="sm">
                应用筛选
              </Button>
            </div>

            {/* 错误提示 */}
            {regexError && (
              <div className="pt-4 border-t">
                <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                  {regexError}
                </div>
              </div>
            )}

            {/* 正则表达式帮助信息 */}
            <div className="pt-4 border-t">
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <h4 className="font-medium mb-2">正则表达式使用提示：</h4>
                <ul className="space-y-1 text-xs">
                  <li>
                    • <code className="bg-gray-200 px-1 rounded">^text</code> -
                    匹配以 "text" 开头的内容
                  </li>
                  <li>
                    • <code className="bg-gray-200 px-1 rounded">text$</code> -
                    匹配以 "text" 结尾的内容
                  </li>
                  <li>
                    • <code className="bg-gray-200 px-1 rounded">.*</code> -
                    匹配任意字符（除换行符外）零次或多次
                  </li>
                  <li>
                    • <code className="bg-gray-200 px-1 rounded">.+</code> -
                    匹配任意字符（除换行符外）一次或多次
                  </li>
                  <li>
                    •{' '}
                    <code className="bg-gray-200 px-1 rounded">
                      (value1|value2)
                    </code>{' '}
                    - 匹配 value1 或 value2
                  </li>
                  <li>
                    • 示例：
                    <code className="bg-gray-200 px-1 rounded">
                      ^user.*admin$
                    </code>{' '}
                    匹配以 "user" 开头且以 "admin" 结尾的内容
                  </li>
                </ul>
              </div>
            </div>

            {/* 当前筛选条件预览 */}
            {pendingFilters.length > 0 && (
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">当前筛选条件：</h4>
                <div className="flex flex-wrap gap-2">
                  {pendingFilters.map((filter, index) => (
                    <Badge
                      key={filter.id}
                      variant="outline"
                      className="text-xs"
                    >
                      {index > 0 && `${filter.logic} `}
                      {getFilterDescription(filter)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
