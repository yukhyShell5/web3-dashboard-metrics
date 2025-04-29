
import { 
  BarChart2Icon, 
  LineChartIcon, 
  PieChartIcon, 
  GaugeIcon, 
  LayoutDashboardIcon, 
  TableIcon, 
  GridIcon, 
  ScatterChartIcon 
} from 'lucide-react';
import { WidgetType } from '@/types/widget';

// Widget type options with their respective icons
export const widgetTypes = [
  { type: 'bar' as WidgetType, title: 'Bar Chart', icon: BarChart2Icon },
  { type: 'line' as WidgetType, title: 'Line Chart', icon: LineChartIcon },
  { type: 'pie' as WidgetType, title: 'Pie Chart', icon: PieChartIcon },
  { type: 'stat' as WidgetType, title: 'Stat Card', icon: LayoutDashboardIcon },
  { type: 'gauge' as WidgetType, title: 'Gauge', icon: GaugeIcon },
  { type: 'table' as WidgetType, title: 'Table', icon: TableIcon },
  { type: 'heatmap' as WidgetType, title: 'Heatmap', icon: GridIcon },
  { type: 'scatter' as WidgetType, title: 'Scatter Plot', icon: ScatterChartIcon },
];

// Color scheme options
export const colorSchemes = [
  { id: 'blue', colors: ['#3b82f6', '#60a5fa', '#93c5fd'] },
  { id: 'green', colors: ['#10b981', '#34d399', '#6ee7b7'] },
  { id: 'purple', colors: ['#8b5cf6', '#a78bfa', '#c4b5fd'] },
  { id: 'orange', colors: ['#f59e0b', '#fbbf24', '#fcd34d'] },
  { id: 'red', colors: ['#ef4444', '#f87171', '#fca5a5'] },
  { id: 'multi', colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'] },
];
