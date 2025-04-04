
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

// Types pour les adresses surveillées et webhooks
export interface MonitoredAddress {
  id: number;
  address: string;
  name: string;
  blockchain: string;
  actif: boolean;
}

export interface Webhook {
  id: number;
  name: string;
  url: string;
  type: string;
  actif: boolean;
}

// API pour les adresses surveillées
export const addressesApi = {
  // Récupérer toutes les adresses surveillées
  getWatchedAddresses: async (): Promise<MonitoredAddress[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/watched-addresses/`);
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des adresses surveillées:", error);
      return [];
    }
  },
  
  // Ajouter une nouvelle adresse
  addWatchedAddress: async (address: Omit<MonitoredAddress, 'id'>): Promise<MonitoredAddress> => {
    try {
      const response = await fetch(`${API_BASE_URL}/watched-addresses/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(address),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      toast({
        title: "Adresse ajoutée",
        description: "L'adresse blockchain a été ajoutée au monitoring."
      });
      
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une adresse:", error);
      throw error;
    }
  },
  
  // Mettre à jour une adresse
  updateWatchedAddress: async (id: number, address: Partial<MonitoredAddress>): Promise<MonitoredAddress> => {
    try {
      const response = await fetch(`${API_BASE_URL}/watched-addresses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(address),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      toast({
        title: "Adresse mise à jour",
        description: "L'adresse blockchain a été mise à jour."
      });
      
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'une adresse:", error);
      throw error;
    }
  },
  
  // Supprimer une adresse
  deleteWatchedAddress: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/watched-addresses/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      toast({
        title: "Adresse supprimée",
        description: "L'adresse blockchain a été supprimée du monitoring."
      });
    } catch (error) {
      console.error("Erreur lors de la suppression d'une adresse:", error);
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
  // Récupérer tous les webhooks
  getWebhooks: async (): Promise<Webhook[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/webhooks/`);
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des webhooks:", error);
      return [];
    }
  },
  
  // Ajouter un nouveau webhook
  addWebhook: async (webhook: Omit<Webhook, 'id'>): Promise<Webhook> => {
    try {
      const response = await fetch(`${API_BASE_URL}/webhooks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhook),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      toast({
        title: "Webhook ajouté",
        description: "Le webhook a été ajouté pour les notifications d'alerte."
      });
      
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un webhook:", error);
      throw error;
    }
  },
  
  // Mettre à jour un webhook
  updateWebhook: async (id: number, webhook: Partial<Webhook>): Promise<Webhook> => {
    try {
      const response = await fetch(`${API_BASE_URL}/webhooks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhook),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      toast({
        title: "Webhook mis à jour",
        description: "Le webhook a été mis à jour."
      });
      
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'un webhook:", error);
      throw error;
    }
  },
  
  // Supprimer un webhook
  deleteWebhook: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/webhooks/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      toast({
        title: "Webhook supprimé",
        description: "Le webhook a été supprimé des notifications."
      });
    } catch (error) {
      console.error("Erreur lors de la suppression d'un webhook:", error);
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
