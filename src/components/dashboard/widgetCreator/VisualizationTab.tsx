
import React from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WidgetType } from '@/types/widget';

interface VisualizationTabProps {
  type: WidgetType;
  setType: (type: WidgetType) => void;
  widgetTypes: Array<{
    type: WidgetType;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
  visualizationType: string;
  setVisualizationType: (type: string) => void;
  colorScheme: string;
  setColorScheme: (scheme: string) => void;
  colorSchemes: Array<{
    id: string;
    colors: string[];
  }>;
  showLegend: boolean;
  setShowLegend: (show: boolean) => void;
}

const VisualizationTab: React.FC<VisualizationTabProps> = ({
  type,
  setType,
  widgetTypes,
  visualizationType,
  setVisualizationType,
  colorScheme,
  setColorScheme,
  colorSchemes,
  showLegend,
  setShowLegend
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Widget Type</Label>
        <div className="grid grid-cols-4 gap-2">
          {widgetTypes.map((widgetType) => {
            const Icon = widgetType.icon;
            return (
              <Card 
                key={widgetType.type}
                className={`cursor-pointer transition-all hover:border-primary ${
                  type === widgetType.type ? 'border-2 border-primary' : ''
                }`}
                onClick={() => setType(widgetType.type)}
              >
                <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                  <div className="h-10 w-10 flex items-center justify-center mb-2">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm">{widgetType.title}</span>
                </CardContent>
              </Card>
            );
          })}
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
  );
};

export default VisualizationTab;
