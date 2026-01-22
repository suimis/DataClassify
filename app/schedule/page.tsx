'use client';

import { Button } from '@/components/ui/button';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { ClipboardList } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';

export default function Page() {
  const chartData = [
    { status: '成功', value: 1, fill: 'var(--color-success)' },
    { status: '中止', value: 2, fill: 'var(--color-aborted)' },
    { status: '失败', value: 2, fill: 'var(--color-failed)' },
  ];

  // 计算成功任务的占比
  const totalTasks = chartData.reduce((acc, curr) => acc + curr.value, 0);
  const successValue =
    chartData.find((item) => item.status === '成功')?.value || 0;
  const successPercentage = Math.round((successValue / totalTasks) * 100);

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

        <Button
          variant="default"
          size="default"
          className="ml-auto cursor-pointer"
        >
          创建任务
        </Button>
      </section>

      <section className="mx-4 mt-2 grid grid-cols-3 gap-2">
        <div className="w-98 h-38  flex items-center rounded-md bg-sidebar p-5 border border-neutral-200/50">
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
                />
              </PieChart>
            </ChartContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
