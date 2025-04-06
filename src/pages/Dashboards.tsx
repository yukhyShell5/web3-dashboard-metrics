
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusIcon, LayoutDashboardIcon, LineChartIcon, BarChart2Icon, PieChartIcon, AreaChartIcon, SearchIcon, MoveIcon, ArrowUpIcon, ArrowDownIcon, EditIcon, TrashIcon } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Dashboard, useDashboardStore } from '@/services/dashboardService';
import { toast } from 'sonner';

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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const dashboards = useDashboardStore(state => state.dashboards);
  const setPrimaryDashboard = useDashboardStore(state => state.setPrimaryDashboard);
  const removeDashboard = useDashboardStore(state => state.removeDashboard);
  const [sortBy, setSortBy] = useState('recent');

  const handleViewDashboard = (dashboardId: string) => {
    navigate(`/dashboards/view/${dashboardId}`);
  };

  const handleEditDashboard = (dashboardId: string) => {
    navigate(`/dashboards/edit/${dashboardId}`);
  };

  const handleCreateDashboard = () => {
    navigate('/dashboards/edit/new');
  };

  const handleDeleteDashboard = (dashboardId: string) => {
    if (confirm('Are you sure you want to delete this dashboard?')) {
      removeDashboard(dashboardId);
      toast.success('Dashboard deleted successfully');
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    if (result.type === 'dashboards') {
      const items = Array.from(dashboards);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      // Update dashboards order if needed
    }
  };

  const sortDashboards = (dashboards: Dashboard[]) => {
    switch (sortBy) {
      case 'recent':
        return [...dashboards].sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      case 'created':
        return [...dashboards].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'name':
        return [...dashboards].sort((a, b) => a.title.localeCompare(b.title));
      case 'charts':
        return [...dashboards].sort((a, b) => b.charts - a.charts);
      default:
        return dashboards;
    }
  };

  const filteredDashboards = sortDashboards(
    dashboards.filter(dashboard => 
      dashboard.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dashboard.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboards</h1>
          <p className="text-muted-foreground">Create and manage custom dashboards</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={handleCreateDashboard}
        >
          <PlusIcon className="h-4 w-4" />
          Create Dashboard
        </Button>
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
        <Select value={sortBy} onValueChange={setSortBy}>
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
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleEditDashboard(dashboard.id)}
                            >
                              <EditIcon className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleViewDashboard(dashboard.id)}
                            >
                              View
                            </Button>
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
