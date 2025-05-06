
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Widget as WidgetType, WidgetFilter } from '@/types/widget';
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
    <Card className="w-full h-full overflow-hidden bg-card/50 border border-border/50 shadow-sm">
      <CardContent className="p-3">
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
        
        {showFilters && !isEditing && dataFields.length > 0 && (
          <WidgetFilters 
            filters={widget.config.filters || []} 
            onFilterChange={(filters) => handleFilterChange(filters, onConfigure)}
            fields={dataFields}
          />
        )}
        
        <div className="mt-2 h-full">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default Widget;
