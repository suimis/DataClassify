'use client';

import { type ChartConfig } from '@/components/ui/chart';
import { BookText } from 'lucide-react';
import { PieChartCard } from '@/components/PieChartCard';

const chartData = [
  { browser: 'A级', classifications: 1, fill: 'var(--color-chrome)' },
  { browser: 'B级', classifications: 5, fill: 'var(--color-safari)' },
  { browser: 'C级', classifications: 50, fill: 'var(--color-firefox)' },
  { browser: 'D级', classifications: 20, fill: 'var(--color-edge)' },
];

const chartConfig = {
  classifications: {
    label: 'Classifications',
  },
  chrome: {
    label: 'A级',
    color: 'var(--chart-4)',
  },
  safari: {
    label: 'B级',
    color: 'var(--chart-3)',
  },
  firefox: {
    label: 'C级',
    color: 'var(--chart-2)',
  },
  edge: {
    label: 'D级',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export default function Page() {
  return (
    <div className="flex-1 flex flex-col h-full">
      <section className="px-6 py-2 border-b flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800/90">分类分级统计</h1>
        </div>
      </section>

      <section className="grid grid-cols-3 grid-rows-3 m-5">
        <PieChartCard
          title="分类统计"
          icon={<BookText className="size-5" />}
          data={chartData}
          config={chartConfig}
          dataKey="classifications"
          nameKey="browser"
          centerLabel="总分类数"
        />
      </section>
    </div>
  );
}
