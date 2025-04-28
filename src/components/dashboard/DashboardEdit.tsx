
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeftIcon, PlusIcon, SaveIcon } from 'lucide-react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Widget from './Widget';
import WidgetCreator from './WidgetCreator';
import { useDashboardStore } from '@/services/dashboardStore';
import { DashboardLayout } from '@/types/dashboard';
import { Widget as WidgetType, WidgetType as WidgetTypeEnum } from '@/types/widget';
import { toast } from "@/hooks/use-toast";
import { DashboardProvider } from '@/contexts/DashboardContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import GlobalFilters from './GlobalFilters';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const getDashboardById = useDashboardStore(state => state.getDashboardById);
  const updateDashboard = useDashboardStore(state => state.updateDashboard);
  const addWidget = useDashboardStore(state => state.addWidget);
  const removeWidget = useDashboardStore(state => state.removeWidget);
  const updateWidgetPositions = useDashboardStore(state => state.updateWidgetPositions);
  
  const dashboard = getDashboardById(id || '') as DashboardLayout;
  
  const [title, setTitle] = useState(dashboard?.title || '');
  const [description, setDescription] = useState(dashboard?.description || '');
  const [isWidgetCreatorOpen, setIsWidgetCreatorOpen] = useState(false);
  
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
  
  const handleLayoutChange = (layout: any) => {
    updateWidgetPositions(dashboard.id, layout);
  };
  
  const handleSave = () => {
    updateDashboard(dashboard.id, {
      title,
      description
    });
    toast({
      title: "Dashboard updated",
      description: "Your changes have been saved successfully"
    });
    navigate(`/dashboards/view/${dashboard.id}`);
  };
  
  const handleAddWidget = (widgetConfig: {
    title: string;
    type: WidgetTypeEnum;
    config: Record<string, any>;
  }) => {
    // Find the maximum y-coordinate to place the new widget at the bottom
    const maxY = dashboard.widgets.reduce((max, widget) => {
      return Math.max(max, widget.position.y + widget.position.h);
    }, 0);
    
    // Determine widget size based on type
    let w = 6, h = 4; // Default size
    
    switch (widgetConfig.type) {
      case 'pie':
      case 'gauge':
        w = 4; h = 4;
        break;
      case 'stat':
        w = 3; h = 2;
        break;
      case 'table':
        w = 8; h = 6;
        break;
      case 'heatmap':
      case 'scatter':
        w = 6; h = 5;
        break;
    }
    
    const newWidget: Omit<WidgetType, 'id'> = {
      type: widgetConfig.type,
      title: widgetConfig.title,
      position: {
        i: 'temp-id', // Will be replaced with actual ID
        x: 0,
        y: maxY,
        w,
        h,
        minW: 2,
        minH: 2
      },
      config: widgetConfig.config
    };
    
    addWidget(dashboard.id, newWidget);
    setIsWidgetCreatorOpen(false);
    toast({
      title: "Widget added",
      description: "New widget has been added to your dashboard"
    });
  };
  
  const handleRemoveWidget = (widgetId: string) => {
    removeWidget(dashboard.id, widgetId);
  };
  
  return (
    <DashboardProvider 
      initialVariables={dashboard.variables}
      initialFilters={dashboard.globalFilters || []}
    >
      <DndProvider backend={HTML5Backend}>
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
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-2xl font-bold bg-transparent border-none focus-visible:ring-0 p-0 h-auto"
                  placeholder="Dashboard Title"
                />
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-sm text-muted-foreground bg-transparent border-none focus-visible:ring-0 p-0 h-auto"
                  placeholder="Add a description"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline"
                onClick={() => navigate(`/dashboards/view/${dashboard.id}`)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="flex items-center gap-2"
              >
                <SaveIcon className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
          
          {/* Global filters section */}
          <Card className="p-4">
            <GlobalFilters />
          </Card>
          
          <div className="bg-card rounded-lg border shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Layout Editor</h2>
              <Button
                onClick={() => setIsWidgetCreatorOpen(true)}
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add Widget
              </Button>
            </div>
            
            <ResponsiveGridLayout
              className="layout"
              layouts={layouts}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={100}
              onLayoutChange={handleLayoutChange}
              isDraggable={true}
              isResizable={true}
              margin={[16, 16]}
            >
              {dashboard.widgets.map(widget => (
                <div key={widget.id} data-grid={widget.position}>
                  <Widget 
                    widget={widget} 
                    isEditing={true} 
                    onRemove={handleRemoveWidget} 
                  />
                </div>
              ))}
            </ResponsiveGridLayout>
            
            {dashboard.widgets.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">No widgets added yet</p>
                <Button
                  onClick={() => setIsWidgetCreatorOpen(true)}
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Widget
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <Dialog open={isWidgetCreatorOpen} onOpenChange={setIsWidgetCreatorOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <WidgetCreator
              onAddWidget={handleAddWidget}
              onCancel={() => setIsWidgetCreatorOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </DndProvider>
    </DashboardProvider>
  );
};

export default DashboardEdit;
