
import React from 'react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

interface PieChartProps {
  data: any[];
  colors: string[];
  height?: number | string;
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

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    // Only show label if the percentage is significant (e.g., > 5%)
    if (percent < 0.05) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#fff" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={10}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius="85%"
          innerRadius="40%"
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
          onClick={handleClick}
          strokeWidth={1}
          stroke="rgba(0, 0, 0, 0.05)"
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
        <Legend 
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          iconSize={8}
          iconType="circle"
          wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }}
          onClick={(e) => {
            if (onSeverityClick) {
              onSeverityClick(e.value.toLowerCase())
            }
          }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
