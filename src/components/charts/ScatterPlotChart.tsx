
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
}

const ScatterPlotChart: React.FC<ScatterPlotChartProps> = ({
  data,
  xDataKey,
  yDataKey,
  zDataKey,
  nameKey,
  height = 300,
  fill = '#8884d8'
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis 
          type="number" 
          dataKey={xDataKey} 
          name={xDataKey} 
          tick={{ fill: '#FFFFFF' }}
          axisLine={{ stroke: 'rgba(255, 255, 255, 0.3)' }}
        />
        <YAxis 
          type="number" 
          dataKey={yDataKey} 
          name={yDataKey} 
          tick={{ fill: '#FFFFFF' }}
          axisLine={{ stroke: 'rgba(255, 255, 255, 0.3)' }}
        />
        {zDataKey && (
          <ZAxis 
            type="number" 
            dataKey={zDataKey} 
            range={[50, 400]} 
            name={zDataKey} 
          />
        )}
        <Tooltip 
          cursor={{strokeDasharray: '3 3'}}
          formatter={(value: any, name: any) => [`${value}`, name]}
          labelFormatter={(name) => nameKey && data.find(d => d[xDataKey] === name)?.[nameKey] || name}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--popover))', 
            borderColor: 'hsl(var(--border))',
            color: 'hsl(var(--foreground))'
          }}
        />
        <Legend />
        <Scatter 
          name="Data Points" 
          data={data} 
          fill={fill} 
          shape="circle"
        />
      </RechartsScatterChart>
    </ResponsiveContainer>
  );
};

export default ScatterPlotChart;
