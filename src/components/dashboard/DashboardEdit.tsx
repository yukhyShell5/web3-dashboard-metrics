
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import WidgetCreator from './WidgetCreator';
import { useDashboardStore } from '@/services/dashboardStore';
import { DashboardLayout } from '@/types/dashboard';
import { WidgetType as WidgetTypeEnum } from '@/types/widget';
import { toast } from "@/hooks/use-toast";
import { DashboardProvider } from '@/contexts/DashboardContext';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import GlobalFilters from './GlobalFilters';
import DashboardHeader from './dashboardEdit/DashboardHeader';
import WidgetsLayout from './dashboardEdit/WidgetsLayout';
import EmptyDashboard from './dashboardEdit/EmptyDashboard';

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
  const [layoutChanged, setLayoutChanged] = useState(false);
  
  if (!dashboard) {
    return <EmptyDashboard onGoBack={() => navigate('/dashboards')} />;
  }
  
  const handleLayoutChange = (layout: any) => {
    // Mark that layout has changed to provide visual feedback
    setLayoutChanged(true);
    
    // Update the widget positions in the store
    updateWidgetPositions(dashboard.id, layout);
    
    // Optional: Show a toast notification for user feedback
    toast({
      title: "Layout updated",
      description: "Widget positions have been updated"
    });
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
  
  const handleRemoveWidget = (widgetId: string) => {
    if (dashboard && widgetId) {
      removeWidget(dashboard.id, widgetId);
      
      // Show a toast notification for user feedback
      toast({
        title: "Widget removed",
        description: "Widget has been removed from the dashboard"
      });
    }
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
    
    const newWidget = {
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
  
  return (
    <DashboardProvider 
      initialVariables={dashboard.variables}
      initialFilters={dashboard.globalFilters || []}
    >
      <DndProvider backend={HTML5Backend}>
        <div className="space-y-6">
          <DashboardHeader
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            dashboardId={dashboard.id}
            onSave={handleSave}
          />
          
          {/* Global filters section */}
          <Card className="p-4">
            <GlobalFilters />
          </Card>
          
          <WidgetsLayout 
            widgets={dashboard.widgets}
            onLayoutChange={handleLayoutChange}
            onRemoveWidget={handleRemoveWidget}
            onAddWidgetClick={() => setIsWidgetCreatorOpen(true)}
          />
        </div>
        
        <Dialog open={isWidgetCreatorOpen} onOpenChange={setIsWidgetCreatorOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogTitle>Add Widget</DialogTitle>
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
