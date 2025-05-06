
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  colors?: string[];
  height?: number | string;
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
    <div className="flex flex-col items-center h-full w-full">
      <div className="w-full flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="80%"
              startAngle={180}
              endAngle={0}
              innerRadius="70%"
              outerRadius="100%"
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              cornerRadius={1}
            >
              <Cell key="value-cell" fill={getColor()} />
              <Cell key="empty-cell" fill="rgba(255, 255, 255, 0.1)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-2xl font-bold -mt-12">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{min} - {max}</div>
    </div>
  );
};

export default GaugeChart;
