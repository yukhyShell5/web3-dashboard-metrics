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
  Eye,
  AlertCircleIcon,
  XIcon
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { alertsApi } from '@/services/apiService';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertDetails } from './AlertDetails';

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface AlertItemProps {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
  source: string;
}

interface Filter {
  type: 'source' | 'time';
  value: string;
  label: string;
}

interface RecentAlertsProps {
  activeSeverity?: string | null;
  selectedAlertId?: string | null;
}

export default function RecentAlerts({ activeSeverity, selectedAlertId }: RecentAlertsProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [filterInputs, setFilterInputs] = useState({
    source: '',
    time: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAlert, setSelectedAlert] = useState<AlertItemProps | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const alertsPerPage = 10;

  const { data: apiAlerts = [], isLoading, isError } = useQuery({
    queryKey: ['alerts'],
    queryFn: alertsApi.getAlerts,
    refetchInterval: 30000,
  });

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
    return 'medium';
  }

  const addFilter = (type: Filter['type'], value: string, label: string) => {
    if (!value) return;

    const filterExists = activeFilters.some(
      filter => filter.type === type && filter.value === value
    );

    if (!filterExists) {
      setActiveFilters([...activeFilters, { type, value, label }]);
      setCurrentPage(1); // Reset to first page when adding a new filter
    }

    setFilterInputs({ ...filterInputs, [type]: '' });
  };

  const removeFilter = (index: number) => {
    const newFilters = [...activeFilters];
    newFilters.splice(index, 1);
    setActiveFilters(newFilters);
    setCurrentPage(1); // Reset to first page when removing a filter
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSelectedSeverity('all');
    setSearchQuery('');
    setFilterInputs({
      source: '',
      time: ''
    });
    setCurrentPage(1); // Reset to first page when clearing all filters
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    const matchesSearch = searchQuery === '' ||
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActiveFilter = !activeSeverity || alert.severity === activeSeverity;
    const matchesSelectedAlert = !selectedAlertId || alert.id === selectedAlertId;
    const matchesActiveFilters = activeFilters.every(filter => {
      switch (filter.type) {
        case 'source':
          return alert.source.toLowerCase() === filter.value.toLowerCase();
        case 'time':
          return alert.timestamp.includes(filter.value);
        default:
          return true;
      }
    });

    return matchesSeverity && matchesSearch && matchesActiveFilters && matchesActiveFilter && matchesSelectedAlert;
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

  const indexOfLastAlert = currentPage * alertsPerPage;
  const indexOfFirstAlert = indexOfLastAlert - alertsPerPage;
  const currentAlerts = sortedAlerts.slice(indexOfFirstAlert, indexOfLastAlert);
  const totalPages = Math.ceil(sortedAlerts.length / alertsPerPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when changing sort
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
        return <Badge variant="outline" className="bg-red-500/20 text-red-500">Critical</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-500/20 text-orange-500">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-500">Low</Badge>;
      case 'info':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500">Info</Badge>;
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
      <CardHeader className="pb-2">
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription className="pt-1">
              Recent security alerts detected on monitored addresses
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
              />
            </div>
            <Select 
              value={selectedSeverity} 
              onValueChange={(value) => {
                setSelectedSeverity(value);
                setCurrentPage(1); // Reset to first page when changing severity filter
              }}
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
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
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
                {currentAlerts.length > 0 ? (
                  currentAlerts.map((alert) => (
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
                        <button 
                          className="
                            p-2 
                            rounded
                            border 
                            border-muted-foreground/20 
                            hover:border-primary/80 
                            text-muted-foreground 
                            hover:text-primary
                            transition-all
                            duration-200
                            hover:shadow-sm
                            hover:bg-primary/5
                            group
                          "
                          onClick={() => {
                            setSelectedAlert(alert);
                            setIsDetailsOpen(true);
                          }}
                        >
                          <Eye className="
                            h-4 w-4 
                            group-hover:scale-110 
                            transition-transform
                          " />
                        </button>
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

            {sortedAlerts.length > alertsPerPage && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Affichage des alertes {indexOfFirstAlert + 1}-{Math.min(indexOfLastAlert, sortedAlerts.length)} sur {sortedAlerts.length}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>

      <AlertDetails 
        alert={selectedAlert}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedAlert(null);
        }}
      />
    </Card>
  );
}
