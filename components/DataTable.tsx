'use client';

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize,
  Minimize,
  RefreshCw,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import AdvancedFilter from './AdvancedFilter';
import { Input } from '@/components/ui/input';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import * as XLSX from 'xlsx';
import { DisplayClassificationResult } from '@/lib/types';

interface DataTableProps {
  data: DisplayClassificationResult[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function DataTable({
  data,
  onRefresh,
  isLoading = false,
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] =
    useState<DisplayClassificationResult[]>(data);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // 使用useMemo来优化性能，同时处理搜索和高级筛选
  const tableData = useMemo(() => {
    let result = filteredData;

    // 应用搜索筛选
    if (searchTerm) {
      result = result.filter((item) =>
        item.field.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return result;
  }, [filteredData, searchTerm]);

  const columns: ColumnDef<DisplayClassificationResult>[] = [
    {
      accessorKey: 'dataSource',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            数据源
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('dataSource')}</div>,
    },
    {
      accessorKey: 'databaseName',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            库名
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('databaseName')}</div>,
    },
    {
      accessorKey: 'tableName',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            表名
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('tableName')}</div>,
    },
    {
      accessorKey: 'field',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            字段
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-mono">{row.getValue('field')}</div>
      ),
    },
    {
      accessorKey: 'fieldDescription',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            字段描述
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('fieldDescription')}</div>,
    },
    {
      accessorKey: 'firstLevelCategory',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            一级分类
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('firstLevelCategory')}</div>,
    },
    {
      accessorKey: 'secondLevelCategory',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            二级分类
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('secondLevelCategory')}</div>,
    },
    {
      accessorKey: 'thirdLevelCategory',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            三级分类
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('thirdLevelCategory')}</div>,
    },
    {
      accessorKey: 'fourthLevelCategory',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            四级分类
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('fourthLevelCategory')}</div>,
    },
    {
      accessorKey: 'sensitivityClassification',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            敏感性分类
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const sensitivity = row.getValue('sensitivityClassification') as string;
        const getSensitivityColor = (level: string) => {
          switch (level) {
            case '高敏感':
              return 'bg-red-100 text-red-800 border-red-200';
            case '中等敏感':
              return 'bg-orange-100 text-orange-800 border-orange-200';
            case '低敏感':
              return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case '公开':
              return 'bg-green-100 text-green-800 border-green-200';
            default:
              return 'bg-gray-100 text-gray-800 border-gray-200';
          }
        };

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSensitivityColor(
              sensitivity,
            )}`}
          >
            {sensitivity}
          </span>
        );
      },
    },
    {
      accessorKey: 'taggingMethod',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            打标方式
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('taggingMethod')}</div>,
    },
    {
      accessorKey: 'classificationReason',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            分类理由
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="max-w-xs truncate">
          {row.getValue('classificationReason')}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      rowSelection,
      pagination,
    },
  });

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPagination((prev) => ({
      ...prev,
      pageSize: newSize,
      pageIndex: 0, // 重置到第一页
    }));
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        数据源: item.dataSource,
        库名: item.databaseName,
        表名: item.tableName,
        字段: item.field,
        字段描述: item.fieldDescription,
        一级分类: item.firstLevelCategory,
        二级分类: item.secondLevelCategory,
        三级分类: item.thirdLevelCategory,
        四级分类: item.fourthLevelCategory,
        敏感性分类: item.sensitivityClassification,
        打标方式: item.taggingMethod,
        分类理由: item.classificationReason,
      })),
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '数据分类结果');
    XLSX.writeFile(workbook, '数据分类结果.xlsx');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderPaginationButtons = () => {
    const totalPages = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex;
    const pageButtons = [];

    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) {
        pageButtons.push(
          <Button
            key={i}
            variant={currentPage === i ? 'default' : 'outline'}
            size="sm"
            className="h-8 w-8"
            onClick={() => table.setPageIndex(i)}
          >
            {i + 1}
          </Button>,
        );
      }
    } else {
      pageButtons.push(
        <Button
          key={0}
          variant={currentPage === 0 ? 'default' : 'outline'}
          size="sm"
          className="h-8 w-8"
          onClick={() => table.setPageIndex(0)}
        >
          1
        </Button>,
      );

      if (currentPage > 3) {
        pageButtons.push(
          <span key="ellipsis-start" className="px-2">
            ...
          </span>,
        );
      }

      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages - 2, currentPage + 1);

      if (currentPage <= 3) {
        endPage = 4;
      } else if (currentPage >= totalPages - 4) {
        startPage = totalPages - 5;
      }

      for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(
          <Button
            key={i}
            variant={currentPage === i ? 'default' : 'outline'}
            size="sm"
            className="h-8 w-8"
            onClick={() => table.setPageIndex(i)}
          >
            {i + 1}
          </Button>,
        );
      }

      if (currentPage < totalPages - 4) {
        pageButtons.push(
          <span key="ellipsis-end" className="px-2">
            ...
          </span>,
        );
      }

      pageButtons.push(
        <Button
          key={totalPages - 1}
          variant={currentPage === totalPages - 1 ? 'default' : 'outline'}
          size="sm"
          className="h-8 w-8"
          onClick={() => table.setPageIndex(totalPages - 1)}
        >
          {totalPages}
        </Button>,
      );
    }

    return pageButtons;
  };

  return (
    <div
      className={`w-full h-full flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 bg-white p-6' : ''
      }`}
    >
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="搜索字段名..."
            value={searchTerm}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(event.target.value)
            }
            className="max-w-sm"
          />
          <AdvancedFilter
            data={data}
            onFilterChange={(filteredData: DisplayClassificationResult[]) => {
              setFilteredData(filteredData);
            }}
          />
        </div>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            {onRefresh && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onRefresh}
                    variant="outline"
                    size="icon"
                    className="cursor-pointer"
                    disabled={isLoading}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="">刷新</p>
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={toggleFullscreen}
                  variant="outline"
                  size="icon"
                  className="cursor-pointer"
                >
                  {isFullscreen ? (
                    <Minimize className="h-4 w-4" />
                  ) : (
                    <Maximize className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="">{isFullscreen ? '退出全屏' : '全屏查看'}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleDownload}
                  variant="default"
                  size="icon"
                  className="cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="">下载Excel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div
        className={`rounded-md border ${
          isFullscreen ? 'max-h-[calc(100vh-200px)]' : 'max-h-125'
        } overflow-auto`}
      >
        <Table className="w-full">
          <TableHeader className="sticky top-0 bg-white z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="p-2 align-middle whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center p-2 align-middle whitespace-nowrap"
                >
                  <div className="">暂无数据</div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex mt-auto items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-4">
          <p className="text-sm text-muted-foreground">
            共 {table.getFilteredRowModel().rows.length} 条记录
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">每页显示</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value: string) =>
                handlePageSizeChange(Number(value))
              }
            >
              <SelectTrigger className="h-8 w-17.5">
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent className="z-9999">
                {[5, 10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={size.toString()} className="">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">条</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">
            第 {table.getState().pagination.pageIndex + 1} 页，共{' '}
            {table.getPageCount()} 页
          </p>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              className="px-3"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              首页
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="px-3"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {renderPaginationButtons()}
            <Button
              variant="outline"
              size="sm"
              className="px-3"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="px-3"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              末页
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
