
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusIcon, LayoutDashboardIcon, LineChartIcon, BarChart2Icon, PieChartIcon, AreaChartIcon, SearchIcon, MoveIcon, ArrowUpIcon, ArrowDownIcon, EditIcon, TrashIcon } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

// Mock data for dashboards
const mockDashboards = [
  {
    id: '1',
    title: 'Web3 Security Overview',
    description: 'High-level security metrics for monitored addresses',
    charts: 8,
    createdAt: '2023-07-15T10:30:00Z',
    updatedAt: '2023-08-10T14:22:00Z',
    isPrimary: true,
  },
  {
    id: '2',
    title: 'Smart Contract Monitor',
    description: 'Detailed analytics for smart contract interactions',
    charts: 6,
    createdAt: '2023-07-20T11:45:00Z',
    updatedAt: '2023-08-09T09:15:00Z',
    isPrimary: false,
  },
  {
    id: '3',
    title: 'Transaction Analysis',
    description: 'Deep dive into transaction patterns and anomalies',
    charts: 10,
    createdAt: '2023-07-25T15:20:00Z',
    updatedAt: '2023-08-08T16:30:00Z',
    isPrimary: false,
  },
  {
    id: '4',
    title: 'DeFi Risk Monitor',
    description: 'Monitor DeFi protocols and risk exposure',
    charts: 7,
    createdAt: '2023-08-01T09:10:00Z',
    updatedAt: '2023-08-07T11:45:00Z',
    isPrimary: false,
  },
];

// Mock data for chart templates
const chartTemplates = [
  { id: 'chart1', type: 'bar', title: 'Transactions by Address', icon: <BarChart2Icon className="h-6 w-6" /> },
  { id: 'chart2', type: 'line', title: 'Alert Trend', icon: <LineChartIcon className="h-6 w-6" /> },
  { id: 'chart3', type: 'pie', title: 'Distribution by Chain', icon: <PieChartIcon className="h-6 w-6" /> },
  { id: 'chart4', type: 'area', title: 'Gas Usage Over Time', icon: <AreaChartIcon className="h-6 w-6" /> },
  { id: 'chart5', type: 'bar', title: 'Smart Contract Calls', icon: <BarChart2Icon className="h-6 w-6" /> },
  { id: 'chart6', type: 'line', title: 'Value Transfer', icon: <LineChartIcon className="h-6 w-6" /> },
];

const Dashboards = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboards, setDashboards] = useState(mockDashboards);
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);
  const [layoutItems, setLayoutItems] = useState<{id: string, type: string, title: string, content: React.ReactNode}[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddChart = (chartId: string) => {
    if (!selectedCharts.includes(chartId)) {
      setSelectedCharts([...selectedCharts, chartId]);
      
      // Find the chart template
      const chartTemplate = chartTemplates.find(chart => chart.id === chartId);
      if (chartTemplate) {
        // Add to layout items
        setLayoutItems([...layoutItems, {
          id: `layout-${Date.now()}-${chartId}`,
          type: chartTemplate.type,
          title: chartTemplate.title,
          content: chartTemplate.icon
        }]);
      }
    }
  };

  const handleRemoveChart = (chartId: string) => {
    setSelectedCharts(selectedCharts.filter(id => id !== chartId));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    if (result.type === 'dashboards') {
      const items = [...dashboards];
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setDashboards(items);
    } else if (result.type === 'layout-items') {
      const items = [...layoutItems];
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setLayoutItems(items);
    }
  };

  const handleCreateDashboard = () => {
    // In a real app, save to backend
    setIsEditing(false);
  };

  const setPrimaryDashboard = (id: string) => {
    setDashboards(
      dashboards.map(dashboard => ({
        ...dashboard,
        isPrimary: dashboard.id === id
      }))
    );
  };

  const filteredDashboards = dashboards.filter(dashboard => 
    dashboard.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dashboard.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboards</h1>
          <p className="text-muted-foreground">Create and manage custom dashboards</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              Create Dashboard
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[80%] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Create New Dashboard</DialogTitle>
              <DialogDescription>
                Design a custom dashboard with the charts and metrics you need.
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="layout" className="w-full h-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="details">Dashboard Details</TabsTrigger>
                <TabsTrigger value="charts">Add Charts</TabsTrigger>
                <TabsTrigger value="layout">Layout Designer</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" placeholder="Dashboard name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input id="description" placeholder="Brief description" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="primary" className="text-right">
                      Set as primary
                    </Label>
                    <div className="col-span-3">
                      <p className="text-sm text-muted-foreground">
                        If checked, this dashboard will appear on the home page.
                      </p>
                      <input type="checkbox" id="primary" className="mt-2" />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="charts" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {chartTemplates.map((chart) => (
                    <Card 
                      key={chart.id} 
                      className={`cursor-pointer transition-all ${selectedCharts.includes(chart.id) ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => selectedCharts.includes(chart.id) ? handleRemoveChart(chart.id) : handleAddChart(chart.id)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          {chart.icon}
                          {chart.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">{chart.type} chart</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="layout" className="h-[60vh] overflow-auto">
                <div className="flex flex-col h-full">
                  <div className="bg-muted/50 p-4 mb-4 rounded-lg">
                    <p className="font-medium mb-2">Dashboard Layout Editor</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop charts to create your perfect dashboard layout. Panels can be resized.
                    </p>
                    {selectedCharts.length === 0 && (
                      <div className="text-center p-4 border border-dashed rounded-lg">
                        <p>Select charts from the "Add Charts" tab first</p>
                      </div>
                    )}
                  </div>

                  {selectedCharts.length > 0 && (
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="layout-items" direction="vertical" type="layout-items">
                        {(provided) => (
                          <div 
                            {...provided.droppableProps} 
                            ref={provided.innerRef}
                            className="flex-1"
                          >
                            <ResizablePanelGroup direction="vertical" className="min-h-[500px]">
                              {layoutItems.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className="mb-4"
                                    >
                                      <ResizablePanel defaultSize={20}>
                                        <Card className="h-full">
                                          <CardHeader className="pb-2">
                                            <div className="flex justify-between items-center">
                                              <CardTitle className="text-base">{item.title}</CardTitle>
                                              <div className="flex gap-1">
                                                <Button 
                                                  variant="ghost" 
                                                  size="icon" 
                                                  className="h-6 w-6"
                                                  {...provided.dragHandleProps}
                                                >
                                                  <MoveIcon className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            </div>
                                          </CardHeader>
                                          <CardContent className="flex items-center justify-center h-40">
                                            <div className="text-muted-foreground">
                                              {item.content}
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </ResizablePanel>
                                      {index < layoutItems.length - 1 && (
                                        <ResizableHandle />
                                      )}
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </ResizablePanelGroup>
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button type="submit" onClick={handleCreateDashboard}>Create Dashboard</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search dashboards..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select defaultValue="recent">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recently Updated</SelectItem>
            <SelectItem value="created">Date Created</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="charts">Number of Charts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="dashboards" type="dashboards">
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredDashboards.map((dashboard, index) => (
                <Draggable key={dashboard.id} draggableId={dashboard.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle>{dashboard.title}</CardTitle>
                            <div className="flex items-center" {...provided.dragHandleProps}>
                              <MoveIcon className="h-4 w-4 text-muted-foreground cursor-move" />
                            </div>
                          </div>
                          <CardDescription>{dashboard.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm">
                            <div className="text-muted-foreground flex items-center gap-1">
                              {dashboard.charts} charts
                            </div>
                            <div className="text-muted-foreground">
                              Updated {new Date(dashboard.updatedAt).toLocaleDateString()}
                            </div>
                          </div>
                          {dashboard.isPrimary && (
                            <div className="mt-2 text-xs bg-primary/20 text-primary rounded-full px-2 py-1 inline-flex items-center">
                              <span>Primary Dashboard</span>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="pt-2 justify-between">
                          <div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={`${dashboard.isPrimary ? 'text-primary' : ''}`}
                              onClick={() => setPrimaryDashboard(dashboard.id)}
                              disabled={dashboard.isPrimary}
                            >
                              {dashboard.isPrimary ? 'Primary' : 'Set as primary'}
                            </Button>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <EditIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="default" size="sm">View</Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Dashboards;
