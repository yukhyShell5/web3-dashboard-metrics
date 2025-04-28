
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { WidgetDataSource } from '@/types/widget';

interface WidgetDataSourceSelectorProps {
  dataSource: WidgetDataSource | undefined;
  onChange: (dataSource: WidgetDataSource) => void;
}

export default function WidgetDataSourceSelector({ dataSource, onChange }: WidgetDataSourceSelectorProps) {
  const [selectedType, setSelectedType] = useState<WidgetDataSource['type']>(dataSource?.type || 'mock');
  
  const handleTypeChange = (type: WidgetDataSource['type']) => {
    setSelectedType(type);
    
    // Create a new data source with defaults based on the type
    const newDataSource: WidgetDataSource = {
      type,
      ...(type === 'api' ? { url: dataSource?.url || '' } : {}),
      ...(type === 'websocket' ? { url: dataSource?.url || '' } : {}),
      refreshInterval: dataSource?.refreshInterval || 60000,
      mockData: dataSource?.mockData || undefined,
      transformFunction: dataSource?.transformFunction || undefined
    };
    
    onChange(newDataSource);
  };
  
  const handleChange = (field: keyof WidgetDataSource, value: any) => {
    if (!dataSource) return;
    
    onChange({
      ...dataSource,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Data Source Type</Label>
        <Select 
          value={selectedType} 
          onValueChange={(value: WidgetDataSource['type']) => handleTypeChange(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select data source type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mock">Mock Data</SelectItem>
            <SelectItem value="api">API Endpoint</SelectItem>
            <SelectItem value="websocket">WebSocket</SelectItem>
            <SelectItem value="realtime">Real-time Database</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedType === 'api' && (
        <div className="space-y-2">
          <Label>API URL</Label>
          <Input
            placeholder="https://api.example.com/data"
            value={dataSource?.url || ''}
            onChange={(e) => handleChange('url', e.target.value)}
          />
        </div>
      )}

      {selectedType === 'websocket' && (
        <div className="space-y-2">
          <Label>WebSocket URL</Label>
          <Input
            placeholder="wss://ws.example.com"
            value={dataSource?.url || ''}
            onChange={(e) => handleChange('url', e.target.value)}
          />
        </div>
      )}

      {selectedType === 'mock' && (
        <div className="space-y-2">
          <Label>Mock Data (JSON)</Label>
          <Textarea
            rows={5}
            placeholder="[{ 'name': 'Item 1', 'value': 100 }]"
            value={dataSource?.mockData ? JSON.stringify(dataSource.mockData, null, 2) : ''}
            onChange={(e) => {
              try {
                const data = e.target.value ? JSON.parse(e.target.value) : undefined;
                handleChange('mockData', data);
              } catch (error) {
                // Don't update if invalid JSON
              }
            }}
            className="font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">
            Enter valid JSON or leave empty to use generated mock data
          </p>
        </div>
      )}

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-refresh">Auto Refresh</Label>
            <Switch
              id="auto-refresh"
              checked={!!dataSource?.refreshInterval}
              onCheckedChange={(checked) => handleChange('refreshInterval', checked ? 60000 : undefined)}
            />
          </div>

          {dataSource?.refreshInterval && (
            <div className="space-y-2">
              <Label>Refresh Interval (ms)</Label>
              <Input
                type="number"
                min={1000}
                step={1000}
                value={dataSource.refreshInterval}
                onChange={(e) => handleChange('refreshInterval', parseInt(e.target.value) || 60000)}
              />
              <p className="text-xs text-muted-foreground">
                Minimum recommended interval is 1000ms (1 second)
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="transform-fn">Transform Function</Label>
            <Textarea
              id="transform-fn"
              rows={5}
              placeholder="return data.map(item => ({ ...item, value: item.value * 2 }));"
              value={dataSource?.transformFunction || ''}
              onChange={(e) => handleChange('transformFunction', e.target.value)}
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              JavaScript function to transform data before rendering. 
              Use "return" to specify the output.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
