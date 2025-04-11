// components/analytics/RecentAlerts.tsx
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  SearchIcon, 
  FilterIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  AlertCircleIcon 
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { alertsApi } from '@/services/apiService';

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface AlertItemProps {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
  source: string;
}

export default function RecentAlerts() {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const { data: apiAlerts = [], isLoading, isError } = useQuery({
    queryKey: ['alerts'],
    queryFn: alertsApi.getAlerts,
    refetchInterval: 30000, // Rafraîchit toutes les 30 secondes
  });

  // Transforme les données de l'API pour correspondre à AlertItemProps
  const alerts: AlertItemProps[] = apiAlerts.map(alert => ({
    id: alert.id.toString(),
    title: alert.alert_type,
    description: alert.reason,
    severity: mapSeverity(alert.severity),
    timestamp: alert.date,
    source: alert.source || 'Unknown'
  }));

  function mapSeverity(severity: string): AlertSeverity {
    const lowerSeverity = severity.toLowerCase();
    if (['critical', 'high', 'medium', 'low', 'info'].includes(lowerSeverity)) {
      return lowerSeverity as AlertSeverity;
    }
    return 'medium'; // Valeur par défaut
  }

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'source':
        comparison = a.source.localeCompare(b.source);
        break;
      case 'severity': {
        const severityOrder = { critical: 5, high: 4, medium: 3, low: 2, info: 1 };
        comparison = (severityOrder[a.severity] || 0) - (severityOrder[b.severity] || 0);
        break;
      }
      case 'timestamp':
        comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        break;
      default:
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' 
      ? <ArrowUpIcon className="ml-1 h-4 w-4" /> 
      : <ArrowDownIcon className="ml-1 h-4 w-4" />;
  };

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Critical</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Low</Badge>;
      case 'info':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Info</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <AlertCircleIcon className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-500">Failed to load alerts</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Alerts</CardTitle>
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
      <CardDescription className="px-6">
        Recent security alerts detected on monitored addresses
      </CardDescription>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort('title')}>
                  <div className="flex items-center">
                    Alert
                    {getSortIcon('title')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('source')}>
                  <div className="flex items-center">
                    Source
                    {getSortIcon('source')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('severity')}>
                  <div className="flex items-center">
                    Severity
                    {getSortIcon('severity')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('timestamp')}>
                  <div className="flex items-center">
                    Time
                    {getSortIcon('timestamp')}
                  </div>
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAlerts.length > 0 ? (
                sortedAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{alert.title}</div>
                        <div className="text-xs text-muted-foreground">{alert.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Ethereum</Badge>
                    </TableCell>
                    <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(alert.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View details
                      </Button>
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
        )}
      </CardContent>
    </Card>
  );
}