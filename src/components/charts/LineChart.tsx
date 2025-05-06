
import React from 'react';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface LineConfig {
  dataKey: string;
  stroke: string;
  name: string;
  active?: boolean;
}

interface LineChartProps {
  data: any[];
  xDataKey: string;
  lines: LineConfig[];
  onLineClick?: (dataKey: string) => void;
  onPointClick?: (alertId: string) => void;
  height?: number | string;
}

const LineChart = ({ data, xDataKey, lines, onLineClick, onPointClick, height = 400 }: LineChartProps) => {
  const handleClick = (point: any) => {
    if (point && point.id && onPointClick) {
      onPointClick(point.id);
    }
  };

  // Make sure each data point has at least a value of 0 for each line
  const processedData = data.map(item => {
    const newItem = { ...item };
    lines.forEach(line => {
      if (newItem[line.dataKey] === undefined) {
        newItem[line.dataKey] = 0;
      }
    });
    return newItem;
  });

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart 
        data={processedData} 
        onClick={(e) => e?.activePayload && handleClick(e.activePayload[0]?.payload)}
        margin={{
          top: 5,
          right: 5,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.05} vertical={false} />
        <XAxis 
          dataKey={xDataKey} 
          interval="preserveStartEnd"
          minTickGap={30}
          tick={{ fontSize: 10 }}
          axisLine={{ stroke: 'rgba(255, 255, 255, 0.05)' }}
          tickLine={false}
        />
        <YAxis 
          allowDecimals={false} 
          tick={{ fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickCount={5}
          width={20}
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
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.stroke}
            name={line.name}
            strokeWidth={line.active ? 2 : 1.5}
            opacity={!lines.some(l => l.active) || line.active ? 1 : 0.3}
            dot={{ r: 3, strokeWidth: 1 }}
            activeDot={{ r: 5, cursor: 'pointer' }}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
