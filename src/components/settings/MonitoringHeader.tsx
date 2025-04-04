
import React from 'react';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addressesApi, webhooksApi } from '@/services/apiService';
import { PlayIcon, StopCircleIcon, FileIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface MonitoringHeaderProps {
  isMonitoring: boolean;
}

const MonitoringHeader: React.FC<MonitoringHeaderProps> = ({ isMonitoring }) => {
  const queryClient = useQueryClient();

  // Mutation pour démarrer le monitoring
  const startMonitoringMutation = useMutation({
    mutationFn: addressesApi.startMonitoring,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitoringStatus'] });
      toast({
        title: "Monitoring démarré",
        description: "Le système est maintenant en mode surveillance active."
      });
    }
  });

  // Mutation pour arrêter le monitoring
  const stopMonitoringMutation = useMutation({
    mutationFn: addressesApi.stopMonitoring,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitoringStatus'] });
      toast({
        title: "Monitoring arrêté",
        description: "Le système est maintenant en pause."
      });
    }
  });

  // Mutation pour générer un rapport
  const generateReportMutation = useMutation({
    mutationFn: webhooksApi.generateReport,
    onSuccess: (data) => {
      // Créer un URL pour le blob et initier le téléchargement
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'alert_report.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      toast({
        title: "Rapport généré",
        description: "Le rapport des alertes a été téléchargé avec succès."
      });
    }
  });

  const handleToggleMonitoring = () => {
    if (isMonitoring) {
      stopMonitoringMutation.mutate();
    } else {
      startMonitoringMutation.mutate();
    }
  };

  const handleGenerateReport = () => {
    generateReportMutation.mutate();
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">Configurez votre monitoring SOC Web3</p>
      </div>
      <div className="flex gap-2">
        <Button 
          className="flex items-center gap-2" 
          variant={isMonitoring ? "destructive" : "default"}
          onClick={handleToggleMonitoring}
          disabled={startMonitoringMutation.isPending || stopMonitoringMutation.isPending}
        >
          {isMonitoring ? (
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
          <FileIcon className="h-4 w-4" />
          Générer un rapport
        </Button>
      </div>
    </div>
  );
};

export default MonitoringHeader;
