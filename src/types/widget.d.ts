
import { ReactNode } from 'react';

export type WidgetType = 
  | 'bar' 
  | 'line' 
  | 'pie' 
  | 'area' 
  | 'stat' 
  | 'table'
  | 'heatmap'
  | 'scatter'
  | 'gauge';

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

export interface WidgetDataSource {
  type: 'mock' | 'api' | 'websocket' | 'realtime';
  url?: string;
  refreshInterval?: number; // in milliseconds
  lastRefreshed?: string; // ISO date string
  transformFunction?: string; // JavaScript function as string to transform the data
  mockData?: any;
}

export interface WidgetFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'between';
  value: any;
  isActive: boolean;
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
    filters?: WidgetFilter[];
    autoRefresh?: boolean;
    refreshInterval?: number; // in milliseconds
    [key: string]: any;
  };
  dataSourceConfig?: WidgetDataSource;
}

export interface WidgetSettings {
  id: string;
  name: string;
  component: React.ComponentType<{ widget: Widget; onChange: (updated: Widget) => void }>;
}

export interface WidgetConfig {
  type: WidgetType;
  name: string;
  icon: ReactNode;
  component: React.ComponentType<{ widget: Widget; isEditing: boolean }>;
  defaultSize: { w: number; h: number };
  settings: WidgetSettings[];
}
