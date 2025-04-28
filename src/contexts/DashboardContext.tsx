
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { DashboardContextType } from '@/types/dashboard';

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
  initialVariables?: Record<string, any>;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
  children,
  initialVariables = {}
}) => {
  const [variables, setVariablesState] = useState<Record<string, any>>(initialVariables);
  const [refreshTriggers, setRefreshTriggers] = useState<Record<string, number>>({});

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

  const value: DashboardContextType = {
    variables,
    setVariable,
    refreshWidget,
    refreshAllWidgets
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
