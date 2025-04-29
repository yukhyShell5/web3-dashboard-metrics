
import { WidgetType } from '@/types/widget';
import { colorSchemes } from './constants';

export const createWidgetConfig = (
  title: string,
  type: WidgetType,
  colorScheme: string,
  showLegend: boolean,
  metric: string,
  dimension: string,
  dataSource: string,
  autoRefresh: boolean,
  refreshInterval: string,
  visualizationType: string
) => {
  // Get the color array from the selected color scheme
  const colors = colorSchemes.find(scheme => scheme.id === colorScheme)?.colors || colorSchemes[0].colors;

  // Create widget configuration based on the current state
  return {
    title,
    type,
    config: {
      colorScheme: colors,
      showLegend,
      dataKey: metric,
      xDataKey: dimension,
      dataSource,
      autoRefresh,
      refreshInterval: autoRefresh ? parseInt(refreshInterval, 10) * 1000 : undefined,
      visualizationType,
    }
  };
};
