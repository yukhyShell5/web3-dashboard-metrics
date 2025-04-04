
import { toast } from "@/components/ui/use-toast";

// API base URL
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

// Types définies selon le backend
export interface WatchedAddress {
  id: number;
  address: string;
  name: string;
  blockchain: string;
  is_active: boolean;
  created_at: string;
  notes?: string;
}

export interface WatchedAddressCreate {
  address: string;
  name: string;
  blockchain: string;
  notes?: string;
}

export interface Webhook {
  id: number;
  url: string;
  name: string;
  type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WebhookCreate {
  url: string;
  name: string;
  type: string;
}

export interface Alert {
  id: number;
  alert_type: string;
  tx_hash: string;
  address: string;
  value: number;
  block: number;
  reason: string;
  timestamp: string;
  details?: Record<string, any>;
}

// API pour les adresses surveillées
export const addressesApi = {
  getWatchedAddresses: async (): Promise<WatchedAddress[]> => {
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
  
  createWatchedAddress: async (address: WatchedAddressCreate): Promise<WatchedAddress> => {
    try {
      // Ensure blockchain is lowercase to match FastAPI enum validation
      const normalizedAddress = {
        ...address,
        blockchain: address.blockchain.toLowerCase()
      };

      const response = await fetch(`${API_BASE_URL}/watched-addresses/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(normalizedAddress),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      const data = await response.json();
      toast({
        title: "Adresse ajoutée",
        description: "L'adresse a été ajoutée avec succès à la surveillance."
      });
      return data;
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une adresse surveillée:", error);
      throw error;
    }
  },
  
  toggleWatchedAddress: async (id: number, isActive: boolean): Promise<WatchedAddress> => {
    try {
      const response = await fetch(`${API_BASE_URL}/watched-addresses/${id}/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: isActive }),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      const data = await response.json();
      toast({
        title: isActive ? "Adresse activée" : "Adresse désactivée",
        description: `L'adresse a été ${isActive ? "activée" : "désactivée"} avec succès.`
      });
      return data;
    } catch (error) {
      console.error("Erreur lors de la modification du statut d'une adresse:", error);
      throw error;
    }
  },
  
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
        description: "L'adresse a été supprimée avec succès de la surveillance."
      });
    } catch (error) {
      console.error("Erreur lors de la suppression d'une adresse surveillée:", error);
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
  
  createWebhook: async (webhook: WebhookCreate): Promise<Webhook> => {
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
      
      const data = await response.json();
      toast({
        title: "Webhook ajouté",
        description: "Le webhook a été ajouté avec succès."
      });
      return data;
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un webhook:", error);
      throw error;
    }
  },
  
  toggleWebhook: async (id: number, isActive: boolean): Promise<Webhook> => {
    try {
      const response = await fetch(`${API_BASE_URL}/webhooks/${id}/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: isActive }),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      const data = await response.json();
      toast({
        title: isActive ? "Webhook activé" : "Webhook désactivé",
        description: `Le webhook a été ${isActive ? "activé" : "désactivé"} avec succès.`
      });
      return data;
    } catch (error) {
      console.error("Erreur lors de la modification du statut d'un webhook:", error);
      throw error;
    }
  },
  
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
        description: "Le webhook a été supprimé avec succès."
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
  
  getAlerts: async (): Promise<Alert[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts/`);
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des alertes:", error);
      return [];
    }
  }
};
