
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchIcon, FilterIcon, XIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Filter {
  type: 'source' | 'time';
  value: string;
  label: string;
}

interface AlertFiltersProps {
  selectedSeverity: string;
  setSelectedSeverity: (severity: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilters: Filter[];
  filterInputs: { source: string; time: string };
  setFilterInputs: (inputs: { source: string; time: string }) => void;
  addFilter: (type: Filter['type'], value: string, label: string) => void;
  removeFilter: (index: number) => void;
  clearAllFilters: () => void;
}

const AlertFilters: React.FC<AlertFiltersProps> = ({
  selectedSeverity,
  setSelectedSeverity,
  searchQuery,
  setSearchQuery,
  activeFilters,
  filterInputs,
  setFilterInputs,
  addFilter,
  removeFilter,
  clearAllFilters,
}) => {
  return (
    <div className="pb-2">
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alerts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select 
            value={selectedSeverity} 
            onValueChange={setSelectedSeverity}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All severities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <FilterIcon className="h-4 w-4" />
                {activeFilters.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-4" align="end">
              <div className="space-y-4">
                <h4 className="font-medium leading-none">Filters</h4>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Source</label>
                    <Input
                      placeholder="Source name..."
                      value={filterInputs.source}
                      onChange={(e) => setFilterInputs({ ...filterInputs, source: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && filterInputs.source) {
                          addFilter('source', filterInputs.source, filterInputs.source);
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Date</label>
                    <Input
                      type="date"
                      value={filterInputs.time}
                      onChange={(e) => setFilterInputs({ ...filterInputs, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (filterInputs.source) addFilter('source', filterInputs.source, filterInputs.source);
                      if (filterInputs.time) addFilter('time', filterInputs.time, new Date(filterInputs.time).toLocaleDateString());
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 pt-3">
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            {activeFilters.map((filter, index) => (
              <div
                key={`${filter.type}-${filter.value}`}
                className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm"
              >
                <span className="text-muted-foreground mr-1">{filter.type}:</span>
                <span className="font-medium">{filter.label}</span>
                <button
                  onClick={() => removeFilter(index)}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-sm text-primary hover:underline"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertFilters;
