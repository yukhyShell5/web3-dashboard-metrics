import { useState, useEffect, useCallback, useMemo } from 'react';
import { Widget, WidgetDataSource, WidgetFilter } from '@/types/widget';

interface UseWidgetDataProps {
  widget: Widget;
  forceRefresh?: number; // timestamp to force refresh
  globalFilters?: WidgetFilter[]; // added global filters
}

interface UseWidgetDataResult {
  data: any[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
  lastUpdated: string | null;
}

// Helper function to apply filters to data
const applyFilters = (data: any[], filters: WidgetFilter[]): any[] => {
  if (!filters || filters.length === 0) {
    return data;
  }

  return data.filter(item => {
    return filters.every(filter => {
      if (!filter.isActive) return true;
      
      const value = item[filter.field];
      switch (filter.operator) {
        case 'equals':
          return value == filter.value; // Use == to allow type coercion
        case 'contains':
          return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
        case 'gt':
          return Number(value) > Number(filter.value);
        case 'lt':
          return Number(value) < Number(filter.value);
        case 'between':
          const [min, max] = String(filter.value).split(',').map(Number);
          return Number(value) >= min && Number(value) <= max;
        default:
          return true;
      }
    });
  });
};

export const useWidgetData = ({ widget, forceRefresh, globalFilters = [] }: UseWidgetDataProps): UseWidgetDataResult => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Mock data based on widget type
  const getMockData = useCallback(() => {
    switch (widget.type) {
      case 'bar':
        return [
          { name: 'Jan', value: Math.floor(Math.random() * 500) },
          { name: 'Feb', value: Math.floor(Math.random() * 500) },
          { name: 'Mar', value: Math.floor(Math.random() * 500) },
          { name: 'Apr', value: Math.floor(Math.random() * 500) },
          { name: 'May', value: Math.floor(Math.random() * 500) },
        ];
      case 'line':
        return [
          { day: 'Mon', value: Math.floor(Math.random() * 50) },
          { day: 'Tue', value: Math.floor(Math.random() * 50) },
          { day: 'Wed', value: Math.floor(Math.random() * 50) },
          { day: 'Thu', value: Math.floor(Math.random() * 50) },
          { day: 'Fri', value: Math.floor(Math.random() * 50) },
          { day: 'Sat', value: Math.floor(Math.random() * 50) },
          { day: 'Sun', value: Math.floor(Math.random() * 50) },
        ];
      case 'pie':
        return [
          { name: 'A', value: Math.floor(Math.random() * 500) },
          { name: 'B', value: Math.floor(Math.random() * 500) },
          { name: 'C', value: Math.floor(Math.random() * 500) },
          { name: 'D', value: Math.floor(Math.random() * 500) },
        ];
      case 'scatter':
        return Array.from({ length: 50 }, (_, i) => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
          z: Math.random() * 20 + 5,
          name: `Point ${i + 1}`
        }));
      case 'heatmap':
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const hours = Array.from({ length: 24 }, (_, i) => i);
        
        return days.flatMap(day => 
          hours.map(hour => ({
            day,
            hour,
            value: Math.floor(Math.random() * 100)
          }))
        );
      case 'gauge':
        return [{ value: Math.floor(Math.random() * 100) }];
      default:
        return [];
    }
  }, [widget.type]);

  // Function to transform data
  const transformData = useCallback((rawData: any[]) => {
    const { dataSourceConfig } = widget;
    
    if (!dataSourceConfig?.transformFunction) {
      return rawData;
    }

    try {
      // Safely evaluate the transform function
      const transformFn = new Function('data', dataSourceConfig.transformFunction);
      return transformFn(rawData);
    } catch (error) {
      console.error('Error transforming data:', error);
      return rawData;
    }
  }, [widget]);

  // Function to fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { dataSourceConfig } = widget;
      let rawData: any[] = [];

      if (!dataSourceConfig || dataSourceConfig.type === 'mock') {
        // Use mock data if no source config or type is mock
        rawData = dataSourceConfig?.mockData || getMockData();
      } else if (dataSourceConfig.type === 'api' && dataSourceConfig.url) {
        // Fetch from API
        const response = await fetch(dataSourceConfig.url);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        rawData = await response.json();
      }

      // Apply transformation if needed
      const transformedData = transformData(rawData);
      setData(transformedData);
      
      const now = new Date().toISOString();
      setLastUpdated(now);
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Error fetching widget data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [widget, getMockData, transformData]);

  // Apply both widget-specific filters and global filters
  const filteredData = useMemo(() => {
    // First apply widget-specific filters
    let result = data;
    
    if (widget.config.filters && widget.config.filters.length > 0) {
      result = applyFilters(result, widget.config.filters);
    }
    
    // Then apply global filters
    if (globalFilters.length > 0) {
      result = applyFilters(result, globalFilters);
    }
    
    return result;
  }, [data, widget.config.filters, globalFilters]);

  // Function to manually refresh data
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Effect to fetch data on mount and when forceRefresh changes
  useEffect(() => {
    fetchData();
  }, [fetchData, forceRefresh]);

  // Effect to set up auto-refresh if enabled
  useEffect(() => {
    const { config, dataSourceConfig } = widget;
    
    if (config?.autoRefresh && config.refreshInterval && config.refreshInterval > 0) {
      const interval = setInterval(() => {
        fetchData();
      }, config.refreshInterval);
      
      return () => clearInterval(interval);
    }
    
    if (dataSourceConfig?.refreshInterval && dataSourceConfig.refreshInterval > 0) {
      const interval = setInterval(() => {
        fetchData();
      }, dataSourceConfig.refreshInterval);
      
      return () => clearInterval(interval);
    }
    
    return undefined;
  }, [widget, fetchData]);

  return { data: filteredData, isLoading, error, refresh, lastUpdated };
};
