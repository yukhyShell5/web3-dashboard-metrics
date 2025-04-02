
import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LineChartProps {
  data: any[];
  xDataKey: string;
  lines: {
    dataKey: string;
    stroke: string;
    name?: string;
  }[];
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({ data, xDataKey, lines, height = 300 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: 0,
        }}
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
        {lines.map((line, index) => (
          <Line 
            key={index}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.stroke}
            name={line.name || line.dataKey}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
