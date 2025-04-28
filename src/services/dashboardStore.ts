
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DashboardLayout, Widget } from '@/types/dashboard';
import { WidgetFilter } from '@/types/widget';
import { v4 as uuidv4 } from 'uuid';

interface DashboardState {
  dashboards: DashboardLayout[];
  activeDashboardId: string | null;
  setActiveDashboard: (id: string | null) => void;
  setPrimaryDashboard: (id: string) => void;
  getPrimaryDashboard: () => DashboardLayout | undefined;
  getDashboardById: (id: string) => DashboardLayout | undefined;
  addDashboard: (dashboard: Omit<DashboardLayout, 'id' | 'createdAt' | 'updatedAt' | 'widgets'>) => string;
  updateDashboard: (id: string, data: Partial<DashboardLayout>) => void;
  removeDashboard: (id: string) => void;
  addWidget: (dashboardId: string, widget: Omit<Widget, 'id'>) => string;
  updateWidget: (dashboardId: string, widgetId: string, data: Partial<Widget>) => void;
  removeWidget: (dashboardId: string, widgetId: string) => void;
  updateWidgetPositions: (dashboardId: string, layouts: Widget['position'][]) => void;
  updateWidgetFilters: (dashboardId: string, widgetId: string, filters: WidgetFilter[]) => void;
  setDashboardVariables: (dashboardId: string, variables: Record<string, any>) => void;
  setDashboardRefreshSettings: (dashboardId: string, autoRefresh: boolean, interval?: number) => void;
  exportDashboard: (id: string) => string;
  importDashboard: (jsonConfig: string) => string | null;
}

// Sample default widgets with updated types
const createDefaultWidgets = (): Widget[] => [
  {
    id: uuidv4(),
    type: 'bar',
    title: 'Transactions by Source',
    position: { i: uuidv4(), x: 0, y: 0, w: 6, h: 4, minW: 3, minH: 2 },
    config: {
      dataSource: 'transactions',
      dataKey: 'value',
      xDataKey: 'name',
      colorScheme: ['#3b82f6', '#10b981', '#f59e0b'],
      showLegend: true,
      filters: [],
      autoRefresh: false
    },
    dataSourceConfig: {
      type: 'mock',
      refreshInterval: 60000
    }
  },
  {
    id: uuidv4(),
    type: 'line',
    title: 'Alerts Over Time',
    position: { i: uuidv4(), x: 6, y: 0, w: 6, h: 4, minW: 3, minH: 2 },
    config: {
      dataSource: 'alerts',
      dataKey: 'count',
      xDataKey: 'date',
      colorScheme: ['#8b5cf6'],
      showLegend: false,
      filters: [],
      autoRefresh: true,
      refreshInterval: 30000
    }
  },
  {
    id: uuidv4(),
    type: 'pie',
    title: 'Resource Distribution',
    position: { i: uuidv4(), x: 0, y: 4, w: 4, h: 4, minW: 2, minH: 2 },
    config: {
      dataSource: 'resources',
      dataKey: 'value',
      xDataKey: 'name',
      colorScheme: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
      showLegend: true,
      filters: []
    }
  },
  {
    id: uuidv4(),
    type: 'gauge',
    title: 'System Health',
    position: { i: uuidv4(), x: 4, y: 4, w: 4, h: 4, minW: 2, minH: 3 },
    config: {
      dataSource: 'system',
      min: 0,
      max: 100,
      colorScheme: ['#10b981', '#f59e0b', '#ef4444'],
      autoRefresh: true,
      refreshInterval: 15000
    }
  },
  {
    id: uuidv4(),
    type: 'stat',
    title: 'Total Transactions',
    position: { i: uuidv4(), x: 8, y: 4, w: 4, h: 2, minW: 2, minH: 1 },
    config: {
      dataSource: 'stats',
      value: 'totalTransactions',
      icon: 'BarChart2',
      trend: '+12.5%',
      trendDirection: 'up'
    }
  }
];

// Initial dashboards with updated properties
const initialDashboards: DashboardLayout[] = [
  {
    id: '1',
    title: 'Web3 Security Overview',
    description: 'High-level security metrics for monitored addresses',
    widgets: createDefaultWidgets(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPrimary: true,
    autoRefresh: false,
    refreshInterval: 60000,
    variables: {
      timeRange: '24h',
      walletAddress: '0x1234...'
    }
  },
  {
    id: '2',
    title: 'Smart Contract Monitor',
    description: 'Detailed analytics for smart contract interactions',
    widgets: createDefaultWidgets().slice(0, 3),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPrimary: false,
    autoRefresh: false,
    variables: {
      contractAddress: '0xabcd...'
    }
  }
];

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      dashboards: initialDashboards,
      activeDashboardId: null,
      
      setActiveDashboard: (id) => {
        set({ activeDashboardId: id });
      },
      
      setPrimaryDashboard: (id) => {
        set({
          dashboards: get().dashboards.map(dashboard => ({
            ...dashboard,
            isPrimary: dashboard.id === id
          }))
        });
      },
      
      getPrimaryDashboard: () => {
        return get().dashboards.find(dashboard => dashboard.isPrimary);
      },
      
      getDashboardById: (id) => {
        return get().dashboards.find(dashboard => dashboard.id === id);
      },
      
      addDashboard: (dashboard) => {
        const id = uuidv4();
        const newDashboard: DashboardLayout = {
          ...dashboard,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          widgets: [],
          variables: {},
          autoRefresh: false
        };
        
        set({
          dashboards: [...get().dashboards, newDashboard]
        });
        
        return id;
      },
      
      updateDashboard: (id, data) => {
        set({
          dashboards: get().dashboards.map(dashboard => 
            dashboard.id === id 
              ? { 
                  ...dashboard, 
                  ...data, 
                  updatedAt: new Date().toISOString() 
                }
              : dashboard
          )
        });
      },
      
      removeDashboard: (id) => {
        set({
          dashboards: get().dashboards.filter(dashboard => dashboard.id !== id)
        });
      },
      
      addWidget: (dashboardId, widget) => {
        const widgetId = uuidv4();
        const dashboards = get().dashboards.map(dashboard => {
          if (dashboard.id === dashboardId) {
            return {
              ...dashboard,
              widgets: [
                ...dashboard.widgets,
                { 
                  ...widget, 
                  id: widgetId,
                  position: {
                    ...widget.position,
                    i: widgetId
                  }
                }
              ],
              updatedAt: new Date().toISOString()
            };
          }
          return dashboard;
        });
        
        set({ dashboards });
        return widgetId;
      },
      
      updateWidget: (dashboardId, widgetId, data) => {
        const dashboards = get().dashboards.map(dashboard => {
          if (dashboard.id === dashboardId) {
            return {
              ...dashboard,
              widgets: dashboard.widgets.map(widget => 
                widget.id === widgetId 
                  ? { ...widget, ...data }
                  : widget
              ),
              updatedAt: new Date().toISOString()
            };
          }
          return dashboard;
        });
        
        set({ dashboards });
      },
      
      removeWidget: (dashboardId, widgetId) => {
        const dashboards = get().dashboards.map(dashboard => {
          if (dashboard.id === dashboardId) {
            return {
              ...dashboard,
              widgets: dashboard.widgets.filter(widget => widget.id !== widgetId),
              updatedAt: new Date().toISOString()
            };
          }
          return dashboard;
        });
        
        set({ dashboards });
      },
      
      updateWidgetPositions: (dashboardId, layouts) => {
        const dashboards = get().dashboards.map(dashboard => {
          if (dashboard.id === dashboardId) {
            return {
              ...dashboard,
              widgets: dashboard.widgets.map(widget => {
                const layout = layouts.find(l => l.i === widget.id);
                if (layout) {
                  return {
                    ...widget,
                    position: {
                      ...widget.position,
                      x: layout.x,
                      y: layout.y,
                      w: layout.w,
                      h: layout.h
                    }
                  };
                }
                return widget;
              }),
              updatedAt: new Date().toISOString()
            };
          }
          return dashboard;
        });
        
        set({ dashboards });
      },
      
      updateWidgetFilters: (dashboardId, widgetId, filters) => {
        const dashboards = get().dashboards.map(dashboard => {
          if (dashboard.id === dashboardId) {
            return {
              ...dashboard,
              widgets: dashboard.widgets.map(widget => {
                if (widget.id === widgetId) {
                  return {
                    ...widget,
                    config: {
                      ...widget.config,
                      filters
                    }
                  };
                }
                return widget;
              }),
              updatedAt: new Date().toISOString()
            };
          }
          return dashboard;
        });
        
        set({ dashboards });
      },
      
      setDashboardVariables: (dashboardId, variables) => {
        const dashboards = get().dashboards.map(dashboard => {
          if (dashboard.id === dashboardId) {
            return {
              ...dashboard,
              variables: {
                ...dashboard.variables,
                ...variables
              },
              updatedAt: new Date().toISOString()
            };
          }
          return dashboard;
        });
        
        set({ dashboards });
      },
      
      setDashboardRefreshSettings: (dashboardId, autoRefresh, interval) => {
        const dashboards = get().dashboards.map(dashboard => {
          if (dashboard.id === dashboardId) {
            return {
              ...dashboard,
              autoRefresh,
              ...(interval !== undefined ? { refreshInterval: interval } : {}),
              updatedAt: new Date().toISOString()
            };
          }
          return dashboard;
        });
        
        set({ dashboards });
      },
      
      exportDashboard: (id) => {
        const dashboard = get().getDashboardById(id);
        if (!dashboard) return '';
        return JSON.stringify(dashboard, null, 2);
      },
      
      importDashboard: (jsonConfig) => {
        try {
          const dashboard = JSON.parse(jsonConfig) as DashboardLayout;
          // Validate the dashboard structure here
          if (!dashboard.title || !dashboard.widgets) {
            throw new Error('Invalid dashboard configuration');
          }
          
          const id = uuidv4();
          const newDashboard: DashboardLayout = {
            ...dashboard,
            id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPrimary: false,
            variables: dashboard.variables || {},
            autoRefresh: dashboard.autoRefresh || false
          };
          
          set({
            dashboards: [...get().dashboards, newDashboard]
          });
          
          return id;
        } catch (error) {
          console.error('Failed to import dashboard:', error);
          return null;
        }
      }
    }),
    {
      name: 'dashboard-storage',
    }
  )
);

export const getAllDashboards = () => useDashboardStore.getState().dashboards;
export const getPrimaryDashboard = () => useDashboardStore.getState().getPrimaryDashboard();
export const getDashboardById = (id: string) => useDashboardStore.getState().getDashboardById(id);
