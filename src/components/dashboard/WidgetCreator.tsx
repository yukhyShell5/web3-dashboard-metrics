import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "@/hooks/use-toast";
import { WidgetType } from '@/types/widget';
import { BarChart2Icon, LineChartIcon, PieChartIcon, GaugeIcon, LayoutDashboardIcon, TableIcon, GridIcon, ScatterChartIcon } from 'lucide-react';

interface WidgetCreatorProps {
  onAddWidget: (widget: {
    title: string;
    type: WidgetType;
    config: Record<string, any>;
  }) => void;
  onCancel: () => void;
}

// Widget type options with their respective icons
const widgetTypes = [
  { type: 'bar' as WidgetType, title: 'Bar Chart', icon: <BarChart2Icon className="h-5 w-5" /> },
  { type: 'line' as WidgetType, title: 'Line Chart', icon: <LineChartIcon className="h-5 w-5" /> },
  { type: 'pie' as WidgetType, title: 'Pie Chart', icon: <PieChartIcon className="h-5 w-5" /> },
  { type: 'stat' as WidgetType, title: 'Stat Card', icon: <LayoutDashboardIcon className="h-5 w-5" /> },
  { type: 'gauge' as WidgetType, title: 'Gauge', icon: <GaugeIcon className="h-5 w-5" /> },
  { type: 'table' as WidgetType, title: 'Table', icon: <TableIcon className="h-5 w-5" /> },
  { type: 'heatmap' as WidgetType, title: 'Heatmap', icon: <GridIcon className="h-5 w-5" /> },
  { type: 'scatter' as WidgetType, title: 'Scatter Plot', icon: <ScatterChartIcon className="h-5 w-5" /> },
];

// Color scheme options
const colorSchemes = [
  { id: 'blue', colors: ['#3b82f6', '#60a5fa', '#93c5fd'] },
  { id: 'green', colors: ['#10b981', '#34d399', '#6ee7b7'] },
  { id: 'purple', colors: ['#8b5cf6', '#a78bfa', '#c4b5fd'] },
  { id: 'orange', colors: ['#f59e0b', '#fbbf24', '#fcd34d'] },
  { id: 'red', colors: ['#ef4444', '#f87171', '#fca5a5'] },
  { id: 'multi', colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'] },
];

const WidgetCreator: React.FC<WidgetCreatorProps> = ({ onAddWidget, onCancel }) => {
  // Widget configuration state
  const [title, setTitle] = useState('New Widget');
  const [type, setType] = useState<WidgetType>('bar');
  const [colorScheme, setColorScheme] = useState('blue');
  const [showLegend, setShowLegend] = useState(true);
  const [metric, setMetric] = useState('value');
  const [dimension, setDimension] = useState('name');
  const [dataSource, setDataSource] = useState('mock');
  const [refreshInterval, setRefreshInterval] = useState('60');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [visualizationType, setVisualizationType] = useState('default');

  const handleSubmit = () => {
    // Get the color array from the selected color scheme
    const colors = colorSchemes.find(scheme => scheme.id === colorScheme)?.colors || colorSchemes[0].colors;

    // Create widget configuration based on the current state
    const widgetConfig = {
      title,
      type,
      config: {
        colorScheme: colors,
        showLegend,
        dataKey: metric,
        xDataKey: dimension,
        dataSource,
        autoRefresh,
        refreshInterval: autoRefresh ? parseInt(refreshInterval, 10) * 1000 : undefined,
        visualizationType,
      }
    };

    onAddWidget(widgetConfig);
    toast({
      title: "Widget configured",
      description: `${title} widget has been configured and ready to add`
    });
  };

  return (
    <div className="widget-creator bg-background border rounded-md shadow-md">
      <div className="p-4 border-b flex justify-between items-center bg-muted/30">
        <h3 className="text-lg font-medium">Configure Widget</h3>
      </div>

      <div className="p-4">
        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
            <TabsTrigger value="data">Data Source</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metric">Metric</Label>
                <Select value={metric} onValueChange={setMetric}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="value">Value</SelectItem>
                    <SelectItem value="count">Count</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="sum">Sum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dimension">Dimension</Label>
                <Select value={dimension} onValueChange={setDimension}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dimension" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="hour">Hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* Visualization Tab */}
          <TabsContent value="visualization" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Widget Type</Label>
                <div className="grid grid-cols-4 gap-2">
                  {widgetTypes.map((widgetType) => (
                    <Card 
                      key={widgetType.type}
                      className={`cursor-pointer transition-all hover:border-primary ${
                        type === widgetType.type ? 'border-2 border-primary' : ''
                      }`}
                      onClick={() => setType(widgetType.type)}
                    >
                      <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                        <div className="h-10 w-10 flex items-center justify-center mb-2">
                          {widgetType.icon}
                        </div>
                        <span className="text-sm">{widgetType.title}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Visualization Options</Label>
                <Select 
                  value={visualizationType}
                  onValueChange={setVisualizationType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Visualization type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="stacked">Stacked (Bar/Area)</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="bubble">Bubble (Scatter)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Color Scheme</Label>
                <Select 
                  value={colorScheme}
                  onValueChange={setColorScheme}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select color scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorSchemes.map((scheme) => (
                      <SelectItem key={scheme.id} value={scheme.id}>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {scheme.colors.slice(0, 3).map((color, i) => (
                              <div 
                                key={i}
                                className="w-4 h-4 rounded-full ml-[-0.375rem] border border-background"
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

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="show-legend"
                  checked={showLegend}
                  onChange={(e) => setShowLegend(e.target.checked)}
                  className="form-checkbox h-4 w-4"
                />
                <Label htmlFor="show-legend">Show Legend</Label>
              </div>
            </div>
          </TabsContent>

          {/* Data Source Tab */}
          <TabsContent value="data" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="data-source">Data Source</Label>
                <Select value={dataSource} onValueChange={setDataSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mock">Mock Data</SelectItem>
                    <SelectItem value="api">API Endpoint</SelectItem>
                    <SelectItem value="realtime">Realtime Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="auto-refresh"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="form-checkbox h-4 w-4"
                  />
                  <Label htmlFor="auto-refresh">Auto Refresh</Label>
                </div>
                
                {autoRefresh && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={refreshInterval}
                      onChange={(e) => setRefreshInterval(e.target.value)}
                      className="max-w-[100px]"
                      min="5"
                    />
                    <span className="text-sm text-muted-foreground">seconds</span>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="widget-title">Widget Title</Label>
              <Input
                id="widget-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter widget title"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="p-4 border-t bg-muted/30 flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          Add Widget
        </Button>
      </div>
    </div>
  );
};

export default WidgetCreator;
