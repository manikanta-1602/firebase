'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { NutritionalInfo } from '@/lib/types';

interface NutritionChartProps {
  data: NutritionalInfo;
}

export function NutritionChart({ data }: NutritionChartProps) {
  const chartData = [
    { name: 'Protein', value: data.protein, fill: 'var(--color-protein)' },
    { name: 'Fat', value: data.fat, fill: 'var(--color-fat)' },
    { name: 'Carbs', value: data.carbohydrates, fill: 'var(--color-carbs)' },
  ];

  const chartConfig = {
    protein: {
      label: 'Protein (g)',
      color: 'hsl(var(--chart-2))',
    },
    fat: {
      label: 'Fat (g)',
      color: 'hsl(var(--chart-4))',
    },
    carbs: {
      label: 'Carbs (g)',
      color: 'hsl(var(--chart-5))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutritional Info</CardTitle>
        <CardDescription>
          Approx. {Math.round(data.calories)} calories per serving
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <XAxis type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="value" radius={5} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
