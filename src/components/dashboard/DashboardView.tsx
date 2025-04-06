
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, EditIcon } from 'lucide-react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Widget from './Widget';
import { useDashboardStore } from '@/services/dashboardStore';
import { DashboardLayout } from '@/types/dashboard';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getDashboardById = useDashboardStore(state => state.getDashboardById);
  
  const dashboard = getDashboardById(id || '') as DashboardLayout;
  
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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/dashboards')}
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{dashboard.title}</h1>
            <p className="text-muted-foreground">{dashboard.description}</p>
          </div>
        </div>
        <Button 
          onClick={() => navigate(`/dashboards/edit/${dashboard.id}`)}
          className="flex items-center gap-2"
        >
          <EditIcon className="h-4 w-4" />
          Edit Dashboard
        </Button>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-4">
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
              <Widget widget={widget} isEditing={false} />
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};

export default DashboardView;
