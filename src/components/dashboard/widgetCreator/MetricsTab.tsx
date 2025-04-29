
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MetricsTabProps {
  metric: string;
  setMetric: (value: string) => void;
  dimension: string;
  setDimension: (value: string) => void;
}

const MetricsTab: React.FC<MetricsTabProps> = ({
  metric,
  setMetric,
  dimension,
  setDimension
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="metric">Metric</Label>
        <Select value={metric} onValueChange={setMetric}>
          <SelectTrigger>
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="value">Value</SelectItem>
            <SelectItem value="count">Count</SelectItem>
            <SelectItem value="average">Average</SelectItem>
            <SelectItem value="sum">Sum</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dimension">Dimension</Label>
        <Select value={dimension} onValueChange={setDimension}>
          <SelectTrigger>
            <SelectValue placeholder="Select dimension" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="category">Category</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="hour">Hour</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MetricsTab;
