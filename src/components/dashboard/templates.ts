
import { Widget, WidgetType } from '@/types/dashboard';
import { v4 as uuidv4 } from 'uuid';
import { LayoutDashboardIcon, LineChartIcon, PlusIcon } from 'lucide-react';
import React from 'react';

// Dashboard templates
export const dashboardTemplates = [
  {
    id: 'security',
    title: 'Web3 Security Dashboard',
    description: 'Monitor security metrics for blockchain activities',
    icon: <LayoutDashboardIcon className="h-12 w-12" />,
    widgets: [
      {
        id: uuidv4(),
        type: 'bar' as WidgetType,
        title: 'Transactions by Address',
        position: { i: uuidv4(), x: 0, y: 0, w: 6, h: 4, minW: 3, minH: 2 },
        config: {
          colorScheme: ['#3b82f6', '#10b981', '#f59e0b'],
          showLegend: true
        }
      },
      {
        id: uuidv4(),
        type: 'line' as WidgetType,
        title: 'Alert Trend',
        position: { i: uuidv4(), x: 6, y: 0, w: 6, h: 4, minW: 3, minH: 2 },
        config: {
          colorScheme: ['#8b5cf6'],
          showLegend: false
        }
      },
      {
        id: uuidv4(),
        type: 'pie' as WidgetType,
        title: 'Distribution by Chain',
        position: { i: uuidv4(), x: 0, y: 4, w: 4, h: 4, minW: 2, minH: 2 },
        config: {
          colorScheme: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
          showLegend: true
        }
      }
    ]
  },
  {
    id: 'metrics',
    title: 'Performance Metrics',
    description: 'Track key performance indicators',
    icon: <LineChartIcon className="h-12 w-12" />,
    widgets: [
      {
        id: uuidv4(),
        type: 'stat' as WidgetType,
        title: 'Total Transactions',
        position: { i: uuidv4(), x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 1 },
        config: {
          value: 'totalTransactions',
          trend: '+12.5%',
          trendDirection: 'up'
        }
      },
      {
        id: uuidv4(),
        type: 'stat' as WidgetType,
        title: 'Active Alerts',
        position: { i: uuidv4(), x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 1 },
        config: {
          value: 'activeAlerts',
          trend: '-5.2%',
          trendDirection: 'down'
        }
      },
      {
        id: uuidv4(),
        type: 'line' as WidgetType,
        title: 'Transaction Trend',
        position: { i: uuidv4(), x: 0, y: 2, w: 6, h: 4, minW: 3, minH: 2 },
        config: {
          colorScheme: ['#3b82f6'],
          showLegend: false
        }
      }
    ]
  },
  {
    id: 'empty',
    title: 'Empty Dashboard',
    description: 'Start from scratch',
    icon: <PlusIcon className="h-12 w-12" />,
    widgets: []
  }
];

// Widget templates
export const widgetTemplates = [
  { id: 'bar1', type: 'bar' as WidgetType, title: 'Transactions by Address', icon: <BarChart2Icon className="h-6 w-6" /> },
  { id: 'line1', type: 'line' as WidgetType, title: 'Alert Trend', icon: <LineChartIcon className="h-6 w-6" /> },
  { id: 'pie1', type: 'pie' as WidgetType, title: 'Distribution by Chain', icon: <PieChartIcon className="h-6 w-6" /> },
  { id: 'bar2', type: 'bar' as WidgetType, title: 'Smart Contract Calls', icon: <BarChart2Icon className="h-6 w-6" /> },
];

// Missing imports
import { BarChart2Icon, PieChartIcon } from 'lucide-react';
