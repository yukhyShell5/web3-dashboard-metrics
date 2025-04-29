
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DataSourceTabProps {
  dataSource: string;
  setDataSource: (source: string) => void;
  autoRefresh: boolean;
  setAutoRefresh: (refresh: boolean) => void;
  refreshInterval: string;
  setRefreshInterval: (interval: string) => void;
}

const DataSourceTab: React.FC<DataSourceTabProps> = ({
  dataSource,
  setDataSource,
  autoRefresh,
  setAutoRefresh,
  refreshInterval,
  setRefreshInterval
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="data-source">Data Source</Label>
        <Select value={dataSource} onValueChange={setDataSource}>
          <SelectTrigger>
            <SelectValue placeholder="Select data source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mock">Mock Data</SelectItem>
            <SelectItem value="api">API Endpoint</SelectItem>
            <SelectItem value="realtime">Realtime Data</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="auto-refresh"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="form-checkbox h-4 w-4"
          />
          <Label htmlFor="auto-refresh">Auto Refresh</Label>
        </div>
        
        {autoRefresh && (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(e.target.value)}
              className="max-w-[100px]"
              min="5"
            />
            <span className="text-sm text-muted-foreground">seconds</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataSourceTab;
