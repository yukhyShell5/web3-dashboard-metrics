
import { useState } from 'react';
import { WidgetFilter } from '@/types/widget';
import { useDashboard } from '@/contexts/DashboardContext';

interface UseWidgetActionsProps {
  widgetId: string;
  isEditing: boolean;
}

export const useWidgetActions = ({ widgetId, isEditing }: UseWidgetActionsProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const { refreshWidget, addGlobalFilter } = useDashboard();

  const handleRefresh = () => {
    refreshWidget(widgetId);
  };

  // Handle chart element click to add global filter
  const handleChartElementClick = (elementData: any, widgetTitle: string, xDataKey: string | undefined) => {
    if (isEditing) return; // Don't add filters in edit mode
    
    // Determine the best field and value to filter on
    const xKey = xDataKey || 'name';
    
    if (elementData[xKey]) {
      // Add a filter based on the clicked element's category/name
      addGlobalFilter({
        field: xKey,
        operator: 'equals',
        value: elementData[xKey],
        label: `${widgetTitle}: ${elementData[xKey]}`,
        sourceWidgetId: widgetId,
        isActive: true
      });
    } else if (elementData.name) {
      // Fallback to 'name' property if it exists
      addGlobalFilter({
        field: 'name',
        operator: 'equals',
        value: elementData.name,
        label: `${widgetTitle}: ${elementData.name}`,
        sourceWidgetId: widgetId,
        isActive: true
      });
    }
  };

  const handleFilterChange = (filters: WidgetFilter[], onConfigure?: (id: string) => void) => {
    if (onConfigure) {
      onConfigure(widgetId);
      // In a real implementation, you would save the updated widget here
    }
  };

  return {
    showFilters,
    setShowFilters,
    handleRefresh,
    handleChartElementClick,
    handleFilterChange
  };
};
