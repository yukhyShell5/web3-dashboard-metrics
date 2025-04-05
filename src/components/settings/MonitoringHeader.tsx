import React from 'react';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addressesApi, webhooksApi } from '@/services/apiService';
import { PlayIcon, StopCircleIcon, FileIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface MonitoringHeaderProps {
  isMonitoring: boolean;
}

const MonitoringHeader: React.FC<MonitoringHeaderProps> = ({ isMonitoring }) => {
  const queryClient = useQueryClient();
  const [localMonitoringStatus, setLocalMonitoringStatus] = React.useState(isMonitoring);

  // Synchronise le statut local avec les props quand elles changent
  React.useEffect(() => {
    setLocalMonitoringStatus(isMonitoring);
  }, [isMonitoring]);

  // Mutation pour démarrer le monitoring
  const startMonitoringMutation = useMutation({
    mutationFn: addressesApi.startMonitoring,
    onMutate: () => {
      // Optimistic update
      setLocalMonitoringStatus(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitoringStatus'] });
    },
    onError: () => {
      // Revert if error
      setLocalMonitoringStatus(false);
    }
  });

  // Mutation pour arrêter le monitoring
  const stopMonitoringMutation = useMutation({
    mutationFn: addressesApi.stopMonitoring,
    onMutate: () => {
      // Optimistic update
      setLocalMonitoringStatus(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitoringStatus'] });
    },
    onError: () => {
      // Revert if error
      setLocalMonitoringStatus(true);
    }
  });

  // Mutation pour générer un rapport
  const generateReportMutation = useMutation({
    mutationFn: webhooksApi.generateReport,
    onSuccess: (blob) => {
      // Créer un URL pour le blob
      const url = window.URL.createObjectURL(blob);
      
      // Créer un élément <a> invisible pour déclencher le téléchargement
      const link = document.createElement('a');
      link.href = url;
      link.download = `rapport-alertes-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Ajouter au DOM et cliquer
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Échec de la génération du rapport",
        variant: "destructive",
      });
    }
  });

  const handleToggleMonitoring = () => {
    if (localMonitoringStatus) {
      stopMonitoringMutation.mutate();
    } else {
      startMonitoringMutation.mutate();
    }
  };

  const handleGenerateReport = () => {
    generateReportMutation.mutate();
  };

  const isLoading = startMonitoringMutation.isPending || stopMonitoringMutation.isPending;

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">Configurez votre monitoring SOC Web3</p>
      </div>
      <div className="flex gap-2">
        <Button 
          className="flex items-center gap-2" 
          variant={localMonitoringStatus ? "destructive" : "default"}
          onClick={handleToggleMonitoring}
          disabled={isLoading}
        >
          {isLoading ? (
            <span>Chargement...</span>
          ) : localMonitoringStatus ? (
            <>
              <StopCircleIcon className="h-4 w-4" />
              Arrêter le monitoring
            </>
          ) : (
            <>
              <PlayIcon className="h-4 w-4" />
              Démarrer le monitoring
            </>
          )}
        </Button>
        <Button 
          className="flex items-center gap-2" 
          variant="outline" 
          onClick={handleGenerateReport}
          disabled={generateReportMutation.isPending}
        >
          {generateReportMutation.isPending ? (
            <span>Génération...</span>
          ) : (
            <>
              <FileIcon className="h-4 w-4" />
              Générer un rapport
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MonitoringHeader;