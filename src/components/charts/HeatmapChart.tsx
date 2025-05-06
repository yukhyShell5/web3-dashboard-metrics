
import React from 'react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis,
  Tooltip, 
  Cell
} from 'recharts';

interface HeatmapChartProps {
  data: Array<{
    day: string;
    hour: number;
    value: number;
  }>;
  height?: number | string;
  colorRange?: string[];
  onCellClick?: (data: any) => void;
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({
  data,
  height = 300,
  colorRange = ['#e5f5e0', '#a1d99b', '#31a354'],
  onCellClick
}) => {
  // Find the min and max values for color scaling
  const minValue = Math.min(...data.map(item => item.value));
  const maxValue = Math.max(...data.map(item => item.value));
  
  // Function to get color based on value
  const getColor = (value: number) => {
    if (maxValue === minValue) return colorRange[1]; // Return middle color if all values are the same
    
    const normalizedValue = (value - minValue) / (maxValue - minValue);
    const index = Math.floor(normalizedValue * (colorRange.length - 1));
    const lowerColor = colorRange[index];
    const upperColor = colorRange[index + 1] || lowerColor;
    
    // Calculate the remainder for fine-grained interpolation
    const remainder = normalizedValue * (colorRange.length - 1) - index;
    
    // Simple color interpolation
    return interpolateColor(lowerColor, upperColor, remainder);
  };
  
  const uniqueDays = [...new Set(data.map(item => item.day))];
  const uniqueHours = [...new Set(data.map(item => item.hour))].sort((a, b) => a - b);

  const handleClick = (entry: any) => {
    if (onCellClick) {
      onCellClick(entry);
    }
  };
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart
        margin={{
          top: 10,
          right: 0,
          bottom: 10,
          left: 0,
        }}
      >
        <XAxis 
          type="category" 
          dataKey="hour" 
          name="Hour" 
          tick={{ fontSize: 10 }}
          axisLine={{ stroke: 'rgba(255, 255, 255, 0.05)' }}
          tickLine={false}
          domain={[0, 23]} 
          ticks={[0, 6, 12, 18, 23]}
          tickFormatter={(hour) => `${hour}h`}
          height={10}
        />
        <YAxis 
          type="category" 
          dataKey="day" 
          name="Day" 
          width={25}
          tick={{ fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          domain={uniqueDays}
        />
        <ZAxis 
          type="number" 
          dataKey="value" 
          name="Value" 
          range={[40, 40]} 
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
          formatter={(value: any) => [`${value}`, 'Value']}
          labelFormatter={(hour) => `${data.find(d => d.hour === hour)?.day}, ${hour}h`}
        />
        <Scatter 
          data={data} 
          shape="square"
          onClick={handleClick}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={getColor(entry.value)} 
              style={{ cursor: onCellClick ? 'pointer' : 'default' }}
            />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
};

// Helper function to interpolate between two hex colors
function interpolateColor(color1: string, color2: string, factor: number): string {
  if (factor <= 0) return color1;
  if (factor >= 1) return color2;

  // Parse hex colors to rgb
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  // Interpolate
  const r = Math.round(r1 * (1 - factor) + r2 * factor);
  const g = Math.round(g1 * (1 - factor) + g2 * factor);
  const b = Math.round(b1 * (1 - factor) + b2 * factor);

  // Convert back to hex
  return `#${((r << 16) + (g << 8) + b).toString(16).padStart(6, '0')}`;
}

export default HeatmapChart;
