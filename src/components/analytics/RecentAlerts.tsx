import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDetails } from './AlertDetails';
import AlertFilters from './AlertFilters';
import AlertTable from './AlertTable';
import AlertPagination from './AlertPagination';
import { useAlertsData } from '@/hooks/useAlertsData';

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface AlertItemProps {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
  source: string;
}

interface RecentAlertsProps {
  activeSeverity?: string | null;
  selectedAlertId?: string | null;
  activeType?: string | null;
}

export default function RecentAlerts({ activeSeverity, selectedAlertId, activeType }: RecentAlertsProps) {
  const [selectedAlert, setSelectedAlert] = useState<AlertItemProps | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const {
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
  } = useAlertsData({ activeSeverity, selectedAlertId, activeType });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
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
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
        <CardDescription>
          Recent security alerts detected on monitored addresses
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <AlertFilters
              selectedSeverity={selectedSeverity}
              setSelectedSeverity={setSelectedSeverity}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeFilters={activeFilters}
              filterInputs={filterInputs}
              setFilterInputs={setFilterInputs}
              addFilter={addFilter}
              removeFilter={removeFilter}
              clearAllFilters={clearAllFilters}
            />

            <AlertTable
              alerts={currentAlerts}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onViewAlert={(alert) => {
                setSelectedAlert(alert);
                setIsDetailsOpen(true);
              }}
            />

            <AlertPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              startIndex={indexOfFirstAlert}
              endIndex={indexOfLastAlert}
              totalItems={sortedAlerts.length}
            />
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
