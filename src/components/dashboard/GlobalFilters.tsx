
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, FilterX } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import { WidgetFilter } from '@/types/widget';

const GlobalFilters: React.FC = () => {
  const { globalFilters, updateGlobalFilter, removeGlobalFilter, clearGlobalFilters } = useDashboard();
  
  if (globalFilters.length === 0) {
    return null;
  }
  
  const getFilterLabel = (filter: WidgetFilter): string => {
    const { field, operator, value, label } = filter;
    
    if (label) return label;
    
    switch (operator) {
      case 'equals':
        return `${field} = ${value}`;
      case 'contains':
        return `${field} contains "${value}"`;
      case 'gt':
        return `${field} > ${value}`;
      case 'lt':
        return `${field} < ${value}`;
      case 'between':
        const [min, max] = String(value).split(',');
        return `${field} between ${min} and ${max}`;
      default:
        return `${field} ${operator} ${value}`;
    }
  };
  
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <div className="text-sm font-medium">Filters:</div>
      
      {globalFilters.map(filter => (
        <Badge 
          key={filter.id}
          variant={filter.isActive ? "default" : "outline"}
          className="flex items-center gap-1 px-2 py-1"
        >
          <span onClick={() => updateGlobalFilter(filter.id, { isActive: !filter.isActive })} className="cursor-pointer">
            {getFilterLabel(filter)}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-4 w-4 p-0"
            onClick={() => removeGlobalFilter(filter.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
      
      {globalFilters.length > 0 && (
        <Button 
          variant="ghost" 
          size="sm"
          className="h-7 px-2"
          onClick={clearGlobalFilters}
        >
          <FilterX className="h-4 w-4 mr-1" />
          Clear all
        </Button>
      )}
    </div>
  );
};

export default GlobalFilters;
