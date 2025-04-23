
import { useState } from 'react';
import { AlertItemProps, AlertSeverity } from '@/components/analytics/RecentAlerts';
import { useQuery } from '@tanstack/react-query';
import { alertsApi } from '@/services/apiService';

// Define the missing Filter type
export interface Filter {
  type: 'source' | 'time';
  value: string;
  label: string;
}

export interface UseAlertsDataProps {
  activeSeverity?: string | null;
  selectedAlertId?: string | null;
  activeType?: string | null;
}

export const useAlertsData = ({ activeSeverity, selectedAlertId, activeType }: UseAlertsDataProps) => {
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
      setCurrentPage(1);
    }
    setFilterInputs({ ...filterInputs, [type]: '' });
  };

  const removeFilter = (index: number) => {
    const newFilters = [...activeFilters];
    newFilters.splice(index, 1);
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSelectedSeverity('all');
    setSearchQuery('');
    setFilterInputs({ source: '', time: '' });
    setCurrentPage(1);
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    const matchesSearch = searchQuery === '' ||
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActiveFilter = !activeSeverity || alert.severity === activeSeverity;
    const matchesSelectedAlert = !selectedAlertId || alert.id === selectedAlertId;
    const matchesActiveType = !activeType || alert.title.toLowerCase() === activeType.toLowerCase();
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

    return matchesSeverity && matchesSearch && matchesActiveFilters && matchesActiveFilter && matchesSelectedAlert && matchesActiveType;
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

  return {
    currentAlerts,
    totalPages,
    currentPage,
    setCurrentPage,
    isLoading,
    isError,
    selectedSeverity,
    setSelectedSeverity,
    searchQuery,
    setSearchQuery,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    activeFilters,
    filterInputs,
    setFilterInputs,
    addFilter,
    removeFilter,
    clearAllFilters,
    indexOfFirstAlert,
    indexOfLastAlert,
    sortedAlerts,
  };
};
