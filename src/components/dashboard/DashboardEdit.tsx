
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeftIcon, PlusIcon, SaveIcon, BarChart2Icon, LineChartIcon, PieChartIcon, LayoutDashboardIcon } from 'lucide-react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Widget from './Widget';
import { useDashboardStore } from '@/services/dashboardStore';
import { DashboardLayout } from '@/types/dashboard';
import { Widget as WidgetType } from '@/types/widget';
import { WidgetType as WidgetTypeEnum } from '@/types/widget';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "@/hooks/use-toast";
import { DashboardProvider } from '@/contexts/DashboardContext';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Available widget templates
const widgetTemplates = [
  { type: 'bar', title: 'Bar Chart', icon: <BarChart2Icon className="h-6 w-6" /> },
  { type: 'line', title: 'Line Chart', icon: <LineChartIcon className="h-6 w-6" /> },
  { type: 'pie', title: 'Pie Chart', icon: <PieChartIcon className="h-6 w-6" /> },
  { type: 'stat', title: 'Stat Card', icon: <LayoutDashboardIcon className="h-6 w-6" /> },
];

const colorSchemes = [
  { id: 'blue', colors: ['#3b82f6', '#60a5fa', '#93c5fd'] },
  { id: 'purple', colors: ['#8b5cf6', '#a78bfa', '#c4b5fd'] },
  { id: 'green', colors: ['#10b981', '#34d399', '#6ee7b7'] },
  { id: 'orange', colors: ['#f59e0b', '#fbbf24', '#fcd34d'] },
  { id: 'multi', colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'] },
];

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
  const [isWidgetDialogOpen, setIsWidgetDialogOpen] = useState(false);
  const [currentWidgetConfig, setCurrentWidgetConfig] = useState({
    type: 'bar' as WidgetTypeEnum,
    title: 'New Widget',
    colorScheme: 'blue'
  });
  
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
  
  const handleAddWidget = () => {
    const selectedColors = colorSchemes.find(scheme => scheme.id === currentWidgetConfig.colorScheme)?.colors || colorSchemes[0].colors;
    
    // Find the maximum y-coordinate to place the new widget at the bottom
    const maxY = dashboard.widgets.reduce((max, widget) => {
      return Math.max(max, widget.position.y + widget.position.h);
    }, 0);
    
    const newWidget: Omit<WidgetType, 'id'> = {
      type: currentWidgetConfig.type,
      title: currentWidgetConfig.title || 'New Widget',
      position: {
        i: 'temp-id', // Will be replaced with actual ID
        x: 0,
        y: maxY,
        w: 6,
        h: 4,
        minW: 2,
        minH: 2
      },
      config: {
        colorScheme: selectedColors,
        showLegend: true
      }
    };
    
    addWidget(dashboard.id, newWidget);
    setIsWidgetDialogOpen(false);
    toast({
      title: "Widget added",
      description: "New widget has been added to your dashboard"
    });
  };
  
  const handleRemoveWidget = (widgetId: string) => {
    removeWidget(dashboard.id, widgetId);
  };
  
  return (
    <DashboardProvider initialVariables={dashboard.variables}>
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
          
          <div className="bg-card rounded-lg border shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Layout Editor</h2>
              <Button
                onClick={() => setIsWidgetDialogOpen(true)}
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
                  onClick={() => setIsWidgetDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Widget
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <Dialog open={isWidgetDialogOpen} onOpenChange={setIsWidgetDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Widget</DialogTitle>
              <DialogDescription>
                Create a new widget to add to your dashboard.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="type" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="type">Widget Type</TabsTrigger>
                <TabsTrigger value="config">Configuration</TabsTrigger>
              </TabsList>
              
              <TabsContent value="type" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {widgetTemplates.map((template) => (
                    <Card 
                      key={template.type}
                      className={`cursor-pointer transition-all ${
                        currentWidgetConfig.type === template.type ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setCurrentWidgetConfig({
                        ...currentWidgetConfig,
                        type: template.type as WidgetTypeEnum
                      })}
                    >
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        {template.icon}
                        <p className="mt-2 font-medium">{template.title}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="config" className="space-y-4">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="widget-title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="widget-title"
                      value={currentWidgetConfig.title}
                      onChange={(e) => setCurrentWidgetConfig({
                        ...currentWidgetConfig,
                        title: e.target.value
                      })}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="color-scheme" className="text-right">
                      Color Scheme
                    </Label>
                    <Select 
                      value={currentWidgetConfig.colorScheme}
                      onValueChange={(value) => setCurrentWidgetConfig({
                        ...currentWidgetConfig,
                        colorScheme: value
                      })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select color scheme" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorSchemes.map((scheme) => (
                          <SelectItem key={scheme.id} value={scheme.id}>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {scheme.colors.map((color, i) => (
                                  <div 
                                    key={i}
                                    className="w-4 h-4 rounded-full ml-[-0.375rem] border border-white"
                                    style={{ backgroundColor: color, zIndex: scheme.colors.length - i }}
                                  />
                                ))}
                              </div>
                              <span className="capitalize">{scheme.id}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsWidgetDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddWidget}>
                Add Widget
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DndProvider>
    </DashboardProvider>
  );
};

export default DashboardEdit;
