
import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon, BarChart2Icon, LineChartIcon, PieChartIcon, LayoutDashboardIcon } from 'lucide-react';
import { Widget } from '@/types/dashboard';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface LayoutDesignerProps {
  layoutItems: Widget[];
  onLayoutChange: (layout: any) => void;
  onRemoveWidget: (widgetId: string) => void;
}

const LayoutDesigner: React.FC<LayoutDesignerProps> = ({
  layoutItems,
  onLayoutChange,
  onRemoveWidget
}) => {
  if (layoutItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border rounded-lg p-8 bg-card min-h-[400px]">
        <p className="text-muted-foreground mb-4">No widgets added yet</p>
        <p className="text-sm text-muted-foreground mb-4">
          Add widgets from the left panel or choose a template
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-card min-h-[400px]">
      <ResponsiveGridLayout
        className="layout"
        layouts={{
          lg: layoutItems.map(item => item.position)
        }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        onLayoutChange={onLayoutChange}
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
                      onRemoveWidget(widget.id);
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
  );
};

export default LayoutDesigner;
