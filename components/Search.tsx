import React, { useState, useCallback } from 'react';
import { Search as SearchIcon, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';

interface FilterOptions {
  width: string;
  maxWidth: string;
}

interface SearchComponentProps {
  onSearch?: (query: string, filters?: FilterOptions) => void;
  onFilter?: (filters: FilterOptions) => void;
  onAdd?: () => void;
  placeholder?: string;
  defaultFilters?: FilterOptions;
  className?: string;
}

export default function Search({
  onSearch,
  onFilter,
  onAdd,
  placeholder = '搜索...',
  defaultFilters = { width: '100%', maxWidth: '300px' },
  className = '',
}: SearchComponentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // 处理搜索输入变化
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);

      // 实时搜索（防抖可以在这里实现）
      if (onSearch) {
        onSearch(query, filters);
      }
    },
    [onSearch, filters],
  );

  // 处理过滤器变化
  const handleFilterChange = useCallback(
    (key: keyof FilterOptions, value: string) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);

      if (onFilter) {
        onFilter(newFilters);
      }
    },
    [filters, onFilter],
  );

  // 处理搜索提交
  const handleSearchSubmit = useCallback(() => {
    if (onSearch) {
      onSearch(searchQuery, filters);
    }
  }, [onSearch, searchQuery, filters]);

  // 处理添加按钮点击
  const handleAddClick = useCallback(() => {
    if (onAdd) {
      onAdd();
    }
  }, [onAdd]);

  // 重置过滤器
  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    if (onFilter) {
      onFilter(defaultFilters);
    }
  }, [defaultFilters, onFilter]);

  return (
    <div
      className={`flex flex-col bg-white rounded-lg p-4 shadow-md ${className}`}
    >
      {/* 搜索区域 */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center border border-gray-300 rounded-lg py-2 px-4 bg-white relative">
          <div className="flex justify-center items-center w-6 h-6 mr-4">
            <SearchIcon
              className="text-gray-500"
              size={18}
              aria-hidden="true"
            />
          </div>
          <Input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
              e.key === 'Enter' && handleSearchSubmit()
            }
            className="border-none focus-visible:ring-0 shadow-none p-0 h-auto"
            aria-label="搜索输入"
          />
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
              aria-label="筛选选项"
            >
              <Filter className="text-gray-500" size={16} />
            </Button>
            {onAdd && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleAddClick}
                aria-label="添加新项"
              >
                <Plus className="text-gray-500" size={16} />
              </Button>
            )}
          </div>
        </div>

        {/* 过滤器弹出层 */}
        <div className="relative">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="default"
                className="w-full justify-between"
              >
                <span>筛选条件</span>
                <Filter className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">筛选选项</h4>
                  <p className="text-sm text-gray-500">
                    设置筛选条件来缩小搜索范围
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <label htmlFor="width" className="text-sm font-medium">
                      宽度
                    </label>
                    <Input
                      id="width"
                      type="text"
                      value={filters.width}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleFilterChange('width', e.target.value)
                      }
                      className="col-span-2 h-8"
                      aria-label="宽度设置"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <label htmlFor="maxWidth" className="text-sm font-medium">
                      最大宽度
                    </label>
                    <Input
                      id="maxWidth"
                      type="text"
                      value={filters.maxWidth}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleFilterChange('maxWidth', e.target.value)
                      }
                      className="col-span-2 h-8"
                      aria-label="最大宽度设置"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className=""
                    onClick={handleResetFilters}
                  >
                    重置
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    className=""
                    onClick={() => setIsPopoverOpen(false)}
                  >
                    应用
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </section>
    </div>
  );
}
