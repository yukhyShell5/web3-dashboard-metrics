
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusIcon, LayoutDashboardIcon, LineChartIcon, BarChart2Icon, PieChartIcon, AreaChartIcon, SearchIcon } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Mock data for dashboards
const mockDashboards = [
  {
    id: '1',
    title: 'Web3 Security Overview',
    description: 'High-level security metrics for monitored addresses',
    charts: 8,
    createdAt: '2023-07-15T10:30:00Z',
    updatedAt: '2023-08-10T14:22:00Z',
  },
  {
    id: '2',
    title: 'Smart Contract Monitor',
    description: 'Detailed analytics for smart contract interactions',
    charts: 6,
    createdAt: '2023-07-20T11:45:00Z',
    updatedAt: '2023-08-09T09:15:00Z',
  },
  {
    id: '3',
    title: 'Transaction Analysis',
    description: 'Deep dive into transaction patterns and anomalies',
    charts: 10,
    createdAt: '2023-07-25T15:20:00Z',
    updatedAt: '2023-08-08T16:30:00Z',
  },
  {
    id: '4',
    title: 'DeFi Risk Monitor',
    description: 'Monitor DeFi protocols and risk exposure',
    charts: 7,
    createdAt: '2023-08-01T09:10:00Z',
    updatedAt: '2023-08-07T11:45:00Z',
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

  const handleAddChart = (chartId: string) => {
    if (!selectedCharts.includes(chartId)) {
      setSelectedCharts([...selectedCharts, chartId]);
    }
  };

  const handleRemoveChart = (chartId: string) => {
    setSelectedCharts(selectedCharts.filter(id => id !== chartId));
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
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Dashboard</DialogTitle>
              <DialogDescription>
                Design a custom dashboard with the charts and metrics you need.
              </DialogDescription>
            </DialogHeader>
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
              <div className="mt-2">
                <Label>Select Charts</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {chartTemplates.map((chart) => (
                    <Button
                      key={chart.id}
                      variant={selectedCharts.includes(chart.id) ? "default" : "outline"}
                      onClick={() => selectedCharts.includes(chart.id) ? handleRemoveChart(chart.id) : handleAddChart(chart.id)}
                      className="h-auto p-4 justify-start gap-2"
                    >
                      {chart.icon}
                      <span>{chart.title}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Dashboard</Button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDashboards.map((dashboard) => (
          <Card key={dashboard.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle>{dashboard.title}</CardTitle>
              <CardDescription>{dashboard.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <div className="text-muted-foreground">
                  {dashboard.charts} charts
                </div>
                <div className="text-muted-foreground">
                  Updated {new Date(dashboard.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button variant="outline" size="sm">Preview</Button>
              <Button variant="default" size="sm">Edit</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard Builder</CardTitle>
          <CardDescription>
            Drag and drop components to create custom dashboards for your Web3 monitoring needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="templates">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="templates">Chart Templates</TabsTrigger>
              <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
            </TabsList>
            <TabsContent value="templates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chartTemplates.map((chart) => (
                  <Button
                    key={chart.id}
                    variant="outline"
                    className="h-auto p-6 justify-start flex-col items-center gap-4"
                  >
                    <div className="p-4 bg-secondary rounded-full">
                      {chart.icon}
                    </div>
                    <div className="text-center">
                      <h3 className="font-medium">{chart.title}</h3>
                      <p className="text-xs text-muted-foreground">{chart.type} chart</p>
                    </div>
                  </Button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="data-sources">
              <div className="p-4 border rounded-md bg-muted/50">
                <h3 className="font-medium mb-2">Available Data Sources</h3>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between p-2 border rounded-md bg-background">
                    <span>Ethereum Blockchain</span>
                    <Button variant="outline" size="sm">Connect</Button>
                  </li>
                  <li className="flex items-center justify-between p-2 border rounded-md bg-background">
                    <span>Smart Contract Events</span>
                    <Button variant="outline" size="sm">Connect</Button>
                  </li>
                  <li className="flex items-center justify-between p-2 border rounded-md bg-background">
                    <span>Alert History</span>
                    <Button variant="outline" size="sm">Connect</Button>
                  </li>
                  <li className="flex items-center justify-between p-2 border rounded-md bg-background">
                    <span>Custom API</span>
                    <Button variant="outline" size="sm">Connect</Button>
                  </li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="layout">
              <div className="p-4 border rounded-md bg-muted/50 text-center">
                <LayoutDashboardIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <h3 className="font-medium mb-2">Dashboard Layout Editor</h3>
                <p className="text-muted-foreground mb-4">Arrange and resize dashboard components</p>
                <Button>Open Layout Editor</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboards;
