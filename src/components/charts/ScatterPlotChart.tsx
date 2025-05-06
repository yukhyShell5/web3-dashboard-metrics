
import React from 'react';
import { 
  ScatterChart as RechartsScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis,
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ScatterPlotChartProps {
  data: any[];
  xDataKey: string;
  yDataKey: string;
  zDataKey?: string;
  nameKey?: string;
  height?: number;
  fill?: string;
  onPointClick?: (data: any) => void;
}

const ScatterPlotChart: React.FC<ScatterPlotChartProps> = ({
  data,
  xDataKey,
  yDataKey,
  zDataKey,
  nameKey,
  height = 300,
  fill = '#8884d8',
  onPointClick
}) => {
  const handleClick = (data: any) => {
    if (onPointClick && data) {
      onPointClick(data);
    }
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsScatterChart
        margin={{
          top: 5,
          right: 5,
          bottom: 5,
          left: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
        <XAxis 
          type="number" 
          dataKey={xDataKey} 
          name={xDataKey} 
          tick={{ fontSize: 10 }}
          axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
          tickLine={false}
        />
        <YAxis 
          type="number" 
          dataKey={yDataKey} 
          name={yDataKey} 
          tick={{ fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickCount={5}
        />
        {zDataKey && (
          <ZAxis 
            type="number" 
            dataKey={zDataKey} 
            range={[30, 300]} 
            name={zDataKey} 
          />
        )}
        <Tooltip 
          cursor={{strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.1)'}}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--popover))', 
            borderColor: 'hsl(var(--border))',
            color: 'hsl(var(--foreground))',
            fontSize: '12px',
            padding: '8px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
          formatter={(value: any, name: any) => [`${value}`, name]}
          labelFormatter={(name) => nameKey && data.find(d => d[xDataKey] === name)?.[nameKey] || name}
        />
        <Scatter 
          name="Data Points" 
          data={data} 
          fill={fill} 
          fillOpacity={0.8}
          shape="circle"
          onClick={handleClick}
          cursor={onPointClick ? 'pointer' : 'default'}
        />
      </RechartsScatterChart>
    </ResponsiveContainer>
  );
};

export default ScatterPlotChart;
