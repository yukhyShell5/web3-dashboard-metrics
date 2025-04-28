
import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BarChartProps {
  data: any[];
  xDataKey: string;
  bars: {
    dataKey: string;
    fill: string;
    name?: string;
  }[];
  height?: number;
  stacked?: boolean;
  onElementClick?: (data: any) => void;
}

const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  xDataKey, 
  bars, 
  height = 300, 
  stacked = false,
  onElementClick
}) => {
  const handleClick = (data: any) => {
    if (onElementClick && data) {
      onElementClick(data);
    }
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: 0,
        }}
        onClick={(e) => e?.activePayload && handleClick(e.activePayload[0]?.payload)}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis 
          dataKey={xDataKey} 
          tick={{ fill: '#FFFFFF', fontSize: 12 }}
          axisLine={{ stroke: 'rgba(255, 255, 255, 0.3)' }}
        />
        <YAxis 
          tick={{ fill: '#FFFFFF', fontSize: 12 }}
          axisLine={{ stroke: 'rgba(255, 255, 255, 0.3)' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--popover))', 
            borderColor: 'hsl(var(--border))',
            color: 'hsl(var(--foreground))'
          }}
          itemStyle={{ color: 'hsl(var(--foreground))' }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
        />
        <Legend />
        {bars.map((bar, index) => (
          <Bar 
            key={index} 
            dataKey={bar.dataKey} 
            fill={bar.fill} 
            name={bar.name || bar.dataKey} 
            stackId={stacked ? "stack" : undefined}
            onClick={handleClick}
            cursor="pointer"
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
