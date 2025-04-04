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

export interface WatchedAddress {
  id: number;
  address: string;
  name: string;
  blockchain: string;
  active: boolean;
}

export interface Webhook {
  id: number;
  url: string;
  name: string;
  type: string;
  active: boolean;
}

// API pour les adresses surveillées
export const addressesApi = {
  getWatchedAddresses: async (): Promise<{ watched_addresses: WatchedAddress[] }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/watched-addresses`);
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des adresses surveillées:", error);
      return { watched_addresses: [] };
    }
  },
  
  createWatchedAddress: async (address: Omit<WatchedAddress, 'id'>): Promise<WatchedAddress> => {
    try {
      const response = await fetch(`${API_BASE_URL}/watched-addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(address),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la création d'une adresse surveillée:", error);
      throw error;
    }
  },
  
  updateWatchedAddress: async (id: number, address: Partial<WatchedAddress>): Promise<WatchedAddress> => {
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
      
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'une adresse surveillée:", error);
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
    } catch (error) {
      console.error("Erreur lors de la suppression d'une adresse surveillée:", error);
      throw error;
    }
  },
  
  getMonitoringStatus: async (): Promise<{ count: number }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/txMonitored`);
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la vérification du statut de monitoring:", error);
      return { count: 0 };
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
    } catch (error) {
      console.error("Erreur lors de l'arrêt du monitoring:", error);
      throw error;
    }
  }
};

// API pour les webhooks
export const webhooksApi = {
  getWebhooks: async (): Promise<{ webhooks: Webhook[] }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/webhooks`);
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des webhooks:", error);
      return { webhooks: [] };
    }
  },
  
  createWebhook: async (webhook: Omit<Webhook, 'id'>): Promise<Webhook> => {
    try {
      const response = await fetch(`${API_BASE_URL}/webhooks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhook),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la création d'un webhook:", error);
      throw error;
    }
  },
  
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
      
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'un webhook:", error);
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