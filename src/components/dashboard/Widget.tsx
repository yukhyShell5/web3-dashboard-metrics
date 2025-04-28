
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoveIcon, XIcon, SettingsIcon, RefreshCwIcon, GaugeIcon, FilterIcon } from 'lucide-react';
import { Widget as WidgetType, WidgetFilter } from '@/types/widget';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import StatCard from '@/components/StatCard';
import GaugeChart from '@/components/charts/GaugeChart';
import HeatmapChart from '@/components/charts/HeatmapChart';
import ScatterPlotChart from '@/components/charts/ScatterPlotChart';
import { useWidgetData } from '@/hooks/useWidgetData';
import { useDashboard } from '@/contexts/DashboardContext';
import WidgetFilters from './WidgetFilters';

interface WidgetProps {
  widget: WidgetType;
  isEditing: boolean;
  onRemove?: (id: string) => void;
  onConfigure?: (id: string) => void;
}

const Widget: React.FC<WidgetProps> = ({
  widget,
  isEditing,
  onRemove,
  onConfigure
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const { refreshWidget } = useDashboard();
  const { data, isLoading, refresh, lastUpdated } = useWidgetData({ widget });

  // Filter the data based on widget filters
  const filteredData = React.useMemo(() => {
    if (!widget.config.filters || widget.config.filters.length === 0) {
      return data;
    }

    return data.filter(item => {
      return widget.config.filters!.every(filter => {
        if (!filter.isActive) return true;
        
        const value = item[filter.field];
        switch (filter.operator) {
          case 'equals':
            return value == filter.value; // Use == to allow type coercion
          case 'contains':
            return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
          case 'gt':
            return Number(value) > Number(filter.value);
          case 'lt':
            return Number(value) < Number(filter.value);
          case 'between':
            const [min, max] = String(filter.value).split(',').map(Number);
            return Number(value) >= min && Number(value) <= max;
          default:
            return true;
        }
      });
    });
  }, [data, widget.config.filters]);

  const handleFilterChange = (filters: WidgetFilter[]) => {
    if (onConfigure) {
      const updatedWidget = {
        ...widget,
        config: {
          ...widget.config,
          filters
        }
      };
      onConfigure(widget.id);
      // In a real implementation, you would save the updated widget here
    }
  };

  // Get the available data fields for filtering
  const dataFields = React.useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const handleRefresh = () => {
    refresh();
    refreshWidget(widget.id);
  };

  const renderWidgetContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    switch (widget.type) {
      case 'bar':
        return (
          <BarChart
            data={filteredData}
            xDataKey={widget.config.xDataKey || "name"}
            height={widget.position.h * 50}
            bars={[{ dataKey: widget.config.dataKey || 'value', name: 'Value', fill: widget.config.colorScheme?.[0] || '#3b82f6' }]}
            stacked={widget.config.stacked}
          />
        );
      case 'line':
        return (
          <LineChart
            data={filteredData}
            xDataKey={widget.config.xDataKey || "day"}
            height={widget.position.h * 50}
            lines={[{ dataKey: widget.config.dataKey || 'value', name: 'Value', stroke: widget.config.colorScheme?.[0] || '#8b5cf6' }]}
          />
        );
      case 'pie':
        return (
          <PieChart
            data={filteredData}
            dataKey={widget.config.dataKey || "value"}
            nameKey={widget.config.xDataKey || "name"}
            height={widget.position.h * 50}
            colors={widget.config.colorScheme || ['#3b82f6', '#8b5cf6', '#10b981', '#ef4444']}
          />
        );
      case 'gauge':
        const gaugeValue = filteredData.length > 0 ? filteredData[0].value || 0 : 0;
        return (
          <GaugeChart
            value={gaugeValue}
            min={widget.config.min || 0}
            max={widget.config.max || 100}
            colors={widget.config.colorScheme || ['#10b981', '#f59e0b', '#ef4444']}
            height={widget.position.h * 50}
          />
        );
      case 'heatmap':
        return (
          <HeatmapChart
            data={filteredData}
            height={widget.position.h * 50}
            colorRange={widget.config.colorScheme || ['#e5f5e0', '#a1d99b', '#31a354']}
          />
        );
      case 'scatter':
        return (
          <ScatterPlotChart
            data={filteredData}
            xDataKey={widget.config.xDataKey || "x"}
            yDataKey={widget.config.dataKey || "y"}
            zDataKey={widget.config.zDataKey || "z"}
            nameKey={widget.config.nameKey || "name"}
            height={widget.position.h * 50}
            fill={widget.config.colorScheme?.[0] || '#8884d8'}
          />
        );
      case 'stat':
        const value = widget.config.value && data.length > 0 ? data[0][widget.config.value] || '0' : '0';
        return (
          <StatCard
            title={widget.title}
            value={value}
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

  return (
    <Card className="w-full h-full overflow-hidden">
      <CardHeader className="p-3 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
          <div className="flex items-center space-x-1">
            {!isEditing && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={handleRefresh}
                aria-label="Refresh widget"
              >
                <RefreshCwIcon className="h-3 w-3" />
              </Button>
            )}
            {!isEditing && dataFields.length > 0 && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => setShowFilters(!showFilters)}
                aria-label="Filter data"
              >
                <FilterIcon className="h-3 w-3" />
              </Button>
            )}
            {isEditing && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 cursor-move"
                  aria-label="Move widget"
                >
                  <MoveIcon className="h-3 w-3" />
                </Button>
                {onConfigure && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => onConfigure(widget.id)}
                    aria-label="Configure widget"
                  >
                    <SettingsIcon className="h-3 w-3" />
                  </Button>
                )}
                {onRemove && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => onRemove(widget.id)}
                    aria-label="Remove widget"
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        {lastUpdated && (
          <div className="text-xs text-muted-foreground mt-1">
            Updated: {new Date(lastUpdated).toLocaleTimeString()}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-3 pt-0">
        {showFilters && !isEditing && dataFields.length > 0 && (
          <WidgetFilters 
            filters={widget.config.filters || []} 
            onFilterChange={handleFilterChange}
            fields={dataFields}
          />
        )}
        {renderWidgetContent()}
      </CardContent>
    </Card>
  );
};

export default Widget;
