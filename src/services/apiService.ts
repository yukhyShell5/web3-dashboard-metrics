import { toast } from "@/components/ui/use-toast";

// Remplacez cette URL par l'URL réelle de votre API Python
const API_BASE_URL = "http://localhost:8000";

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface AlertItemProps {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
  source: string;
}

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

export interface Rule {
  name: string;
  file: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'unknown';
  category: string;
  status: 'active' | 'inactive' | 'error';
  triggers?: number;
  created?: string;
}

export interface CompensateRequest {
  recipient_address: string;
  amount_stablecoin_smallest_unit: number;
  alert_id_reference: number;
}

export interface CompensateResponse {
  message: string;
  compensation_tx_hash: string;
}

export const insuranceVaultApi = {
  // ... (you might have other vault functions like deposit, addYield, getTotalAssets here)

  compensate: async (data: CompensateRequest): Promise<CompensateResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/insurance-vault/compensate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        await handleApiError(response); // This will throw if not ok
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la demande de compensation:", error);
      // The handleApiError already shows a toast, but you might want to re-throw
      // or return a specific error structure if the caller needs to handle it differently.
      throw error; 
    }
  },

  getTotalAssets: async (): Promise<{
    total_assets_smallest_unit: number;
    stablecoin_decimals: number;
    total_assets_formatted: number;
  }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/insurance-vault/total-assets`);
      if (!response.ok) {
        await handleApiError(response);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching total vault assets:", error);
      toast({
        title: "Error",
        description: "Failed to fetch vault assets",
        variant: "destructive",
      });
      // Return a default or throw
      return { total_assets_smallest_unit: 0, stablecoin_decimals: 6, total_assets_formatted: 0 };
    }
  }
};

export interface NotificationSettings {
  critical: boolean;
  high: boolean;
  medium: boolean;
  low: boolean;
  info: boolean;
}

export const notificationApi = {
  getNotificationSettings: async (): Promise<NotificationSettings> => {
    try {
      const response = await fetch(`${API_BASE_URL}/notification-settings`);
      if (!response.ok) {
        await handleApiError(response);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching notification settings:", error);
      return {
        critical: true,
        high: true,
        medium: true,
        low: false,
        info: false
      };
    }
  },

  updateNotificationSettings: async (settings: NotificationSettings): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/notification-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
    } catch (error) {
      console.error("Error updating notification settings:", error);
      throw error;
    }
  }
};

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

  testWebhook: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/webhooks/${id}/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur lors du test du webhook:", error);
      throw error;
    }
  },
  
  generateReport: async (): Promise<Blob> => {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-report`);
      
      if (!response.ok) {
        await handleApiError(response);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/pdf')) {
        throw new Error('La réponse n\'est pas un PDF valide');
      }

      return await response.blob();
    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error);
      toast({
        title: "Erreur",
        description: "Échec de la génération du rapport",
        variant: "destructive",
      });
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

// API pour les règles de détection
export const rulesApi = {
  getRules: async (): Promise<{ rules: Rule[] }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rules`);
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des règles:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les règles de détection",
        variant: "destructive",
      });
      return { rules: [] };
    }
  },

  toggleRule: async (ruleName: string, active: boolean): Promise<void> => {
    try {
      console.log(`Envoi de la requête pour ${active ? 'activer' : 'désactiver'} la règle ${ruleName}`);
      
      const response = await fetch(`${API_BASE_URL}/rules/${ruleName}/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active }),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      const result = await response.json();
      console.log("Réponse du serveur:", result);
      return;
    } catch (error) {
      console.error(`Erreur lors de la ${active ? 'activation' : 'désactivation'} de la règle:`, error);
      throw error;
    }
  },

  getRuleStats: async (): Promise<{ [key: string]: number }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rules/stats`);
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques des règles:", error);
      return {};
    }
  },

  createRule: async (ruleData: {
    name: string;
    description: string;
    severity: string;
    category: string;
    code: string;
  }): Promise<Rule> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ruleData),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la création de la règle:", error);
      throw error;
    }
  },

  updateRule: async (ruleName: string, updates: Partial<Rule>): Promise<Rule> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rules/${ruleName}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la règle:", error);
      throw error;
    }
  },

  deleteRule: async (ruleName: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rules/${ruleName}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la règle:", error);
      throw error;
    }
  }
};

export const getLastTriggeredRules = async (): Promise<Array<{
  ruleName: string;
  triggerCount: number;
  lastTriggered: string;
}>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/last-triggered-rules`);
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching last triggered rules:", error);
    return [];
  }
};

export const alertsApi = {
  getAlerts: async (): Promise<any[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts`);
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error("Error fetching alerts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch alerts",
        variant: "destructive",
      });
      return [];
    }
  },
};