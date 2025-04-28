
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  colors?: string[];
  height?: number;
  thickness?: number;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  min = 0,
  max = 100,
  colors = ['#10b981', '#f59e0b', '#ef4444'],
  height = 200,
  thickness = 40
}) => {
  // Normalize value between min and max
  const normalizedValue = Math.max(min, Math.min(max, value));
  const percentage = ((normalizedValue - min) / (max - min)) * 100;
  
  // Create data for the gauge
  const data = [
    { name: 'value', value: percentage },
    { name: 'empty', value: 100 - percentage }
  ];
  
  // Determine color based on value
  const getColor = () => {
    if (percentage <= 33) return colors[0];
    if (percentage <= 66) return colors[1];
    return colors[2];
  };

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="80%"
            startAngle={180}
            endAngle={0}
            innerRadius={height - thickness}
            outerRadius={height}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell key="value-cell" fill={getColor()} />
            <Cell key="empty-cell" fill="#e5e7eb" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="text-3xl font-bold -mt-10">{value}</div>
      <div className="text-sm text-muted-foreground mt-2">{min} - {max}</div>
    </div>
  );
};

export default GaugeChart;
