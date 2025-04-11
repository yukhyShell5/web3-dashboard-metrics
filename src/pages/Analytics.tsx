import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  SearchIcon, 
  FilterIcon, 
  BellRingIcon,
  ArrowUpIcon,
  ArrowDownIcon 
} from 'lucide-react';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import RecentAlerts from '@/components/analytics/RecentAlerts';
import { useNavigate } from 'react-router-dom';

// Mock data for charts
const alertsByTypeData = [
  { name: 'Suspicious Tx', value: 32 },
  { name: 'Failed Tx', value: 18 },
  { name: 'Smart Contract', value: 22 },
  { name: 'Address Interaction', value: 14 },
  { name: 'Gas Anomaly', value: 8 },
];

const alertsBySeverityData = [
  { name: 'Critical', value: 12 },
  { name: 'High', value: 24 },
  { name: 'Medium', value: 30 },
  { name: 'Low', value: 18 },
  { name: 'Info', value: 10 },
];

const Analytics = () => {
  const Navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Alerts</h1>
          <p className="text-muted-foreground">Monitor blockchain security events and alerts</p>
        </div>
        <Button className="flex items-center gap-2" variant="default" onClick={() => Navigate('/settings?tab=notifications')}>
          <BellRingIcon className="h-4 w-4" />
          Configure Notifications
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Alert Distribution By Type</CardTitle>
            <CardDescription>Analytics of alert categories</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart 
              data={alertsByTypeData}
              colors={['#ef4444', '#f97316', '#3b82f6', '#a855f7', '#22c55e']}
              height={250}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Alert Distribution By Severity</CardTitle>
            <CardDescription>Breakdown of alerts by severity level</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart 
              data={alertsBySeverityData}
              colors={['#ef4444', '#f97316', '#eab308', '#3b82f6', '#22c55e']}
              height={250}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row flex items-center justify-between">
          <div>
            <CardTitle>Alert Timeline</CardTitle>
            <CardDescription>Alert frequency over time</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <LineChart 
            data={[
              { time: '00:00', critical: 2, high: 3, medium: 5, low: 8, info: 4 },
              { time: '04:00', critical: 1, high: 2, medium: 4, low: 6, info: 3 },
              { time: '08:00', critical: 3, high: 4, medium: 6, low: 10, info: 5 },
              { time: '12:00', critical: 2, high: 3, medium: 7, low: 9, info: 6 },
              { time: '16:00', critical: 4, high: 5, medium: 8, low: 12, info: 7 },
              { time: '20:00', critical: 3, high: 4, medium: 6, low: 8, info: 5 },
            ]}
            xDataKey="time"
            lines={[
              { dataKey: 'critical', stroke: '#ef4444', name: 'Critical' },
              { dataKey: 'high', stroke: '#f97316', name: 'High' },
              { dataKey: 'medium', stroke: '#eab308', name: 'Medium' },
              { dataKey: 'low', stroke: '#3b82f6', name: 'Low' },
              { dataKey: 'info', stroke: '#22c55e', name: 'Info' },
            ]}
          />
        </CardContent>
      </Card>

      <RecentAlerts />
    </div>
  );
};

export default Analytics;