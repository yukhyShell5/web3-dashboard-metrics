
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { widgetTemplates } from './templates';

interface WidgetSelectorProps {
  onAddWidget: (widgetId: string) => void;
}

const WidgetSelector: React.FC<WidgetSelectorProps> = ({ onAddWidget }) => {
  return (
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
            onClick={() => onAddWidget(widget.id)}
          >
            <CardContent className="p-3 flex items-center gap-2">
              {widget.icon}
              <span className="text-sm">{widget.title}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WidgetSelector;
