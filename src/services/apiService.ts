
import { toast } from "@/components/ui/use-toast";

// Remplacez cette URL par l'URL réelle de votre API Python
const API_BASE_URL = "http://localhost:8000";

async function handleApiError(response: Response) {
  let errorMessage = "Une erreur s'est produite";
  try {
    const data = await response.json();
    errorMessage = data.detail || data.message || errorMessage;
  } catch {
    errorMessage = `Erreur ${response.status}: ${response.statusText}`;
  }
  
  toast({
    title: "Erreur API",
    description: errorMessage,
    variant: "destructive",
  });
  
  throw new Error(errorMessage);
}

export interface MonitoredAddress {
  address: string;
  label: string;
  chain: string;
  monitored: boolean;
}

export interface Webhook {
  name: string;
  url: string;
  type: string;
  active: boolean;
}

// API pour les adresses surveillées
export const addressesApi = {
  getWatchedAddresses: async (): Promise<string[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/watched_address`);
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      const data = await response.json();
      return data.watched_addresses || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des adresses surveillées:", error);
      return [];
    }
  },
  
  updateWatchedAddresses: async (addresses: string[]): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/watched_address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ watched_addresses: addresses }),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      toast({
        title: "Adresses mises à jour",
        description: "Les adresses surveillées ont été mises à jour avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour des adresses surveillées:", error);
      throw error;
    }
  },
  
  getMonitoringStatus: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/txMonitored`);
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      const data = await response.json();
      return data.count > 0;
    } catch (error) {
      console.error("Erreur lors de la vérification du statut de monitoring:", error);
      return false;
    }
  },
  
  startMonitoring: async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/start-monitoring`, {
        method: "POST",
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      toast({
        title: "Monitoring démarré",
        description: "Le monitoring des adresses a été démarré avec succès."
      });
    } catch (error) {
      console.error("Erreur lors du démarrage du monitoring:", error);
      throw error;
    }
  },
  
  stopMonitoring: async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/stop-monitoring`, {
        method: "POST",
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      toast({
        title: "Monitoring arrêté",
        description: "Le monitoring des adresses a été arrêté avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de l'arrêt du monitoring:", error);
      throw error;
    }
  }
};

// API pour les webhooks
export const webhooksApi = {
  getWebhooks: async (): Promise<string[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/webhook`);
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      const data = await response.json();
      return data.webhook_urls || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des webhooks:", error);
      return [];
    }
  },
  
  updateWebhooks: async (webhooks: string[]): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/webhook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ webhook_urls: webhooks }),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      toast({
        title: "Webhooks mis à jour",
        description: "Les webhooks ont été mis à jour avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour des webhooks:", error);
      throw error;
    }
  },
  
  generateReport: async (): Promise<Blob> => {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-report`, {
        method: "POST",
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.blob();
    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error);
      throw error;
    }
  },
  
  getAlerts: async (): Promise<any[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts`);
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des alertes:", error);
      return [];
    }
  }
};
