
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoveIcon, XIcon, SettingsIcon } from 'lucide-react';
import { Widget as WidgetType } from '@/types/dashboard';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import { StatCard } from '@/components/StatCard';

// Mock data for charts
const mockData = {
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
  ],
  stats: {
    totalTransactions: '1,234',
    activeAlerts: '23',
    totalAddresses: '56',
    pendingRules: '7'
  }
};

interface WidgetProps {
  widget: WidgetType;
  isEditing: boolean;
  onRemove?: (id: string) => void;
  onConfigure?: (id: string) => void;
}

const Widget: React.FC<WidgetProps> = ({
  widget,
  isEditing,
  onRemove,
  onConfigure
}) => {
  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'bar':
        return (
          <BarChart
            data={mockData.bar}
            xDataKey="name"
            height={widget.position.h * 50}
            bars={[{ dataKey: 'value', name: 'Value', stroke: widget.config.colorScheme?.[0] || '#3b82f6' }]}
          />
        );
      case 'line':
        return (
          <LineChart
            data={mockData.line}
            xDataKey="day"
            height={widget.position.h * 50}
            lines={[{ dataKey: 'value', name: 'Value', stroke: widget.config.colorScheme?.[0] || '#8b5cf6' }]}
          />
        );
      case 'pie':
        return (
          <PieChart
            data={mockData.pie}
            dataKey="value"
            nameKey="name"
            height={widget.position.h * 50}
            colors={widget.config.colorScheme || ['#3b82f6', '#8b5cf6', '#10b981', '#ef4444']}
          />
        );
      case 'stat':
        const value = widget.config.value ? mockData.stats[widget.config.value as keyof typeof mockData.stats] : '0';
        return (
          <StatCard
            title={widget.title}
            value={value}
            trend={widget.config.trend}
            trendDirection={widget.config.trendDirection === 'up' ? 'up' : 'down'}
          />
        );
      default:
        return <div>Unsupported widget type</div>;
    }
  };

  return (
    <Card className="w-full h-full overflow-hidden">
      <CardHeader className="p-3 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
          {isEditing && (
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 cursor-move"
                aria-label="Move widget"
              >
                <MoveIcon className="h-3 w-3" />
              </Button>
              {onConfigure && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => onConfigure(widget.id)}
                  aria-label="Configure widget"
                >
                  <SettingsIcon className="h-3 w-3" />
                </Button>
              )}
              {onRemove && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => onRemove(widget.id)}
                  aria-label="Remove widget"
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        {renderWidgetContent()}
      </CardContent>
    </Card>
  );
};

export default Widget;
