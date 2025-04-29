
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Widget as WidgetType, WidgetFilter } from '@/types/widget';
import { GaugeIcon } from 'lucide-react';
import WidgetHeader from './WidgetHeader';
import WidgetContent from './WidgetContent';
import { useWidgetActions } from './useWidgetActions';
import { useWidgetData } from '@/hooks/useWidgetData';
import { useDashboard } from '@/contexts/DashboardContext';
import WidgetFilters from '../WidgetFilters';

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
  const { globalFilters } = useDashboard();
  const { data, isLoading, lastUpdated } = useWidgetData({ 
    widget, 
    globalFilters
  });

  const {
    showFilters,
    setShowFilters,
    handleRefresh,
    handleChartElementClick,
    handleFilterChange
  } = useWidgetActions({ widgetId: widget.id, isEditing });

  // Get the available data fields for filtering
  const dataFields = React.useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  return (
    <Card className="w-full h-full overflow-hidden">
      <CardHeader className="p-3 pb-2">
        <WidgetHeader
          title={widget.title}
          lastUpdated={lastUpdated}
          isEditing={isEditing}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          handleRefresh={handleRefresh}
          onConfigure={onConfigure}
          onRemove={onRemove}
          widgetId={widget.id}
          dataFields={dataFields}
        />
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
            onFilterChange={(filters) => handleFilterChange(filters, onConfigure)}
            fields={dataFields}
          />
        )}
        <WidgetContent
          widget={widget}
          data={data}
          isLoading={isLoading}
          onChartElementClick={(elementData) => 
            handleChartElementClick(
              elementData, 
              widget.title, 
              widget.config.xDataKey
            )
          }
        />
      </CardContent>
    </Card>
  );
};

export default Widget;
