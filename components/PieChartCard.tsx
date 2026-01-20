'use client';

import { Label, Pie, PieChart } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

export interface ChartDataItem {
  [key: string]: string | number;
}

export interface PieChartCardProps {
  title: string;
  icon?: React.ReactNode;
  data: ChartDataItem[];
  config: ChartConfig;
  dataKey: string;
  nameKey: string;
  centerLabel?: string;
  className?: string;
}

export function PieChartCard({
  title,
  icon,
  data,
  config,
  dataKey,
  nameKey,
  centerLabel,
  className,
}: PieChartCardProps) {
  const [selectedClassification, setSelectedClassification] =
    useState<string>('全部');

  // 获取所有可用的分类选项
  const classificationOptions = {
    全部: '全部',
  } as Record<string, string>;

  data.forEach((item) => {
    const key = item[nameKey] as string;
    classificationOptions[key] = key;
  });

  // 根据筛选过滤数据
  const filteredData = useMemo(() => {
    if (selectedClassification === '全部') {
      return data;
    }
    return data.filter((item) => item[nameKey] === selectedClassification);
  }, [data, selectedClassification, nameKey]);

  // 根据过滤后的数据计算总数
  const totalLabels = useMemo(() => {
    return filteredData.reduce(
      (acc, curr) => acc + (curr[dataKey] as number),
      0,
    );
  }, [filteredData, dataKey]);

  // 获取按钮显示文本
  const getButtonText = () => {
    return selectedClassification === '全部'
      ? '全部分级'
      : selectedClassification;
  };

  // 处理下拉菜单点击
  const handleSelect = (classification: string) => {
    if (selectedClassification === classification) {
      // 如果当前已经选中该项，则切换回全部
      setSelectedClassification('全部');
    } else {
      setSelectedClassification(classification);
    }
  };

  return (
    <Card
      className={`!pt-3 transition-shadow duration-300 z-10 hover:shadow-lg ${className}`}
    >
      <CardHeader className="flex items-center justify-between border-b !pb-3">
        <div className="flex gap-1 items-center">
          {icon}
          <span className="grey-font">{title}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {getButtonText()}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {Object.entries(classificationOptions)
              .filter(([key]) => key !== '全部')
              .map(([key, label]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => handleSelect(label)}
                  className={
                    selectedClassification === label ? 'bg-accent' : ''
                  }
                >
                  {label}
                </DropdownMenuItem>
              ))}
            <DropdownMenuItem
              onClick={() => handleSelect('全部')}
              className={selectedClassification === '全部' ? 'bg-accent' : ''}
            >
              全部
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  labelKey={dataKey}
                  nameKey={nameKey}
                />
              }
            />
            <Pie
              data={filteredData}
              dataKey={dataKey}
              nameKey={nameKey}
              innerRadius={60}
              strokeWidth={5}
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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalLabels.toLocaleString()}
                        </tspan>
                        {centerLabel && (
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            {centerLabel}
                          </tspan>
                        )}
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {filteredData.map((item) => (
            <button
              key={item[nameKey] as string}
              onClick={() => handleSelect(item[nameKey] as string)}
              className={`group flex cursor-pointer min-w-[52px] flex-col items-center rounded-md px-2 py-1.5 transition-all ${
                selectedClassification === (item[nameKey] as string)
                  ? 'bg-blue-50 ring-1 ring-blue-200'
                  : 'bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div
                className="mb-1 h-1.5 w-4 rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
                style={{ background: item.fill as string }}
              />
              <span className="text-[10px] font-medium text-slate-600 leading-tight">
                {item[nameKey]}
              </span>
              <span className="text-sm font-semibold text-slate-800 leading-tight">
                {item[dataKey]}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
