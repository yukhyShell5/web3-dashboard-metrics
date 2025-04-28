
import React from 'react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

interface PieChartProps {
  data: any[];
  colors: string[];
  height?: number;
  activeSeverity?: string | null;
  onSeverityClick?: (severity: string) => void;
  dataKey?: string;
  nameKey?: string;
  onSectorClick?: (data: any) => void;
}

const PieChart = ({ 
  data, 
  colors, 
  height = 400, 
  activeSeverity, 
  onSeverityClick,
  dataKey = "value",
  nameKey = "name",
  onSectorClick
}: PieChartProps) => {
  const handleClick = (data: any) => {
    if (onSectorClick) {
      onSectorClick(data);
    } else if (onSeverityClick && data.name) {
      onSeverityClick(data.name.toLowerCase());
    }
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
          onClick={handleClick}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
              opacity={!activeSeverity || entry.name.toLowerCase() === activeSeverity ? 1 : 0.3}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          onClick={(e) => {
            if (onSeverityClick) {
              onSeverityClick(e.value.toLowerCase())
            }
          }}
          formatter={(value) => (
            <span className={`cursor-pointer ${value.toLowerCase() === activeSeverity ? 'font-bold' : ''}`}>
              {value}
            </span>
          )}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
