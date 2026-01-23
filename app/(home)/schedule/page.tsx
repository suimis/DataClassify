'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
  Table2Icon,
  Columns2,
  Library,
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// 任务数据类型
type Task = {
  task_id: string;
  status: '成功' | '中止' | '失败' | '进行中';
  last_run: string;
  database: string;
  table: string;
  labeled_fields: number; // 已打标字段数
  total_fields: number; // 总字段数
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
    labeled_fields: 12,
    total_fields: 15,
  },
  {
    task_id: 'TASK-002',
    status: '进行中',
    last_run: '2026-01-22 10:25:00',
    database: 'order_db',
    table: 'orders',
    labeled_fields: 8,
    total_fields: 12,
  },
  {
    task_id: 'TASK-003',
    status: '失败',
    last_run: '2026-01-22 10:20:00',
    database: 'product_db',
    table: 'products',
    labeled_fields: 5,
    total_fields: 20,
  },
  {
    task_id: 'TASK-004',
    status: '中止',
    last_run: '2026-01-22 10:15:00',
    database: 'user_db',
    table: 'profiles',
    labeled_fields: 4,
    total_fields: 8,
  },
  {
    task_id: 'TASK-005',
    status: '成功',
    last_run: '2026-01-22 10:10:00',
    database: 'log_db',
    table: 'system_logs',
    labeled_fields: 6,
    total_fields: 6,
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
  // 分类级别选中状态
  const [selectedLevel, setSelectedLevel] = useState('library');

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

  const sensitiveFieldData = [
    { status: '敏感字段', value: 25, fill: 'var(--color-chart-2)' },
    { status: '非敏感字段', value: 75, fill: 'var(--color-unClassification)' },
  ];

  // 计算成功任务的占比
  const totalTasks = chartData.reduce((acc, curr) => acc + curr.value, 0);
  const totalClassifyTasks = classifyCoverData.reduce(
    (acc, curr) => acc + curr.value,
    0,
  );
  const totalSensitiveFields = sensitiveFieldData.reduce(
    (acc, curr) => acc + curr.value,
    0,
  );

  const successValue =
    chartData.find((item) => item.status === '成功')?.value || 0;
  const successClassifyValue =
    classifyCoverData.find((item) => item.status === '已分类')?.value || 0;
  const successSensitiveValue =
    sensitiveFieldData.find((item) => item.status === '敏感字段')?.value || 0;

  const successPercentage = Math.round((successValue / totalTasks) * 100);
  const successClassifyPercentage = Math.round(
    (successClassifyValue / totalClassifyTasks) * 100,
  );
  const successSensitivePercentage = Math.round(
    (successSensitiveValue / totalSensitiveFields) * 100,
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
              <DrawerHeader className="border border-b">
                <DrawerTitle>新建任务</DrawerTitle>
              </DrawerHeader>
              <div className="flex w-full h-full gap-4">
                <div className="no-scrollbar overflow-y-auto pl-10 pt-8 flex-2">
                  <form>
                    <FieldSet>
                      <FieldGroup>
                        <RadioGroup
                          defaultValue="table"
                          value={selectedLevel}
                          onValueChange={setSelectedLevel}
                          className="max-w-2xl flex flex-col cursor-po"
                        >
                          <div className="text-[0.9rem] text-black/80 after:rounded-full after:content-['*'] after:text-red-600 after:ml-0.5">
                            选择应该在哪个元素上执行测试
                          </div>
                          <div className="flex gap-3">
                            <FieldLabel htmlFor="library-class">
                              <Field orientation="horizontal">
                                <FieldContent className="cursor-pointer">
                                  <FieldTitle className="flex items-center gap-2">
                                    <Library
                                      className={
                                        selectedLevel === 'library'
                                          ? 'text-blue-600'
                                          : ''
                                      }
                                    />
                                    <span
                                      className={`${selectedLevel === 'library' ? 'text-blue-800' : ''}`}
                                    >
                                      库级别
                                    </span>
                                  </FieldTitle>
                                  <FieldDescription
                                    className={
                                      selectedLevel === 'library'
                                        ? 'text-blue-500'
                                        : ''
                                    }
                                  >
                                    对整个库所有表的列进行分类.
                                  </FieldDescription>
                                </FieldContent>
                                <RadioGroupItem
                                  value="library"
                                  id="library-class"
                                />
                              </Field>
                            </FieldLabel>
                            <FieldLabel htmlFor="table-class">
                              <Field orientation="horizontal">
                                <FieldContent className="cursor-pointer">
                                  <FieldTitle className="flex items-center gap-2">
                                    <Table2Icon
                                      className={
                                        selectedLevel === 'table'
                                          ? 'text-blue-600'
                                          : ''
                                      }
                                    />
                                    <span
                                      className={`${selectedLevel === 'table' ? 'text-blue-800' : ''}`}
                                    >
                                      表级别
                                    </span>
                                  </FieldTitle>
                                  <FieldDescription
                                    className={
                                      selectedLevel === 'table'
                                        ? 'text-blue-500'
                                        : ''
                                    }
                                  >
                                    对整个表所有列进行分类.
                                  </FieldDescription>
                                </FieldContent>
                                <RadioGroupItem
                                  value="table"
                                  id="table-class"
                                />
                              </Field>
                            </FieldLabel>
                            <FieldLabel htmlFor="column-class">
                              <Field orientation="horizontal">
                                <FieldContent className="cursor-pointer">
                                  <FieldTitle
                                    className={`flex items-center gap-2`}
                                  >
                                    <Columns2
                                      className={
                                        selectedLevel === 'column'
                                          ? 'text-blue-600'
                                          : ''
                                      }
                                    />
                                    <span
                                      className={`${selectedLevel === 'column' ? 'text-blue-800' : ''}`}
                                    >
                                      列级别
                                    </span>
                                  </FieldTitle>
                                  <FieldDescription
                                    className={
                                      selectedLevel === 'column'
                                        ? 'text-blue-500'
                                        : ''
                                    }
                                  >
                                    对某一列进行分类.
                                  </FieldDescription>
                                </FieldContent>
                                <RadioGroupItem
                                  value="column"
                                  id="column-class"
                                />
                              </Field>
                            </FieldLabel>
                          </div>
                        </RadioGroup>
                        <div className="flex flex-col gap-2">
                          <div className="text-[0.9rem] text-black/80 after:rounded-full after:content-['*'] after:text-red-600 after:ml-0.5">
                            选择数据表
                          </div>
                          <Select>
                            <SelectTrigger
                              className="w-full max-w-2xl"
                              aria-invalid
                            >
                              <SelectValue placeholder="选择数据表" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                              <SelectGroup>
                                <SelectItem value="daily_summary">
                                  daily_summary
                                </SelectItem>
                                <SelectItem value="daily_summary_filter">
                                  daily_summary_filter
                                </SelectItem>
                                <SelectItem value="acct_vars">
                                  acct_vars
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="text-[0.9rem] text-black/80 after:rounded-full after:content-['*'] after:text-red-600 after:ml-0.5">
                            分类分级类型
                          </div>
                          <Select>
                            <SelectTrigger
                              className="w-full max-w-2xl"
                              aria-invalid
                            >
                              <SelectValue placeholder="选择分类分级类型" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                              <SelectGroup>
                                <SelectItem value="full-classify">
                                  全量打标
                                </SelectItem>
                                <SelectItem value="plus-classify">
                                  增量打标
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="text-[0.9rem] text-black/80 after:rounded-full">
                            任务名称
                          </div>
                          <Input
                            className="mb-1 max-w-2xl"
                            id="task-name"
                            type="text"
                            placeholder="请输入任务名称"
                          />
                        </div>
                      </FieldGroup>
                    </FieldSet>
                  </form>
                </div>
                <div className="no-scrollbar overflow-y-auto px-10 pt-8 flex-1 h-[93%] border border-neutral-300/70 rounded-md mt-8 mr-12">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        新建分类分级任务说明
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        通过配置任务参数，对数据库中的数据进行自动分类和敏感字段识别。
                      </p>
                    </div>

                    <div className="border-l-2 border-blue-500 pl-4">
                      <h4 className="text-base font-medium text-gray-800 mb-2">
                        任务配置说明
                      </h4>
                      <div className="space-y-3 text-sm text-gray-600">
                        <div>
                          <strong className="text-gray-700">
                            1. 选择分类级别
                          </strong>
                          <ul className="mt-1 ml-4 space-y-1 list-disc">
                            <li>
                              <strong>库级别</strong>
                              ：对整个数据库中所有表的所有列进行分类分级处理
                            </li>
                            <li>
                              <strong>表级别</strong>
                              ：对指定表的所有列进行分类分级处理
                            </li>
                            <li>
                              <strong>列级别</strong>
                              ：对指定表的特定列进行分类分级处理
                            </li>
                          </ul>
                        </div>
                        <div>
                          <strong className="text-gray-700">
                            2. 选择数据表
                          </strong>
                          <p className="mt-1">
                            从下拉列表中选择需要处理的数据表，支持选择数据库中的表（如
                            daily_summary、daily_summary_filter、acct_vars）
                          </p>
                        </div>
                        <div>
                          <strong className="text-gray-700">
                            3. 分类分类类型
                          </strong>
                          <ul className="mt-1 ml-4 space-y-1 list-disc">
                            <li>
                              <strong>全量打标</strong>
                              ：对选定范围内的所有数据进行重新分类和标签标记
                            </li>
                            <li>
                              <strong>增量打标</strong>
                              ：仅对新增或变更的数据进行分类和标签标记
                            </li>
                          </ul>
                        </div>
                        <div>
                          <strong className="text-gray-700">4. 任务名称</strong>
                          <p className="mt-1">
                            可选字段，用于标识和区分不同的任务。建议使用有意义的名称，如"用户数据分类-20260122"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DrawerFooter className="border border-t pt-3">
                <div className="flex ">
                  <div className="ml-auto flex gap-3">
                    <DrawerClose>
                      <Button variant="outline">取消</Button>
                    </DrawerClose>
                    <Button>新建</Button>
                  </div>
                </div>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </span>
      </section>

      <section className="mx-4 mt-2 flex justify-between gap-4">
        <div className="flex-1 h-38 flex items-center rounded-md bg-sidebar p-5 border border-neutral-200/50">
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
        <div className="flex-1 h-38 flex items-center rounded-md bg-sidebar p-5 border border-neutral-200/50">
          <div className="flex flex-col gap-2.5 mr-8 flex-1.1">
            <div className="flex gap-1.5">
              <Database className="text-blue-400" />
              <span className="font-medium text-[1rem]">敏感字段统计</span>
            </div>
            <span className="text-3xl font-semibold">
              {successSensitiveValue}
            </span>
          </div>
          <div className="flex gap-1 flex-2 w-full h-full">
            <ChartContainer config={chartConfig} className="w-28 ml-auto">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={sensitiveFieldData}
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
                              {successSensitivePercentage}%
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

        <div className="flex-1 h-38 flex items-center rounded-md bg-sidebar p-5 border border-neutral-200/50">
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
        {/* 表头 */}
        <div className="grid grid-cols-6 gap-4 px-4 py-2 border-b bg-muted/30">
          <div className="text-sm font-medium text-gray-700">任务ID</div>
          <div className="text-sm font-medium text-gray-700">状态</div>
          <div className="text-sm font-medium text-gray-700">数据库</div>
          <div className="text-sm font-medium text-gray-700">数据表</div>
          <div className="col-span-2 text-sm font-medium text-gray-700">
            任务进度
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {sortedTasks.map((task) => {
            const progress = Math.round(
              (task.labeled_fields / task.total_fields) * 100,
            );
            return (
              <AccordionItem
                key={task.task_id}
                value={task.task_id}
                className="border-b last:border-0"
              >
                <AccordionTrigger className="hover:no-underline py-1.5 pr-2 pl-5">
                  <div className="grid grid-cols-6 gap-4 w-full text-left items-center pr-4">
                    {/* 任务ID */}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {task.task_id}
                      </span>
                    </div>

                    {/* 状态 */}
                    <div className="flex items-center">
                      <span
                        className={`rounded-xl py-0.5 px-2 text-[0.8rem] ${getStatusBadgeVariant(task.status)}`}
                      >
                        {task.status}
                      </span>
                    </div>

                    {/* 数据库 */}
                    <div className="flex flex-col pl-3">
                      <span className="text-sm text-gray-700">
                        {task.database}
                      </span>
                    </div>

                    {/* 数据表 */}
                    <div className="flex flex-col pl-4.5">
                      <span className="text-sm text-gray-700">
                        {task.table}
                      </span>
                    </div>

                    {/* 进度条 */}
                    <div className="col-span-2 flex items-center gap-3 pl-6">
                      <Progress value={progress} className="w-[80%] h-2" />
                      <span className="text-sm font-medium text-gray-600 min-w-[3rem] text-right">
                        {progress}%
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-6 gap-5 pt-2 pb-2 px-5 w-full">
                    {/* 任务进度 */}
                    <div className="col-span-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          任务进度
                        </span>
                      </div>
                      <Progress value={progress} className="h-3 w-[80%]" />
                      <span className="text-sm text-gray-600">
                        {task.labeled_fields} / {task.total_fields} 字段
                      </span>
                    </div>

                    {/* 已打标字段数 */}
                    <div className="space-y-1">
                      <span className="text-sm text-gray-500">
                        已打标字段数
                      </span>
                      <div className="text-lg font-semibold text-gray-900">
                        {task.labeled_fields}
                      </div>
                    </div>

                    {/* 总打标字段数 */}
                    <div className="space-y-1">
                      <span className="text-sm text-gray-500">
                        总打标字段数
                      </span>
                      <div className="text-lg font-semibold text-gray-900">
                        {task.total_fields}
                      </div>
                    </div>

                    {/* 任务ID */}
                    <div className="space-y-1">
                      <span className="text-sm text-gray-500">任务ID</span>
                      <div className="text-base font-medium text-gray-900">
                        {task.task_id}
                      </div>
                    </div>

                    {/* 状态 */}
                    <div className="space-y-1">
                      <span className="text-sm text-gray-500">状态</span>
                      <div>
                        <span
                          className={`rounded-xl py-0.5 px-2 text-[0.8rem] ${getStatusBadgeVariant(task.status)}`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>

                    {/* 最近运行时间 */}
                    <div className="space-y-1">
                      <span className="text-sm text-gray-500">
                        最近运行时间
                      </span>
                      <div className="text-base font-medium text-gray-900">
                        {task.last_run}
                      </div>
                    </div>

                    {/* 数据库 */}
                    <div className="space-y-1">
                      <span className="text-sm text-gray-500">数据库</span>
                      <div className="text-base font-medium text-gray-900">
                        {task.database}
                      </div>
                    </div>

                    {/* 数据表 */}
                    <div className="space-y-1">
                      <span className="text-sm text-gray-500">数据表</span>
                      <div className="text-base font-medium text-gray-900">
                        {task.table}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </section>
    </div>
  );
}
