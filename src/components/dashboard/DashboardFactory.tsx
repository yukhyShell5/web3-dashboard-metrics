
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusIcon, SaveIcon } from 'lucide-react';
import { useDashboardStore } from '@/services/dashboardStore';
import { Widget, WidgetType } from '@/types/dashboard';
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { dashboardTemplates, widgetTemplates } from './templates';
import TemplateSelector from './TemplateSelector';
import DashboardDetailsForm from './DashboardDetailsForm';
import WidgetSelector from './WidgetSelector';
import LayoutDesigner from './LayoutDesigner';

const DashboardFactory: React.FC = () => {
  const navigate = useNavigate();
  const addDashboard = useDashboardStore(state => state.addDashboard);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [dashboardData, setDashboardData] = useState({
    title: '',
    description: '',
    isPrimary: false
  });
  const [selectedWidgets, setSelectedWidgets] = useState<Widget[]>([]);
  const [layoutItems, setLayoutItems] = useState<Widget[]>([]);
  
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    const template = dashboardTemplates.find(t => t.id === templateId);
    if (template) {
      setDashboardData({
        title: template.title,
        description: template.description,
        isPrimary: false
      });
      
      setSelectedWidgets(template.widgets);
      setLayoutItems(template.widgets);
    }
  };
  
  const handleAddWidget = (widgetId: string) => {
    const widgetTemplate = widgetTemplates.find(w => w.id === widgetId);
    if (!widgetTemplate) return;
    
    // Find the maximum y-coordinate to place the new widget at the bottom
    const maxY = layoutItems.reduce((max, widget) => {
      return Math.max(max, widget.position.y + widget.position.h);
    }, 0);
    
    const newWidget: Widget = {
      id: uuidv4(),
      type: widgetTemplate.type,
      title: widgetTemplate.title,
      position: {
        i: uuidv4(),
        x: 0,
        y: maxY,
        w: 6,
        h: 4,
        minW: 2,
        minH: 2
      },
      config: {
        colorScheme: ['#3b82f6', '#10b981', '#f59e0b'],
        showLegend: true
      }
    };
    
    setSelectedWidgets([...selectedWidgets, newWidget]);
    setLayoutItems([...layoutItems, newWidget]);
  };
  
  const handleRemoveWidget = (widgetId: string) => {
    setSelectedWidgets(selectedWidgets.filter(w => w.id !== widgetId));
    setLayoutItems(layoutItems.filter(w => w.id !== widgetId));
  };
  
  const handleLayoutChange = (layout: any) => {
    setLayoutItems(layoutItems.map(item => {
      const updatedPosition = layout.find((l: any) => l.i === item.position.i);
      if (updatedPosition) {
        return {
          ...item,
          position: {
            ...item.position,
            x: updatedPosition.x,
            y: updatedPosition.y,
            w: updatedPosition.w,
            h: updatedPosition.h
          }
        };
      }
      return item;
    }));
  };
  
  const handleCreateDashboard = () => {
    const id = addDashboard({
      title: dashboardData.title || 'Untitled Dashboard',
      description: dashboardData.description || 'No description provided',
      isPrimary: dashboardData.isPrimary,
    });
    
    // Add each widget to the dashboard
    const store = useDashboardStore.getState();
    layoutItems.forEach(widget => {
      store.addWidget(id, {
        type: widget.type,
        title: widget.title,
        position: widget.position,
        config: widget.config
      });
    });
    
    toast({
      title: "Dashboard created",
      description: "Your new dashboard has been created successfully"
    });
    
    setIsDialogOpen(false);
    navigate(`/dashboards/edit/${id}`);
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Create Dashboard
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[80%] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Create New Dashboard</DialogTitle>
            <DialogDescription>
              Choose a template or start from scratch to create your custom dashboard.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="template" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="template">Choose Template</TabsTrigger>
              <TabsTrigger value="details">Dashboard Details</TabsTrigger>
              <TabsTrigger value="layout">Layout Designer</TabsTrigger>
            </TabsList>

            <TabsContent value="template">
              <TemplateSelector 
                selectedTemplate={selectedTemplate}
                onSelectTemplate={handleSelectTemplate}
              />
            </TabsContent>

            <TabsContent value="details">
              <DashboardDetailsForm 
                dashboardData={dashboardData}
                onChange={setDashboardData}
              />
            </TabsContent>

            <TabsContent value="layout">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 space-y-4">
                  <WidgetSelector onAddWidget={handleAddWidget} />
                </div>
                
                <div className="md:col-span-3">
                  <div className="bg-muted/50 p-4 mb-4 rounded-lg">
                    <h3 className="font-medium mb-2">Layout Preview</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag widgets to reposition and resize them
                    </p>
                  </div>
                  
                  <LayoutDesigner 
                    layoutItems={layoutItems}
                    onLayoutChange={handleLayoutChange}
                    onRemoveWidget={handleRemoveWidget}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateDashboard}
              disabled={!dashboardData.title}
              className="flex items-center gap-2"
            >
              <SaveIcon className="h-4 w-4" />
              Create Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DndProvider>
  );
};

export default DashboardFactory;
