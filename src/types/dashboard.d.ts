
import { Widget, WidgetFilter } from './widget';

export interface DashboardLayout {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isPrimary: boolean;
  widgets: Widget[];
  variables?: Record<string, any>; // Global variables that can be used across widgets
  refreshInterval?: number; // Global refresh interval in milliseconds
  autoRefresh?: boolean; // Whether to auto refresh the entire dashboard
  globalFilters?: WidgetFilter[]; // Global filters that apply to all widgets
}

export type DashboardMode = 'view' | 'edit';

export interface DashboardContextType {
  variables: Record<string, any>;
  setVariable: (key: string, value: any) => void;
  refreshWidget: (widgetId: string) => void;
  refreshAllWidgets: () => void;
  // Adding functions for global filters
  globalFilters: WidgetFilter[];
  addGlobalFilter: (filter: Omit<WidgetFilter, 'id'>) => void;
  updateGlobalFilter: (id: string, changes: Partial<WidgetFilter>) => void;
  removeGlobalFilter: (id: string) => void;
  clearGlobalFilters: () => void;
}

// Re-export Widget type from widget.d.ts to make it available
export { Widget, WidgetType, WidgetFilter } from './widget';
