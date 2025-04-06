import React, { useState, useCallback } from 'react';
import { useDashboardStore } from '@/services/dashboardService';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MoveIcon, 
  EditIcon, 
  PlusIcon, 
  SaveIcon,
  XIcon,
  LineChartIcon, 
  BarChart2Icon, 
  PieChartIcon, 
  AreaChartIcon
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';

const chartTypes = [
  { id: 'bar', name: 'Bar Chart', icon: <BarChart2Icon className="h-12 w-12" /> },
  { id: 'line', name: 'Line Chart', icon: <LineChartIcon className="h-12 w-12" /> },
  { id: 'pie', name: 'Pie Chart', icon: <PieChartIcon className="h-12 w-12" /> },
  { id: 'area', name: 'Area Chart', icon: <AreaChartIcon className="h-12 w-12" /> },
];

// Mock data for charts
const mockChartData = {
  bar: [
    { name: 'Jan', value: 100 },
    { name: 'Feb', value: 200 },
    { name: 'Mar', value: 150 },
    { name: 'Apr', value: 300 },
    { name: 'May', value: 250 },
  ],
  line: [
    { day: 'Mon', value: 10 },
    { day: 'Tue', value: 30 },
    { day: 'Wed', value: 15 },
    { day: 'Thu', value: 40 },
    { day: 'Fri', value: 25 },
    { day: 'Sat', value: 5 },
    { day: 'Sun', value: 20 },
  ],
  pie: [
    { name: 'A', value: 400 },
    { name: 'B', value: 300 },
    { name: 'C', value: 200 },
    { name: 'D', value: 100 },
  ]
};

const DashboardFactory = () => {
  const [isEditing, setIsEditing] = useState(true);
  const [dashboardTitle, setDashboardTitle] = useState('New Dashboard');
  const [dashboardDescription, setDashboardDescription] = useState('');
  const [layoutItems, setLayoutItems] = useState<{id: string, type: string, title: string}[]>([]);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const addDashboard = useDashboardStore(state => state.addDashboard);

  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return;

    if (result.type === 'CHART_TYPE') {
      // Adding a new chart from the palette
      const chartType = chartTypes.find(chart => chart.id === result.draggableId);
      if (chartType) {
        const newItem = {
          id: `item-${Date.now()}`,
          type: chartType.id,
          title: chartType.name
        };
        setLayoutItems(prev => [...prev, newItem]);
      }
    } else if (result.type === 'LAYOUT_ITEM') {
      // Reordering items within the layout
      const items = Array.from(layoutItems);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setLayoutItems(items);
    }
  }, [layoutItems]);

  const handleSaveDashboard = () => {
    try {
      addDashboard({
        title: dashboardTitle,
        description: dashboardDescription,
        charts: layoutItems.length,
        isPrimary: false,
        layout: layoutItems.map(item => ({
          id: item.id,
          type: item.type as any,
          title: item.title
        }))
      });
      toast.success('Dashboard saved successfully');
      setIsSaveDialogOpen(false);
    } catch (error) {
      toast.error('Failed to save dashboard');
      console.error(error);
    }
  };

  const renderChartContent = (type: string) => {
    switch (type) {
      case 'bar':
        return (
          <BarChart
            data={mockChartData.bar}
            xDataKey="name"
            height={150}
            bars={[{ dataKey: 'value', fill: '#3b82f6', name: 'Value' }]}
          />
        );
      case 'line':
        return (
          <LineChart
            data={mockChartData.line}
            xDataKey="day"
            height={150}
            lines={[{ dataKey: 'value', stroke: '#8b5cf6', name: 'Value' }]}
          />
        );
      case 'pie':
        return (
          <PieChart
            data={mockChartData.pie}
            dataKey="value"
            nameKey="name"
            height={150}
            colors={['#3b82f6', '#8b5cf6', '#22c55e', '#ef4444']}
          />
        );
      case 'area':
        return (
          <LineChart
            data={mockChartData.line}
            xDataKey="day"
            height={150}
            lines={[{ dataKey: 'value', stroke: '#8b5cf6', name: 'Value', fill: '#8b5cf680' }]}
          />
        );
      default:
        return <div>Chart type not supported</div>;
    }
  };

  const handleRemoveItem = (id: string) => {
    setLayoutItems(layoutItems.filter(item => item.id !== id));
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    setLayoutItems(
      layoutItems.map(item => 
        item.id === id ? { ...item, title: newTitle } : item
      )
    );
  };

  return (
    <div className="dashboard-factory h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 p-2 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <Input
            value={dashboardTitle}
            onChange={(e) => setDashboardTitle(e.target.value)}
            className="font-semibold text-lg max-w-[300px]"
            placeholder="Dashboard Title"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Preview' : 'Edit'}
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => setIsSaveDialogOpen(true)}
          >
            <SaveIcon className="h-4 w-4 mr-1" /> Save
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 flex gap-4 h-full">
          {isEditing && (
            <div className="w-64 bg-muted/30 rounded-lg p-4 h-full">
              <h3 className="font-medium mb-4">Chart Types</h3>
              <Droppable droppableId="chart-types" type="CHART_TYPE">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grid gap-3"
                  >
                    {chartTypes.map((chart, index) => (
                      <Draggable
                        key={chart.id}
                        draggableId={chart.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-card border rounded-lg p-3 cursor-move flex flex-col items-center justify-center hover:border-primary transition-colors"
                          >
                            {chart.icon}
                            <span className="mt-2 text-sm">{chart.name}</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )}

          <div className="flex-1 bg-muted/10 rounded-lg p-4 overflow-auto">
            <h3 className="font-medium mb-4">Layout</h3>
            {layoutItems.length === 0 ? (
              <div className="flex items-center justify-center h-64 border border-dashed rounded-lg">
                <div className="text-center text-muted-foreground">
                  <p>Drag and drop charts here</p>
                  <p className="text-sm">or</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      const newItem = {
                        id: `item-${Date.now()}`,
                        type: 'bar',
                        title: 'Bar Chart'
                      };
                      setLayoutItems(prev => [...prev, newItem]);
                    }}
                  >
                    <PlusIcon className="h-4 w-4 mr-1" /> Add Chart
                  </Button>
                </div>
              </div>
            ) : (
              <Droppable droppableId="layout" type="LAYOUT_ITEM">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="w-full h-full"
                  >
                    <ResizablePanelGroup direction="vertical" className="min-h-[500px] w-full">
                      {layoutItems.map((item, index) => (
                        <React.Fragment key={item.id}>
                          <ResizablePanel defaultSize={100 / layoutItems.length} minSize={15}>
                            <Draggable
                              draggableId={item.id}
                              index={index}
                              isDragDisabled={!isEditing}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="h-full"
                                >
                                  <Card className="h-full">
                                    <CardHeader className="pb-2">
                                      <div className="flex justify-between items-center">
                                        {isEditing ? (
                                          <Input
                                            value={item.title}
                                            onChange={(e) => handleTitleChange(item.id, e.target.value)}
                                            className="text-base font-medium h-8"
                                          />
                                        ) : (
                                          <CardTitle className="text-base">{item.title}</CardTitle>
                                        )}
                                        {isEditing && (
                                          <div className="flex gap-1">
                                            <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              className="h-6 w-6"
                                              {...provided.dragHandleProps}
                                            >
                                              <MoveIcon className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              className="h-6 w-6 hover:text-destructive"
                                              onClick={() => handleRemoveItem(item.id)}
                                            >
                                              <XIcon className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    </CardHeader>
                                    <CardContent>
                                      {renderChartContent(item.type)}
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          </ResizablePanel>
                          {index < layoutItems.length - 1 && <ResizableHandle />}
                        </React.Fragment>
                      ))}
                    </ResizablePanelGroup>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )}
          </div>
        </div>
      </DragDropContext>

      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Dashboard</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={dashboardTitle}
                onChange={(e) => setDashboardTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={dashboardDescription}
                onChange={(e) => setDashboardDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveDashboard}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardFactory;
