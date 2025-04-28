
import React, { useState } from 'react';
import { WidgetFilter } from '@/types/widget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Filter } from 'lucide-react';

interface WidgetFiltersProps {
  filters: WidgetFilter[];
  onFilterChange: (filters: WidgetFilter[]) => void;
  fields: string[];
}

export default function WidgetFilters({ filters, onFilterChange, fields }: WidgetFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newFilter, setNewFilter] = useState<Partial<WidgetFilter>>({
    field: fields[0],
    operator: 'equals',
    value: '',
    isActive: true
  });

  const handleAddFilter = () => {
    if (!newFilter.field || !newFilter.operator || newFilter.value === '') return;

    const filter: WidgetFilter = {
      id: Date.now().toString(),
      field: newFilter.field!,
      operator: newFilter.operator as WidgetFilter['operator'],
      value: newFilter.value!,
      isActive: true
    };

    onFilterChange([...filters, filter]);
    setNewFilter({
      field: fields[0],
      operator: 'equals',
      value: '',
      isActive: true
    });
  };

  const handleRemoveFilter = (id: string) => {
    onFilterChange(filters.filter(filter => filter.id !== id));
  };

  const handleToggleFilter = (id: string) => {
    onFilterChange(
      filters.map(filter => 
        filter.id === id ? { ...filter, isActive: !filter.isActive } : filter
      )
    );
  };

  return (
    <div className="widget-filters">
      <Button
        variant="outline"
        size="sm"
        className="mb-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Filter className="h-4 w-4 mr-1" />
        Filters {filters.length > 0 && `(${filters.length})`}
      </Button>

      {isExpanded && (
        <div className="p-2 border rounded-md mb-2 space-y-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {filters.map(filter => (
              <Badge 
                key={filter.id} 
                variant={filter.isActive ? "default" : "outline"}
                className="cursor-pointer flex items-center gap-1"
              >
                <span onClick={() => handleToggleFilter(filter.id)}>
                  {filter.field} {getOperatorSymbol(filter.operator)} {filter.value}
                </span>
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleRemoveFilter(filter.id)} 
                />
              </Badge>
            ))}
            {filters.length === 0 && <span className="text-sm text-muted-foreground">No filters applied</span>}
          </div>

          <div className="flex items-center space-x-2">
            <Select 
              value={newFilter.field} 
              onValueChange={(value) => setNewFilter({...newFilter, field: value})}
            >
              <SelectTrigger className="w-[30%]">
                <SelectValue placeholder="Field" />
              </SelectTrigger>
              <SelectContent>
                {fields.map(field => (
                  <SelectItem key={field} value={field}>{field}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={newFilter.operator} 
              onValueChange={(value: any) => setNewFilter({...newFilter, operator: value})}
            >
              <SelectTrigger className="w-[30%]">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">=</SelectItem>
                <SelectItem value="contains">Contains</SelectItem>
                <SelectItem value="gt">&gt;</SelectItem>
                <SelectItem value="lt">&lt;</SelectItem>
                <SelectItem value="between">Between</SelectItem>
              </SelectContent>
            </Select>

            <Input 
              className="w-[30%]"
              placeholder="Value" 
              value={newFilter.value || ''}
              onChange={(e) => setNewFilter({...newFilter, value: e.target.value})}
            />

            <Button size="icon" onClick={handleAddFilter} disabled={!newFilter.field || !newFilter.operator || newFilter.value === ''}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function getOperatorSymbol(operator: WidgetFilter['operator']): string {
  switch(operator) {
    case 'equals': return '=';
    case 'contains': return '⊃';
    case 'gt': return '>';
    case 'lt': return '<';
    case 'between': return '↔';
    default: return '=';
  }
}
