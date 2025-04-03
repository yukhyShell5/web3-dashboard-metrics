import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AlertItem, { AlertItemProps, AlertSeverity } from '@/components/AlertItem';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon, FilterIcon, BellRingIcon } from 'lucide-react';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreVerticalIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Mock alerts data
const mockAlerts: AlertItemProps[] = [
  {
    id: '1',
    title: 'Suspicious Transaction Detected',
    description: 'Large ETH transaction (>100 ETH) from monitored address 0x1a2...3b4c to known exchange.',
    severity: 'critical',
    timestamp: '2023-08-10T10:30:00Z',
    source: 'Ethereum'
  },
  {
    id: '2',
    title: 'Repeated Failed Transactions',
    description: 'Multiple failed transactions detected from address 0x4d5...6e7f over the last hour.',
    severity: 'high',
    timestamp: '2023-08-10T09:45:00Z',
    source: 'Polygon'
  },
  {
    id: '3',
    title: 'Smart Contract Interaction',
    description: 'Interaction with flagged smart contract 0x7g8...9h0i.',
    severity: 'medium',
    timestamp: '2023-08-10T08:15:00Z',
    source: 'Arbitrum'
  },
  {
    id: '4',
    title: 'New Address Interaction',
    description: 'Monitored address 0x1a2...3b4c interacted with a new address 0xb1c...d2e3.',
    severity: 'low',
    timestamp: '2023-08-10T07:30:00Z',
    source: 'Optimism'
  },
  {
    id: '5',
    title: 'Gas Price Anomaly',
    description: 'Unusual gas price used for transaction from monitored address.',
    severity: 'info',
    timestamp: '2023-08-10T06:15:00Z',
    source: 'Ethereum'
  }
];

const Analytics = () => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlerts = mockAlerts.filter((alert) => {
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

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

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="outline" className="alert-badge-critical">Critical</Badge>;
      case 'high':
        return <Badge variant="outline" className="alert-badge-high">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="alert-badge-medium">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="alert-badge-low">Low</Badge>;
      case 'info':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Info</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Alerts</h1>
          <p className="text-muted-foreground">Monitor blockchain security events and alerts</p>
        </div>
        <Button className="flex items-center gap-2" variant="default">
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

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>
            Recent security alerts detected on monitored addresses
          </CardDescription>
        </CardHeader>
        <CardHeader className="pb-0 pt-0">
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
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
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
            <Button variant="outline" size="icon">
              <FilterIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Time</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{alert.title}</div>
                        <div className="text-xs text-muted-foreground">{alert.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{alert.source}</Badge>
                    </TableCell>
                    <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(alert.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVerticalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Mark as resolved</DropdownMenuItem>
                          <DropdownMenuItem>Create rule</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Ignore</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No alerts match your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
