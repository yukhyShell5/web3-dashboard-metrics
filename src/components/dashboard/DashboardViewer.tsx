
import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoveIcon, EditIcon } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Dashboard, LayoutItem } from '@/services/dashboardService';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';

interface DashboardViewerProps {
  dashboard: Dashboard;
  isEditing?: boolean;
  onLayoutChange?: (items: LayoutItem[]) => void;
}

// Mock chart data - in a real app, this would come from the dashboard config
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

// Demo layout items if the dashboard doesn't have any
const demoLayoutItems: LayoutItem[] = [
  { id: 'item-1', type: 'bar', title: 'Monthly Performance' },
  { id: 'item-2', type: 'line', title: 'Daily Trend' },
  { id: 'item-3', type: 'pie', title: 'Distribution' },
];

const DashboardViewer: React.FC<DashboardViewerProps> = ({ 
  dashboard, 
  isEditing = false,
  onLayoutChange 
}) => {
  // Use the dashboard layout if available, otherwise use demo layout
  const [layoutItems, setLayoutItems] = useState<LayoutItem[]>(
    dashboard.layout || demoLayoutItems
  );

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(layoutItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setLayoutItems(items);
    if (onLayoutChange) {
      onLayoutChange(items);
    }
  };

  const renderChart = (item: LayoutItem) => {
    switch (item.type) {
      case 'bar':
        return (
          <BarChart
            data={mockChartData.bar}
            xDataKey="name"
            height={200}
            bars={[{ dataKey: 'value', fill: '#3b82f6', name: 'Value' }]}
          />
        );
      case 'line':
        return (
          <LineChart
            data={mockChartData.line}
            xDataKey="day"
            height={200}
            lines={[{ dataKey: 'value', stroke: '#8b5cf6', name: 'Value' }]}
          />
        );
      case 'pie':
        return (
          <PieChart
            data={mockChartData.pie}
            dataKey="value"
            nameKey="name"
            height={200}
            colors={['#3b82f6', '#8b5cf6', '#22c55e', '#ef4444']}
          />
        );
      case 'area':
        // Fallback to line chart for now
        return (
          <LineChart
            data={mockChartData.line}
            xDataKey="day"
            height={200}
            lines={[{ dataKey: 'value', stroke: '#8b5cf6', name: 'Value' }]}
          />
        );
      default:
        return <div>Chart type not supported</div>;
    }
  };

  return (
    <div className="dashboard-viewer">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard-layout" type="dashboard-items">
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="w-full"
            >
              <ResizablePanelGroup direction="vertical" className="min-h-[500px] w-full">
                {layoutItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ResizablePanel defaultSize={100 / layoutItems.length}>
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
                                  <CardTitle className="text-base">{item.title}</CardTitle>
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
                                        className="h-6 w-6"
                                      >
                                        <EditIcon className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </CardHeader>
                              <CardContent>
                                {renderChart(item)}
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
      </DragDropContext>
    </div>
  );
};

export default DashboardViewer;
