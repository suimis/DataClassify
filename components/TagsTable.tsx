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
import { ArrowUpDown, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import React, { useState, useMemo } from 'react';

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
import { TagClassification } from '@/lib/types';

interface TagsTableProps {
  data: TagClassification[];
}

export default function TagsTable({ data }: TagsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // 应用搜索筛选
  const tableData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter(
      (item) =>
        item.level1.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.level2.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.level3.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.level4.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sensitivityLevel.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [data, searchTerm]);

  const columns: ColumnDef<TagClassification>[] = [
    {
      accessorKey: 'level1',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            一级业务属性分类
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('level1')}</div>
      ),
    },
    {
      accessorKey: 'level2',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            二级业务属性分类
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('level2')}</div>,
    },
    {
      accessorKey: 'level3',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            三级业务属性分类
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('level3')}</div>,
    },
    {
      accessorKey: 'level4',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            四级业务属性分类
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('level4')}</div>,
    },
    {
      accessorKey: 'sensitivityLevel',
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
        const sensitivity = row.getValue('sensitivityLevel') as string;
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
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
  });

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPagination((prev) => ({
      ...prev,
      pageSize: newSize,
      pageIndex: 0,
    }));
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        一级业务属性分类: item.level1,
        二级业务属性分类: item.level2,
        三级业务属性分类: item.level3,
        四级业务属性分类: item.level4,
        敏感性分类: item.sensitivityLevel,
      })),
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '标签分类');
    XLSX.writeFile(workbook, '标签分类.xlsx');
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
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between py-4">
        <div className="ml-1 flex items-center space-x-2">
          <Input
            type="text"
            placeholder="搜索标签分类..."
            value={searchTerm}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center space-x-2 ">
          <TooltipProvider>
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
                <p>下载Excel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="rounded-md border max-h-125 overflow-auto ml-1">
        <Table className="w-full">
          <TableHeader className="sticky top-0 bg-white z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div>暂无数据</div>
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
                {[10, 20, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
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
