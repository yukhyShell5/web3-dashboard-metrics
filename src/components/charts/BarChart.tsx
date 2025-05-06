
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
          top: 5,
          right: 5,
          left: 0,
          bottom: 5,
        }}
        onClick={(e) => e?.activePayload && handleClick(e.activePayload[0]?.payload)}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
        <XAxis 
          dataKey={xDataKey} 
          tick={{ fontSize: 10 }}
          axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
          tickLine={false}
        />
        <YAxis 
          tick={{ fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickCount={5}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--popover))', 
            borderColor: 'hsl(var(--border))',
            color: 'hsl(var(--foreground))',
            fontSize: '12px',
            padding: '8px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        />
        {bars.map((bar, index) => (
          <Bar 
            key={index} 
            dataKey={bar.dataKey} 
            fill={bar.fill} 
            name={bar.name || bar.dataKey} 
            stackId={stacked ? "stack" : undefined}
            onClick={handleClick}
            cursor="pointer"
            radius={[4, 4, 0, 0]} // Rounded top corners
            maxBarSize={50}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
