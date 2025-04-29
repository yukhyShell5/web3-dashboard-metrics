
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { MoveIcon, XIcon, SettingsIcon, RefreshCwIcon, FilterIcon } from 'lucide-react';

interface WidgetHeaderProps {
  title: string;
  lastUpdated: string | null;
  isEditing: boolean;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  handleRefresh: () => void;
  onConfigure?: (id: string) => void;
  onRemove?: (id: string) => void;
  widgetId: string;
  dataFields: string[];
}

const WidgetHeader: React.FC<WidgetHeaderProps> = ({
  title,
  lastUpdated,
  isEditing,
  showFilters,
  setShowFilters,
  handleRefresh,
  onConfigure,
  onRemove,
  widgetId,
  dataFields
}) => {
  return (
    <div className="flex justify-between items-center">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="flex items-center space-x-1">
        {!isEditing && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={handleRefresh}
            aria-label="Refresh widget"
          >
            <RefreshCwIcon className="h-3 w-3" />
          </Button>
        )}
        {!isEditing && dataFields.length > 0 && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Filter data"
          >
            <FilterIcon className="h-3 w-3" />
          </Button>
        )}
        {isEditing && (
          <>
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
                onClick={() => onConfigure(widgetId)}
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
                onClick={() => onRemove(widgetId)}
                aria-label="Remove widget"
              >
                <XIcon className="h-3 w-3" />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WidgetHeader;
