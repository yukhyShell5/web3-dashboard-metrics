// --- START OF FILE RecentAlerts.tsx ---

import { useState, useEffect } from 'react'; // Added useEffect
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDetails } from './AlertDetails';
import AlertFilters from './AlertFilters';
import AlertTable from './AlertTable';
import AlertPagination from './AlertPagination';
import { useAlertsData } from '@/hooks/useAlertsData';
import { useToast } from "@/components/ui/use-toast"; // Import useToast
import { insuranceVaultApi, CompensateRequest } from '@/services/apiService'; // Import API service

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface AlertItemProps {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
  source: string; // This should be the recipient_address for compensation
}

interface RecentAlertsProps {
  activeSeverity?: string | null;
  selectedAlertId?: string | null;
  activeType?: string | null;
}

export default function RecentAlerts({ activeSeverity, selectedAlertId, activeType }: RecentAlertsProps) {
  const [selectedAlert, setSelectedAlert] = useState<AlertItemProps | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast(); // Initialize toast
  const [stablecoinDecimals, setStablecoinDecimals] = useState<number>(6); // Default to 6

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

  useEffect(() => {
    const fetchDecimals = async () => {
      try {
        const vaultInfo = await insuranceVaultApi.getTotalAssets();
        if (vaultInfo && vaultInfo.stablecoin_decimals) {
          setStablecoinDecimals(vaultInfo.stablecoin_decimals);
        }
      } catch (error) {
        console.error("Failed to fetch stablecoin decimals for vault:", error);
        toast({
          title: "Vault Info Error",
          description: "Could not fetch stablecoin decimal information.",
          variant: "destructive",
        });
      }
    };
    fetchDecimals();
  }, [toast]); // Added toast to dependency array if it's stable, otherwise might not be needed

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc'); // Default to asc when changing field
    }
    setCurrentPage(1);
  };

  // --- THIS IS THE NEW FUNCTION ---
  const handleCompensate = async (alert: AlertItemProps) => {
    const amountStr = prompt(`Enter compensation amount (in full units, e.g., 10.50) for alert "${alert.title}" (ID: ${alert.id}) to address ${alert.source}:`);
    if (amountStr === null) {
      return;
    }

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive number for compensation.",
        variant: "destructive",
      });
      return;
    }

    const amountInSmallestUnit = Math.round(amount * (10 ** stablecoinDecimals));
    
    if (confirm(`Are you sure you want to compensate ${amount} units (smallest unit: ${amountInSmallestUnit}) to ${alert.source} for alert ID ${alert.id}?`)) {
      try {
        const requestData: CompensateRequest = {
          recipient_address: alert.source,
          amount_stablecoin_smallest_unit: amountInSmallestUnit,
          alert_id_reference: parseInt(alert.id, 10),
        };

        toast({
          title: "Processing Compensation",
          description: "Sending request to the vault...",
        });

        const result = await insuranceVaultApi.compensate(requestData);
        
        toast({
          title: "Compensation Successful",
          description: `Tx: ${result.compensation_tx_hash}. ${result.message}`
        });
      } catch (error: any) {
        toast({
          title: "Compensation Failed",
          description: error.message || "An unknown error occurred during compensation.",
          variant: "destructive",
        });
      }
    }
  };
  // --- END OF NEW FUNCTION ---


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
            onClick={() => window.location.reload()} // Consider using queryClient.refetchQueries(['alerts']) from react-query
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

            <AlertTable // --- THIS IS WHERE YOU ADD THE PROP ---
              alerts={currentAlerts}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onViewAlert={(alert) => {
                setSelectedAlert(alert);
                setIsDetailsOpen(true);
              }}
              onCompensate={handleCompensate} // <<<< PASS THE FUNCTION HERE
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