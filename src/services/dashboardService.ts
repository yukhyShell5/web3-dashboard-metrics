
// This service manages dashboards across the application

import { create } from 'zustand';

export type ChartType = 'bar' | 'line' | 'pie' | 'area';

export interface LayoutItem {
  id: string;
  type: ChartType;
  title: string;
  size?: {
    width?: number;
    height?: number;
  };
  chartConfig?: any;
}

export interface Dashboard {
  id: string;
  title: string;
  description: string;
  charts: number;
  createdAt: string;
  updatedAt: string;
  isPrimary: boolean;
  layout?: LayoutItem[];
}

interface DashboardState {
  dashboards: Dashboard[];
  selectedDashboard: string | null;
  setPrimaryDashboard: (id: string) => void;
  getPrimaryDashboard: () => Dashboard | undefined;
  addDashboard: (dashboard: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDashboard: (id: string, data: Partial<Dashboard>) => void;
  removeDashboard: (id: string) => void;
  moveItem: (dashboardId: string, sourceIndex: number, destinationIndex: number) => void;
}

// Mock data
const initialDashboards: Dashboard[] = [
  {
    id: '1',
    title: 'Web3 Security Overview',
    description: 'High-level security metrics for monitored addresses',
    charts: 8,
    createdAt: '2023-07-15T10:30:00Z',
    updatedAt: '2023-08-10T14:22:00Z',
    isPrimary: true,
  },
  {
    id: '2',
    title: 'Smart Contract Monitor',
    description: 'Detailed analytics for smart contract interactions',
    charts: 6,
    createdAt: '2023-07-20T11:45:00Z',
    updatedAt: '2023-08-09T09:15:00Z',
    isPrimary: false,
  },
  {
    id: '3',
    title: 'Transaction Analysis',
    description: 'Deep dive into transaction patterns and anomalies',
    charts: 10,
    createdAt: '2023-07-25T15:20:00Z',
    updatedAt: '2023-08-08T16:30:00Z',
    isPrimary: false,
  },
  {
    id: '4',
    title: 'DeFi Risk Monitor',
    description: 'Monitor DeFi protocols and risk exposure',
    charts: 7,
    createdAt: '2023-08-01T09:10:00Z',
    updatedAt: '2023-08-07T11:45:00Z',
    isPrimary: false,
  },
];

export const useDashboardStore = create<DashboardState>((set, get) => ({
  dashboards: initialDashboards,
  selectedDashboard: null,
  
  setPrimaryDashboard: (id: string) => {
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
  
  addDashboard: (dashboard) => {
    const newDashboard: Dashboard = {
      ...dashboard,
      id: String(get().dashboards.length + 1), // In a real app, use a proper ID generator
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    set({
      dashboards: [...get().dashboards, newDashboard]
    });
  },
  
  updateDashboard: (id, data) => {
    set({
      dashboards: get().dashboards.map(dashboard => 
        dashboard.id === id 
          ? { ...dashboard, ...data, updatedAt: new Date().toISOString() }
          : dashboard
      )
    });
  },
  
  removeDashboard: (id) => {
    set({
      dashboards: get().dashboards.filter(dashboard => dashboard.id !== id)
    });
  },
  
  moveItem: (dashboardId, sourceIndex, destinationIndex) => {
    const dashboard = get().dashboards.find(d => d.id === dashboardId);
    
    if (dashboard?.layout) {
      const newLayout = [...dashboard.layout];
      const [removed] = newLayout.splice(sourceIndex, 1);
      newLayout.splice(destinationIndex, 0, removed);
      
      set({
        dashboards: get().dashboards.map(d => 
          d.id === dashboardId 
            ? { ...d, layout: newLayout, updatedAt: new Date().toISOString() } 
            : d
        )
      });
    }
  },
}));

// Export utility functions for other components to use
export const getPrimaryDashboard = () => useDashboardStore.getState().getPrimaryDashboard();
export const getAllDashboards = () => useDashboardStore.getState().dashboards;
