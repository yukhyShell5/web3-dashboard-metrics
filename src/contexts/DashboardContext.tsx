
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { DashboardContextType } from '@/types/dashboard';
import { WidgetFilter } from '@/types/widget';
import { v4 as uuidv4 } from 'uuid';

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
  initialVariables?: Record<string, any>;
  initialFilters?: WidgetFilter[];
  dashboardId?: string;
  onFiltersChange?: (filters: WidgetFilter[]) => void;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
  children,
  initialVariables = {},
  initialFilters = [],
  dashboardId,
  onFiltersChange
}) => {
  const [variables, setVariablesState] = useState<Record<string, any>>(initialVariables);
  const [refreshTriggers, setRefreshTriggers] = useState<Record<string, number>>({});
  const [globalFilters, setGlobalFilters] = useState<WidgetFilter[]>(initialFilters);

  const setVariable = useCallback((key: string, value: any) => {
    setVariablesState(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const refreshWidget = useCallback((widgetId: string) => {
    setRefreshTriggers(prev => ({
      ...prev,
      [widgetId]: Date.now()
    }));
  }, []);

  const refreshAllWidgets = useCallback(() => {
    setRefreshTriggers(prev => {
      const now = Date.now();
      const newTriggers: Record<string, number> = {};
      
      // Set all existing widgets to refresh
      Object.keys(prev).forEach(widgetId => {
        newTriggers[widgetId] = now;
      });
      
      return newTriggers;
    });
  }, []);

  // Global filters management
  const addGlobalFilter = useCallback((filter: Omit<WidgetFilter, 'id'>) => {
    const newFilter = {
      ...filter,
      id: uuidv4(),
      isActive: true
    };
    
    setGlobalFilters(prev => {
      // Check if a similar filter already exists
      const existingFilterIndex = prev.findIndex(f => 
        f.field === filter.field && f.value === filter.value && f.operator === filter.operator
      );
      
      if (existingFilterIndex >= 0) {
        // Update the existing filter instead of adding a new one
        const updatedFilters = [...prev];
        updatedFilters[existingFilterIndex] = {
          ...updatedFilters[existingFilterIndex],
          isActive: true
        };
        
        if (onFiltersChange && dashboardId) {
          onFiltersChange(updatedFilters);
        }
        
        return updatedFilters;
      }
      
      const updatedFilters = [...prev, newFilter];
      
      if (onFiltersChange && dashboardId) {
        onFiltersChange(updatedFilters);
      }
      
      return updatedFilters;
    });
  }, [onFiltersChange, dashboardId]);

  const updateGlobalFilter = useCallback((id: string, changes: Partial<WidgetFilter>) => {
    setGlobalFilters(prev => {
      const updatedFilters = prev.map(filter => 
        filter.id === id ? { ...filter, ...changes } : filter
      );
      
      if (onFiltersChange && dashboardId) {
        onFiltersChange(updatedFilters);
      }
      
      return updatedFilters;
    });
  }, [onFiltersChange, dashboardId]);

  const removeGlobalFilter = useCallback((id: string) => {
    setGlobalFilters(prev => {
      const updatedFilters = prev.filter(filter => filter.id !== id);
      
      if (onFiltersChange && dashboardId) {
        onFiltersChange(updatedFilters);
      }
      
      return updatedFilters;
    });
  }, [onFiltersChange, dashboardId]);

  const clearGlobalFilters = useCallback(() => {
    setGlobalFilters([]);
    
    if (onFiltersChange && dashboardId) {
      onFiltersChange([]);
    }
  }, [onFiltersChange, dashboardId]);

  const value: DashboardContextType = {
    variables,
    setVariable,
    refreshWidget,
    refreshAllWidgets,
    globalFilters,
    addGlobalFilter,
    updateGlobalFilter,
    removeGlobalFilter,
    clearGlobalFilters
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  
  return context;
};
