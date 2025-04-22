
import React from 'react';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Scatter, ScatterProps } from 'recharts';

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
}

const LineChart = ({ data, xDataKey, lines, onLineClick, onPointClick }: LineChartProps) => {
  const handleClick = (point: any) => {
    if (point && point.id && onPointClick) {
      onPointClick(point.id);
    }
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsLineChart data={data} onClick={(e) => e?.activePayload && handleClick(e.activePayload[0]?.payload)}>
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
          <React.Fragment key={line.dataKey}>
            <Line
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
          </React.Fragment>
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
