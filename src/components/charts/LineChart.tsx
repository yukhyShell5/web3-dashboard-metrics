
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
  height?: number;
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
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={xDataKey} 
          interval="preserveStartEnd"
          minTickGap={50}
        />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend 
          onClick={(e: any) => onLineClick?.(e.dataKey)}
          formatter={(value: any) => (
            <span className={`cursor-pointer ${lines.find(l => l.active && l.name === value) ? 'font-bold' : ''}`}>
              {value}
            </span>
          )}
        />
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.stroke}
            name={line.name}
            strokeWidth={line.active ? 3 : 1}
            opacity={!lines.some(l => l.active) || line.active ? 1 : 0.3}
            dot={{ r: 5, cursor: 'pointer' }}
            activeDot={{ r: 8, cursor: 'pointer' }}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
