
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, EditIcon, RefreshCwIcon } from 'lucide-react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Widget from './widget';
import GlobalFilters from './GlobalFilters';
import { useDashboardStore } from '@/services/dashboardStore';
import { DashboardLayout } from '@/types/dashboard';
import { DashboardProvider } from '@/contexts/DashboardContext';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardViewProps {
  dashboardId?: string;
  isHomePage?: boolean;
}

const DashboardView: React.FC<DashboardViewProps> = ({ dashboardId, isHomePage = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getDashboardById = useDashboardStore(state => state.getDashboardById);
  const setDashboardGlobalFilters = useDashboardStore(state => state.setDashboardGlobalFilters);
  
  const effectiveId = dashboardId || id || '';
  const dashboard = getDashboardById(effectiveId) as DashboardLayout;
  const [autoRefreshing, setAutoRefreshing] = useState<boolean>(dashboard?.autoRefresh || false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(Date.now());
  
  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefreshing || !dashboard?.refreshInterval) return;
    
    const interval = setInterval(() => {
      setRefreshTrigger(Date.now());
    }, dashboard.refreshInterval);
    
    return () => clearInterval(interval);
  }, [autoRefreshing, dashboard?.refreshInterval]);
  
  if (!dashboard) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <p className="text-xl font-semibold mb-4">Dashboard not found</p>
        <Button onClick={() => navigate('/dashboards')}>
          Back to Dashboards
        </Button>
      </div>
    );
  }
  
  // Map widgets to layout format required by GridLayout
  const layouts = {
    lg: dashboard.widgets.map(widget => ({
      ...widget.position,
      i: widget.id
    }))
  };
  
  const handleRefreshAll = () => {
    setRefreshTrigger(Date.now());
  };
  
  const toggleAutoRefresh = () => {
    setAutoRefreshing(prev => !prev);
  };

  const handleFiltersChange = (filters: any) => {
    if (effectiveId) {
      setDashboardGlobalFilters(effectiveId, filters);
    }
  };
  
  return (
    <DashboardProvider 
      initialVariables={dashboard.variables}
      initialFilters={dashboard.globalFilters || []}
      dashboardId={dashboard.id}
      onFiltersChange={handleFiltersChange}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {!isHomePage && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => navigate('/dashboards')}
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold">{dashboard.title}</h1>
              <p className="text-muted-foreground">{dashboard.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline"
              size="sm"
              className={autoRefreshing ? "bg-primary/10" : ""}
              onClick={toggleAutoRefresh}
            >
              {autoRefreshing ? 'Auto-refreshing' : 'Auto-refresh'}
              {dashboard.refreshInterval && autoRefreshing && (
                <span className="ml-1 text-xs">
                  ({dashboard.refreshInterval / 1000}s)
                </span>
              )}
            </Button>
            <Button 
              variant="outline"
              size="icon"
              onClick={handleRefreshAll}
            >
              <RefreshCwIcon className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => navigate(`/dashboards/edit/${dashboard.id}`)}
              className="flex items-center gap-2"
            >
              <EditIcon className="h-4 w-4" />
              Edit Dashboard
            </Button>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border shadow-sm p-4">
          <GlobalFilters />
          
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={100}
            isDraggable={false}
            isResizable={false}
            margin={[16, 16]}
          >
            {dashboard.widgets.map(widget => (
              <div key={widget.id} data-grid={widget.position}>
                <Widget 
                  widget={widget} 
                  isEditing={false} 
                />
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>
      </div>
    </DashboardProvider>
  );
};

export default DashboardView;
