
export type WidgetType = 'bar' | 'line' | 'pie' | 'area' | 'stat' | 'table';

export interface WidgetPosition {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  position: WidgetPosition;
  config: {
    dataSource?: string;
    dataKey?: string;
    xDataKey?: string;
    colorScheme?: string[];
    showLegend?: boolean;
    stacked?: boolean;
    [key: string]: any;
  };
}

export interface DashboardLayout {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isPrimary: boolean;
  widgets: Widget[];
}

export type DashboardMode = 'view' | 'edit';
