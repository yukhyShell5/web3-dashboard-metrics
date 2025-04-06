
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { PlusIcon, LayoutDashboardIcon, LineChartIcon, BarChart2Icon, PieChartIcon, SaveIcon } from 'lucide-react';
import { useDashboardStore } from '@/services/dashboardStore';
import { Widget, WidgetType } from '@/types/dashboard';
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Dashboard templates
const dashboardTemplates = [
  {
    id: 'security',
    title: 'Web3 Security Dashboard',
    description: 'Monitor security metrics for blockchain activities',
    icon: <LayoutDashboardIcon className="h-12 w-12" />,
    widgets: [
      {
        id: uuidv4(),
        type: 'bar' as WidgetType,
        title: 'Transactions by Address',
        position: { i: uuidv4(), x: 0, y: 0, w: 6, h: 4, minW: 3, minH: 2 },
        config: {
          colorScheme: ['#3b82f6', '#10b981', '#f59e0b'],
          showLegend: true
        }
      },
      {
        id: uuidv4(),
        type: 'line' as WidgetType,
        title: 'Alert Trend',
        position: { i: uuidv4(), x: 6, y: 0, w: 6, h: 4, minW: 3, minH: 2 },
        config: {
          colorScheme: ['#8b5cf6'],
          showLegend: false
        }
      },
      {
        id: uuidv4(),
        type: 'pie' as WidgetType,
        title: 'Distribution by Chain',
        position: { i: uuidv4(), x: 0, y: 4, w: 4, h: 4, minW: 2, minH: 2 },
        config: {
          colorScheme: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
          showLegend: true
        }
      }
    ]
  },
  {
    id: 'metrics',
    title: 'Performance Metrics',
    description: 'Track key performance indicators',
    icon: <LineChartIcon className="h-12 w-12" />,
    widgets: [
      {
        id: uuidv4(),
        type: 'stat' as WidgetType,
        title: 'Total Transactions',
        position: { i: uuidv4(), x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 1 },
        config: {
          value: 'totalTransactions',
          trend: '+12.5%',
          trendDirection: 'up'
        }
      },
      {
        id: uuidv4(),
        type: 'stat' as WidgetType,
        title: 'Active Alerts',
        position: { i: uuidv4(), x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 1 },
        config: {
          value: 'activeAlerts',
          trend: '-5.2%',
          trendDirection: 'down'
        }
      },
      {
        id: uuidv4(),
        type: 'line' as WidgetType,
        title: 'Transaction Trend',
        position: { i: uuidv4(), x: 0, y: 2, w: 6, h: 4, minW: 3, minH: 2 },
        config: {
          colorScheme: ['#3b82f6'],
          showLegend: false
        }
      }
    ]
  },
  {
    id: 'empty',
    title: 'Empty Dashboard',
    description: 'Start from scratch',
    icon: <PlusIcon className="h-12 w-12" />,
    widgets: []
  }
];

// Widget templates
const widgetTemplates = [
  { id: 'bar1', type: 'bar' as WidgetType, title: 'Transactions by Address', icon: <BarChart2Icon className="h-6 w-6" /> },
  { id: 'line1', type: 'line' as WidgetType, title: 'Alert Trend', icon: <LineChartIcon className="h-6 w-6" /> },
  { id: 'pie1', type: 'pie' as WidgetType, title: 'Distribution by Chain', icon: <PieChartIcon className="h-6 w-6" /> },
  { id: 'bar2', type: 'bar' as WidgetType, title: 'Smart Contract Calls', icon: <BarChart2Icon className="h-6 w-6" /> },
];

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
    navigate(`/dashboards/view/${id}`);
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {dashboardTemplates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all hover:border-primary ${
                      selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleSelectTemplate(template.id)}
                  >
                    <CardHeader className="text-center pb-2">
                      <div className="mx-auto mb-2">{template.icon}</div>
                      <CardTitle>{template.title}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-sm text-muted-foreground">
                      {template.widgets.length} widgets included
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="details">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input 
                    id="name" 
                    placeholder="Dashboard name" 
                    className="col-span-3"
                    value={dashboardData.title}
                    onChange={(e) => setDashboardData({...dashboardData, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input 
                    id="description" 
                    placeholder="Brief description" 
                    className="col-span-3" 
                    value={dashboardData.description}
                    onChange={(e) => setDashboardData({...dashboardData, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="primary" className="text-right">
                    Set as primary
                  </Label>
                  <div className="col-span-3">
                    <p className="text-sm text-muted-foreground mb-2">
                      If checked, this dashboard will appear on the home page.
                    </p>
                    <input 
                      type="checkbox" 
                      id="primary" 
                      checked={dashboardData.isPrimary}
                      onChange={(e) => setDashboardData({...dashboardData, isPrimary: e.target.checked})}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="layout">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Available Widgets</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Click to add widgets to your dashboard
                    </p>
                    <div className="space-y-2">
                      {widgetTemplates.map((widget) => (
                        <Card 
                          key={widget.id}
                          className="cursor-pointer transition-all hover:bg-muted/50"
                          onClick={() => handleAddWidget(widget.id)}
                        >
                          <CardContent className="p-3 flex items-center gap-2">
                            {widget.icon}
                            <span className="text-sm">{widget.title}</span>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-3">
                  <div className="bg-muted/50 p-4 mb-4 rounded-lg">
                    <h3 className="font-medium mb-2">Layout Preview</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag widgets to reposition and resize them
                    </p>
                  </div>
                  
                  {layoutItems.length > 0 ? (
                    <div className="border rounded-lg p-4 bg-card min-h-[400px]">
                      <ResponsiveGridLayout
                        className="layout"
                        layouts={{
                          lg: layoutItems.map(item => item.position)
                        }}
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                        rowHeight={100}
                        onLayoutChange={handleLayoutChange}
                        isDraggable={true}
                        isResizable={true}
                        margin={[16, 16]}
                      >
                        {layoutItems.map(widget => (
                          <div key={widget.position.i}>
                            <Card className="h-full">
                              <CardHeader className="p-3 pb-2">
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-sm">{widget.title}</CardTitle>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveWidget(widget.id);
                                    }}
                                  >
                                    <PlusIcon className="h-3 w-3 rotate-45" />
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent className="p-3 pt-0 flex items-center justify-center h-[calc(100%-48px)]">
                                {widget.type === 'bar' && <BarChart2Icon className="h-8 w-8 text-muted-foreground" />}
                                {widget.type === 'line' && <LineChartIcon className="h-8 w-8 text-muted-foreground" />}
                                {widget.type === 'pie' && <PieChartIcon className="h-8 w-8 text-muted-foreground" />}
                                {widget.type === 'stat' && <LayoutDashboardIcon className="h-8 w-8 text-muted-foreground" />}
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </ResponsiveGridLayout>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center border rounded-lg p-8 bg-card min-h-[400px]">
                      <p className="text-muted-foreground mb-4">No widgets added yet</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add widgets from the left panel or choose a template
                      </p>
                    </div>
                  )}
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
