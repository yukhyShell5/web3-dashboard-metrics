
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Widget from '../Widget';
import { Widget as WidgetType } from '@/types/widget';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface WidgetsLayoutProps {
  widgets: WidgetType[];
  onLayoutChange: (layout: any) => void;
  onRemoveWidget: (widgetId: string) => void;
  onAddWidgetClick: () => void;
}

const WidgetsLayout: React.FC<WidgetsLayoutProps> = ({
  widgets,
  onLayoutChange,
  onRemoveWidget,
  onAddWidgetClick
}) => {
  // Map widgets to layout format required by GridLayout
  const layouts = {
    lg: widgets.map(widget => ({
      ...widget.position,
      i: widget.id
    }))
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Layout Editor</h2>
        <Button
          onClick={onAddWidgetClick}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Widget
        </Button>
      </div>
      
      {widgets.length > 0 ? (
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={100}
          onLayoutChange={onLayoutChange}
          isDraggable={true}
          isResizable={true}
          margin={[16, 16]}
        >
          {widgets.map(widget => (
            <div key={widget.id} data-grid={widget.position}>
              <Widget 
                widget={widget} 
                isEditing={true} 
                onRemove={onRemoveWidget} 
              />
            </div>
          ))}
        </ResponsiveGridLayout>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No widgets added yet</p>
          <Button
            onClick={onAddWidgetClick}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Add Widget
          </Button>
        </div>
      )}
    </div>
  );
};

export default WidgetsLayout;
