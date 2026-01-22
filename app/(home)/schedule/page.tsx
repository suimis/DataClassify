'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Database,
  HardDrive,
  Heart,
} from 'lucide-react';
import { ClipboardList, Search } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// 任务数据类型
type Task = {
  task_id: string;
  status: '成功' | '中止' | '失败' | '进行中';
  last_run: string;
  database: string;
  table: string;
  field_count: number;
};

// 排序类型
type SortColumn = keyof Task | null;
type SortDirection = 'asc' | 'desc';

// 示例任务数据
const tasks: Task[] = [
  {
    task_id: 'TASK-001',
    status: '成功',
    last_run: '2026-01-22 10:30:00',
    database: 'user_db',
    table: 'users',
    field_count: 15,
  },
  {
    task_id: 'TASK-002',
    status: '进行中',
    last_run: '2026-01-22 10:25:00',
    database: 'order_db',
    table: 'orders',
    field_count: 12,
  },
  {
    task_id: 'TASK-003',
    status: '失败',
    last_run: '2026-01-22 10:20:00',
    database: 'product_db',
    table: 'products',
    field_count: 20,
  },
  {
    task_id: 'TASK-004',
    status: '中止',
    last_run: '2026-01-22 10:15:00',
    database: 'user_db',
    table: 'profiles',
    field_count: 8,
  },
  {
    task_id: 'TASK-005',
    status: '成功',
    last_run: '2026-01-22 10:10:00',
    database: 'log_db',
    table: 'system_logs',
    field_count: 6,
  },
];

// 获取状态对应的 Badge 样式
function getStatusBadgeVariant(status: Task['status']) {
  switch (status) {
    case '成功':
      return 'bg-green-100 text-green-800';
    case '失败':
      return 'bg-red-100 text-red-800';
    case '中止':
      return 'bg-yellow-100 text-yellow-800';
    case '进行中':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function Page() {
  // 排序状态
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // 排序数据
  const sortedTasks = useMemo(() => {
    if (!sortColumn) return tasks;

    return [...tasks].sort((a, b) => {
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];

      // 特殊处理：状态排序
      if (sortColumn === 'status') {
        const statusOrder = ['成功', '进行中', '中止', '失败'];
        aValue = statusOrder.indexOf(aValue as Task['status']);
        bValue = statusOrder.indexOf(bValue as Task['status']);
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sortColumn, sortDirection]);

  // 处理排序点击
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // 切换排序方向
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // 新列，默认升序
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // 获取排序图标
  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    if (sortDirection === 'asc') return <ArrowUp className="ml-2 h-4 w-4" />;
    return <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const chartData = [
    { status: '成功', value: 1, fill: 'var(--color-success)' },
    { status: '中止', value: 2, fill: 'var(--color-aborted)' },
    { status: '失败', value: 2, fill: 'var(--color-failed)' },
  ];

  const classifyCoverData = [
    { status: '已分类', value: 100, fill: 'var(--color-success)' },
    { status: '未分类', value: 300, fill: 'var(--color-unClassification)' },
  ];

  // 计算成功任务的占比
  const totalTasks = chartData.reduce((acc, curr) => acc + curr.value, 0);
  const totalClassifyTasks = classifyCoverData.reduce(
    (acc, curr) => acc + curr.value,
    0,
  );
  const successValue =
    chartData.find((item) => item.status === '成功')?.value || 0;
  const successClassifyValue =
    classifyCoverData.find((item) => item.status === '已分类')?.value || 0;
  const successPercentage = Math.round((successValue / totalTasks) * 100);
  const successClassifyPercentage = Math.round(
    (successClassifyValue / totalClassifyTasks) * 100,
  );

  const chartConfig = {
    success: {
      label: '成功',
      color: '#86efac',
    },
    aborted: {
      label: '中止',
      color: '#fcd34d',
    },
    failed: {
      label: '失败',
      color: '#f87171',
    },
    unClassification: {
      label: '未分类',
      color: '#e9eaeb',
    },
  } satisfies ChartConfig;

  return (
    <div className="flex-1 flex flex-col h-full">
      <section className="px-6 py-2 border-b flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800/90">分类分级任务</h1>
        </div>
      </section>
      <section className="m-4 rounded-md py-3 px-4 bg-sidebar flex items-center border border-neutral-200/50">
        <div className="flex flex-col gap-0.5 text-md">
          <span className="font-medium text-[1rem]">数据分类分级</span>
          <span className="text-black/60 text-[0.9rem]">
            点击创建任务，开始对数据进行分类分级处理。
          </span>
        </div>
        <span className="ml-auto cursor-pointer">
          <Drawer direction="right">
            <DrawerTrigger asChild>
              <Button variant="default" size="default">
                新建任务
              </Button>
            </DrawerTrigger>
            <DrawerContent className="min-w-[75%]!">
              <DrawerHeader>
                <DrawerTitle>新建任务</DrawerTitle>
              </DrawerHeader>
              <div className="no-scrollbar overflow-y-auto px-4">
                <form>
                  <FieldSet>
                    <FieldGroup>
                      <FieldLegend>选择应该在哪个元素上执行测试</FieldLegend>
                      <RadioGroup
                        defaultValue="plus"
                        className="max-w-2xl flex"
                      >
                        <FieldLabel htmlFor="table-class">
                          <Field orientation="horizontal">
                            <FieldContent>
                              <FieldTitle>表级别</FieldTitle>
                              <FieldDescription>
                                对整个表所有列进行分类.
                              </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value="table" id="table-class" />
                          </Field>
                        </FieldLabel>
                        <FieldLabel htmlFor="column-class">
                          <Field orientation="horizontal">
                            <FieldContent>
                              <FieldTitle>列级别</FieldTitle>
                              <FieldDescription>
                                对某一列进行分类.
                              </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value="column" id="column-class" />
                          </Field>
                        </FieldLabel>
                      </RadioGroup>
                    </FieldGroup>
                  </FieldSet>
                </form>
              </div>
            </DrawerContent>
          </Drawer>
        </span>
      </section>

      <section className="mx-4 mt-2 flex justify-between">
        <div className="w-96 h-38 flex items-center rounded-md bg-sidebar p-5 border border-neutral-200/50">
          <div className="flex flex-col gap-2.5 mr-8 flex-1">
            <div className="flex gap-1.5">
              <ClipboardList className="text-blue-400" />
              <span className="font-medium text-[1rem]">所有任务</span>
            </div>
            <span className="text-3xl font-semibold">5</span>
          </div>
          <div className="flex gap-1 flex-2 h-full">
            <div className="space-y-1 flex-1 flex flex-col justify-center">
              <div className="flex gap-2 items-center">
                <span className="rounded-full size-2 bg-green-300"></span>
                <span className="text-[0.8rem] text-black/60">成功</span>
                <span className="text-[0.8rem] font-medium">1</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="rounded-full size-2 bg-amber-300"></span>
                <span className="text-[0.8rem] text-black/60">中止</span>
                <span className="text-[0.8rem] font-medium">2</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="rounded-full size-2 bg-red-400"></span>
                <span className="text-[0.8rem] text-black/60">失败</span>
                <span className="text-[0.8rem] font-medium">2</span>
              </div>
            </div>
            <ChartContainer config={chartConfig} className="w-28">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="status"
                  innerRadius={44}
                  outerRadius={54}
                  paddingAngle={2}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-xl font-bold"
                            >
                              {successPercentage}%
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
        </div>
        <div className="w-96 h-38 flex items-center rounded-md bg-sidebar p-5 border border-neutral-200/50">
          <div className="flex flex-col gap-2.5 mr-8 flex-1.1">
            <div className="flex gap-1.5">
              <Database className="text-blue-400" />
              <span className="font-medium text-[1rem]">已分类字段</span>
            </div>
            <span className="text-3xl font-semibold">5</span>
          </div>
          <div className="flex gap-1 flex-2 h-full">
            <div className="space-y-1 flex-1 flex flex-col justify-center">
              <div className="flex gap-2 items-center">
                <span className="rounded-full size-2 bg-green-300"></span>
                <span className="text-[0.8rem] text-black/60">成功</span>
                <span className="text-[0.8rem] font-medium">1</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="rounded-full size-2 bg-amber-300"></span>
                <span className="text-[0.8rem] text-black/60">中止</span>
                <span className="text-[0.8rem] font-medium">2</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="rounded-full size-2 bg-red-400"></span>
                <span className="text-[0.8rem] text-black/60">失败</span>
                <span className="text-[0.8rem] font-medium">100</span>
              </div>
            </div>
            <ChartContainer config={chartConfig} className="w-28">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="status"
                  innerRadius={44}
                  outerRadius={54}
                  paddingAngle={2}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-xl font-bold"
                            >
                              {successPercentage}%
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
        </div>
        <div className="w-96 h-38 flex items-center rounded-md bg-sidebar p-5 border border-neutral-200/50">
          <div className="flex flex-col h-full pt-5 gap-2.5 mr-8">
            <div className="flex gap-1.5">
              <Heart className="text-green-400" />
              <span className="font-medium text-[1rem]">分类字段覆盖度</span>
            </div>
            <span className="text-3xl font-semibold">
              {successClassifyValue}
            </span>
          </div>
          <div className="flex gap-1 flex-2 h-full">
            <ChartContainer config={chartConfig} className="w-28 ml-auto">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={classifyCoverData}
                  dataKey="value"
                  nameKey="status"
                  innerRadius={44}
                  outerRadius={54}
                  paddingAngle={2}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-xl font-bold"
                            >
                              {successClassifyPercentage}%
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
        </div>
      </section>

      <section className="m-4 rounded-md py-3 px-4 bg-sidebar flex items-center border border-neutral-200/50">
        <div className="flex flex-col gap-0.5 text-md">
          <span className="font-medium text-[1rem]">分类分级任务管理</span>
          <span className="text-black/60 text-[0.9rem]">
            创建的分类分级任务，可在此进行管理和查看详情。
          </span>
        </div>
        <InputGroup className="ml-auto w-80">
          <InputGroupAddon align="inline-start">
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            id="classification-task"
            placeholder="搜索任务名称"
          />
        </InputGroup>
      </section>

      <section className="m-4 rounded-md bg-sidebar border border-neutral-200/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('task_id')}
              >
                <div className="flex items-center">
                  任务ID
                  {getSortIcon('task_id')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  状态
                  {getSortIcon('status')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('last_run')}
              >
                <div className="flex items-center">
                  最近运行
                  {getSortIcon('last_run')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('database')}
              >
                <div className="flex items-center">
                  数据库
                  {getSortIcon('database')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('table')}
              >
                <div className="flex items-center">
                  数据表
                  {getSortIcon('table')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('field_count')}
              >
                <div className="flex items-center">
                  字段数
                  {getSortIcon('field_count')}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.map((task) => (
              <TableRow key={task.task_id}>
                <TableCell>{task.task_id}</TableCell>
                <TableCell>
                  <span
                    className={`rounded-xl py-1 px-2 text-[0.9rem] ${getStatusBadgeVariant(task.status)}`}
                  >
                    {task.status}
                  </span>
                </TableCell>
                <TableCell>{task.last_run}</TableCell>
                <TableCell>{task.database}</TableCell>
                <TableCell>{task.table}</TableCell>
                <TableCell>{task.field_count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
