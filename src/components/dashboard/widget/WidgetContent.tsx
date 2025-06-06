
import React from 'react';
import { GaugeIcon } from 'lucide-react';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import StatCard from '@/components/StatCard';
import GaugeChart from '@/components/charts/GaugeChart';
import HeatmapChart from '@/components/charts/HeatmapChart';
import ScatterPlotChart from '@/components/charts/ScatterPlotChart';
import { Widget as WidgetType } from '@/types/widget';

interface WidgetContentProps {
  widget: WidgetType;
  data: any[];
  isLoading: boolean;
  onChartElementClick: (elementData: any) => void;
}

const WidgetContent: React.FC<WidgetContentProps> = ({
  widget,
  data,
  isLoading,
  onChartElementClick
}) => {
  const getChartHeight = () => {
    const baseHeight = widget.position.h * 80; // Increase multiplier for taller charts
    return Math.max(baseHeight, 150); // Minimum height to ensure visibility
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  switch (widget.type) {
    case 'bar':
      return (
        <div className="h-full w-full">
          <BarChart
            data={data}
            xDataKey={widget.config.xDataKey || "name"}
            height="100%"
            bars={[{ dataKey: widget.config.dataKey || 'value', name: 'Value', fill: widget.config.colorScheme?.[0] || '#3b82f6' }]}
            stacked={widget.config.stacked}
            onElementClick={onChartElementClick}
          />
        </div>
      );
    case 'line':
      return (
        <div className="h-full w-full">
          <LineChart
            data={data}
            xDataKey={widget.config.xDataKey || "day"}
            height="100%"
            lines={[{ dataKey: widget.config.dataKey || 'value', name: 'Value', stroke: widget.config.colorScheme?.[0] || '#8b5cf6' }]}
            onPointClick={onChartElementClick}
          />
        </div>
      );
    case 'pie':
      return (
        <div className="h-full w-full">
          <PieChart
            data={data}
            dataKey={widget.config.dataKey || "value"}
            nameKey={widget.config.xDataKey || "name"}
            height="100%"
            colors={widget.config.colorScheme || ['#3b82f6', '#8b5cf6', '#10b981', '#ef4444']}
            onSectorClick={onChartElementClick}
          />
        </div>
      );
    case 'gauge':
      return (
        <div className="h-full w-full">
          <GaugeChart
            value={data.length > 0 ? data[0].value || 0 : 0}
            min={widget.config.min || 0}
            max={widget.config.max || 100}
            colors={widget.config.colorScheme || ['#10b981', '#f59e0b', '#ef4444']}
            height="100%"
            thickness={25}
          />
        </div>
      );
    case 'heatmap':
      return (
        <div className="h-full w-full">
          <HeatmapChart
            data={data}
            height="100%"
            colorRange={widget.config.colorScheme || ['#e5f5e0', '#a1d99b', '#31a354']}
            onCellClick={onChartElementClick}
          />
        </div>
      );
    case 'scatter':
      return (
        <div className="h-full w-full">
          <ScatterPlotChart
            data={data}
            xDataKey={widget.config.xDataKey || "x"}
            yDataKey={widget.config.dataKey || "y"}
            zDataKey={widget.config.zDataKey || "z"}
            nameKey={widget.config.nameKey || "name"}
            height="100%"
            fill={widget.config.colorScheme?.[0] || '#8884d8'}
            onPointClick={onChartElementClick}
          />
        </div>
      );
    case 'stat':
      return (
        <StatCard
          title={widget.title}
          value={widget.config.value && data.length > 0 ? data[0][widget.config.value] || '0' : '0'}
          icon={widget.config.icon ? <GaugeIcon className="h-4 w-4" /> : null}
          change={widget.config.trend ? {
            value: parseFloat(widget.config.trend?.replace('%', '')),
            positive: widget.config.trendDirection === 'up'
          } : undefined}
        />
      );
    default:
      return <div>Unsupported widget type</div>;
  }
};

export default WidgetContent;
