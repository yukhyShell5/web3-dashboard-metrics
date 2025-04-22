
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
}

const LineChart = ({ data, xDataKey, lines, onLineClick }: LineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xDataKey} />
        <YAxis />
        <Tooltip />
        <Legend 
          onClick={(e) => onLineClick?.(e.dataKey)}
          formatter={(value, entry) => (
            <span className={`cursor-pointer ${entry.dataKey === lines.find(l => l.active)?.dataKey ? 'font-bold' : ''}`}>
              {value}
            </span>
          )}
        />
        {lines.map((line, index) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.stroke}
            name={line.name}
            strokeWidth={line.active ? 3 : 1}
            opacity={!lines.some(l => l.active) || line.active ? 1 : 0.3}
            style={{ cursor: 'pointer' }}
            onClick={() => onLineClick?.(line.dataKey)}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
