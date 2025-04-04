
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BellIcon, WrenchIcon, KeyIcon, ShieldIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { addressesApi } from '@/services/apiService';
import AddressesTab from '@/components/settings/AddressesTab';
import NotificationsTab from '@/components/settings/NotificationsTab';
import ApiTab from '@/components/settings/ApiTab';
import GeneralTab from '@/components/settings/GeneralTab';
import MonitoringHeader from '@/components/settings/MonitoringHeader';

const Settings = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Requête pour obtenir le statut de monitoring
  const { data: monitoringStatus, isLoading: isLoadingMonitoring } = useQuery({
    queryKey: ['monitoringStatus'],
    queryFn: addressesApi.getMonitoringStatus,
    refetchInterval: 30000 // Rafraîchir toutes les 30 secondes
  });

  // Effet pour mettre à jour l'état du monitoring
  useEffect(() => {
    if (monitoringStatus !== undefined) {
      setIsMonitoring(monitoringStatus);
    }
  }, [monitoringStatus]);

  return (
    <div className="space-y-8">
      <MonitoringHeader isMonitoring={isMonitoring} />

      <Tabs defaultValue="addresses" className="w-full">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="addresses" className="flex gap-2 items-center">
            <ShieldIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Adresses surveillées</span>
            <span className="inline sm:hidden">Adresses</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-2 items-center">
            <BellIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
            <span className="inline sm:hidden">Alertes</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex gap-2 items-center">
            <KeyIcon className="h-4 w-4" />
            <span className="hidden sm:inline">API & Intégrations</span>
            <span className="inline sm:hidden">API</span>
          </TabsTrigger>
          <TabsTrigger value="general" className="flex gap-2 items-center">
            <WrenchIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Paramètres généraux</span>
            <span className="inline sm:hidden">Général</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="addresses" className="space-y-4 mt-4">
          <AddressesTab />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <NotificationsTab />
        </TabsContent>

        <TabsContent value="api" className="space-y-4 mt-4">
          <ApiTab />
        </TabsContent>

        <TabsContent value="general" className="space-y-4 mt-4">
          <GeneralTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
