import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusIcon, TrashIcon, CheckIcon, BellIcon, WrenchIcon, KeyIcon, ShieldIcon, GlobeIcon, SaveIcon, PlayIcon, StopCircleIcon, FileIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { addressesApi, webhooksApi } from '@/services/apiService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Type pour les adresses surveillées
interface MonitoredAddress {
  id: string;
  address: string;
  label: string;
  chain: string;
  monitored: boolean;
}

// Type pour les webhooks
interface Webhook {
  id: string;
  name: string;
  url: string;
  type: string;
  active: boolean;
}

const Settings = () => {
  const queryClient = useQueryClient();
  const [addresses, setAddresses] = useState<MonitoredAddress[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [newAddress, setNewAddress] = useState({ address: '', label: '', chain: 'ethereum' });
  const [newWebhook, setNewWebhook] = useState({ name: '', url: '', type: 'slack' });
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Requête pour obtenir les adresses surveillées
  const { data: watchedAddresses, isLoading: isLoadingAddresses } = useQuery({
    queryKey: ['watchedAddresses'],
    queryFn: addressesApi.getWatchedAddresses
  });

  // Requête pour obtenir les webhooks
  const { data: webhookUrls, isLoading: isLoadingWebhooks } = useQuery({
    queryKey: ['webhooks'],
    queryFn: webhooksApi.getWebhooks
  });

  // Requête pour obtenir le statut de monitoring
  const { data: monitoringStatus, isLoading: isLoadingMonitoring } = useQuery({
    queryKey: ['monitoringStatus'],
    queryFn: addressesApi.getMonitoringStatus,
    refetchInterval: 30000 // Rafraîchir toutes les 30 secondes
  });

  // Mutation pour démarrer le monitoring
  const startMonitoringMutation = useMutation({
    mutationFn: addressesApi.startMonitoring,
    onSuccess: () => {
      setIsMonitoring(true);
      queryClient.invalidateQueries({ queryKey: ['monitoringStatus'] });
    }
  });

  // Mutation pour arrêter le monitoring
  const stopMonitoringMutation = useMutation({
    mutationFn: addressesApi.stopMonitoring,
    onSuccess: () => {
      setIsMonitoring(false);
      queryClient.invalidateQueries({ queryKey: ['monitoringStatus'] });
    }
  });

  // Mutation pour mettre à jour les adresses surveillées
  const updateAddressesMutation = useMutation({
    mutationFn: (addressList: string[]) => addressesApi.updateWatchedAddresses(addressList),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchedAddresses'] });
    }
  });

  // Mutation pour mettre à jour les webhooks
  const updateWebhooksMutation = useMutation({
    mutationFn: (webhookList: string[]) => webhooksApi.updateWebhooks(webhookList),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
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
        description: "Le rapport d'alertes a été généré et téléchargé."
      });
    }
  });

  // Effet pour mettre à jour l'état local à partir des données de l'API
  useEffect(() => {
    if (watchedAddresses) {
      const formattedAddresses: MonitoredAddress[] = watchedAddresses.map((address, index) => ({
        id: `api-${index}`,
        address,
        label: `Adresse ${index + 1}`,
        chain: 'ethereum',
        monitored: true
      }));
      setAddresses(formattedAddresses);
    }
  }, [watchedAddresses]);

  // Effet pour mettre à jour l'état local des webhooks à partir des données de l'API
  useEffect(() => {
    if (webhookUrls) {
      const formattedWebhooks: Webhook[] = webhookUrls.map((url, index) => ({
        id: `api-${index}`,
        name: `Webhook ${index + 1}`,
        url,
        type: url.includes('discord') ? 'discord' : 'slack',
        active: true
      }));
      setWebhooks(formattedWebhooks);
    }
  }, [webhookUrls]);

  // Effet pour mettre à jour l'état du monitoring
  useEffect(() => {
    if (monitoringStatus !== undefined) {
      setIsMonitoring(monitoringStatus);
    }
  }, [monitoringStatus]);

  const handleAddAddress = () => {
    if (!newAddress.address || !newAddress.label) {
      toast({
        title: "Information manquante",
        description: "Veuillez remplir tous les champs requis.",
        variant: "destructive",
      });
      return;
    }

    const newAddressList = [
      ...addresses,
      {
        id: Date.now().toString(),
        address: newAddress.address,
        label: newAddress.label,
        chain: newAddress.chain,
        monitored: true,
      },
    ];
    
    setAddresses(newAddressList);
    setNewAddress({ address: '', label: '', chain: 'ethereum' });

    // Mettre à jour les adresses dans l'API
    updateAddressesMutation.mutate(newAddressList.map(addr => addr.address));

    toast({
      title: "Adresse ajoutée",
      description: "L'adresse blockchain a été ajoutée au monitoring.",
    });
  };

  const handleRemoveAddress = (id: string) => {
    const updatedAddresses = addresses.filter((address) => address.id !== id);
    setAddresses(updatedAddresses);
    
    // Mettre à jour les adresses dans l'API
    updateAddressesMutation.mutate(updatedAddresses.map(addr => addr.address));

    toast({
      title: "Adresse supprimée",
      description: "L'adresse blockchain a été supprimée du monitoring.",
    });
  };

  const handleToggleAddressMonitoring = (id: string) => {
    const updatedAddresses = addresses.map((address) =>
      address.id === id ? { ...address, monitored: !address.monitored } : address
    );
    
    setAddresses(updatedAddresses);
    
    // On ne met à jour l'API que si l'adresse est complètement supprimée, 
    // pas juste pour changer son état de monitoring local
  };

  const handleAddWebhook = () => {
    if (!newWebhook.name || !newWebhook.url) {
      toast({
        title: "Information manquante",
        description: "Veuillez remplir tous les champs requis.",
        variant: "destructive",
      });
      return;
    }

    const newWebhookList = [
      ...webhooks,
      {
        id: Date.now().toString(),
        name: newWebhook.name,
        url: newWebhook.url,
        type: newWebhook.type,
        active: true,
      },
    ];
    
    setWebhooks(newWebhookList);
    setNewWebhook({ name: '', url: '', type: 'slack' });

    // Mettre à jour les webhooks dans l'API
    updateWebhooksMutation.mutate(newWebhookList.map(webhook => webhook.url));

    toast({
      title: "Webhook ajouté",
      description: "Le webhook a été ajouté pour les notifications d'alerte.",
    });
  };

  const handleRemoveWebhook = (id: string) => {
    const updatedWebhooks = webhooks.filter((webhook) => webhook.id !== id);
    setWebhooks(updatedWebhooks);
    
    // Mettre à jour les webhooks dans l'API
    updateWebhooksMutation.mutate(updatedWebhooks.map(webhook => webhook.url));

    toast({
      title: "Webhook supprimé",
      description: "Le webhook a été supprimé des notifications.",
    });
  };

  const handleToggleWebhookActive = (id: string) => {
    const updatedWebhooks = webhooks.map((webhook) =>
      webhook.id === id ? { ...webhook, active: !webhook.active } : webhook
    );
    
    setWebhooks(updatedWebhooks);
    
    // On ne met à jour l'API que si le webhook est complètement supprimé,
    // pas juste pour changer son état d'activation local
  };

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
    <div className="space-y-8">
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
          <Card>
            <CardHeader>
              <CardTitle>Adresses blockchain surveillées</CardTitle>
              <CardDescription>
                Ajoutez, modifiez et gérez les adresses pour la surveillance de sécurité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Ajouter une nouvelle adresse
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter une adresse blockchain</DialogTitle>
                    <DialogDescription>
                      Ajoutez une nouvelle adresse à surveiller pour les événements de sécurité
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="address" className="text-right">
                        Adresse
                      </Label>
                      <Input
                        id="address"
                        placeholder="0x..."
                        className="col-span-3"
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="label" className="text-right">
                        Libellé
                      </Label>
                      <Input
                        id="label"
                        placeholder="Mon portefeuille"
                        className="col-span-3"
                        value={newAddress.label}
                        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="chain" className="text-right">
                        Blockchain
                      </Label>
                      <Select 
                        value={newAddress.chain}
                        onValueChange={(value) => setNewAddress({ ...newAddress, chain: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Sélectionner une blockchain" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les chaînes</SelectItem>
                          <SelectItem value="ethereum">Ethereum</SelectItem>
                          <SelectItem value="polygon">Polygon</SelectItem>
                          <SelectItem value="arbitrum">Arbitrum</SelectItem>
                          <SelectItem value="optimism">Optimism</SelectItem>
                          <SelectItem value="base">Base</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={handleAddAddress}
                      disabled={updateAddressesMutation.isPending}
                    >
                      {updateAddressesMutation.isPending ? "Ajout en cours..." : "Ajouter l'adresse"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {isLoadingAddresses ? (
                <div className="py-10 text-center text-muted-foreground">
                  Chargement des adresses...
                </div>
              ) : addresses.length > 0 ? (
                <div className="space-y-4 mt-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-card"
                    >
                      <div className="space-y-1 mb-2 sm:mb-0">
                        <div className="font-medium flex flex-wrap gap-2 items-center">
                          {address.label}
                          <Badge
                            variant="outline"
                            className={address.monitored ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}
                          >
                            {address.monitored ? "Surveillance active" : "En pause"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground font-mono">{address.address}</div>
                        <div className="text-xs">
                          <Badge variant="outline" className="mr-1">
                            {address.chain === 'all' ? 'Toutes les chaînes' : address.chain}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`address-toggle-${address.id}`}
                            checked={address.monitored}
                            onCheckedChange={() => handleToggleAddressMonitoring(address.id)}
                          />
                          <Label htmlFor={`address-toggle-${address.id}`} className="text-sm">
                            {address.monitored ? "Activé" : "Désactivé"}
                          </Label>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAddress(address.id)}
                          disabled={updateAddressesMutation.isPending}
                        >
                          <TrashIcon className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-muted-foreground">
                  Aucune adresse surveillée. Ajoutez-en une pour commencer.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhooks & Notifications d'alerte</CardTitle>
              <CardDescription>
                Configurez les points d'intégration pour recevoir les alertes de sécurité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Ajouter un nouveau webhook
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un webhook de notification</DialogTitle>
                    <DialogDescription>
                      Ajoutez un webhook pour recevoir les notifications d'alerte
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="webhook-name" className="text-right">
                        Nom
                      </Label>
                      <Input
                        id="webhook-name"
                        placeholder="Alertes Slack"
                        className="col-span-3"
                        value={newWebhook.name}
                        onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="webhook-url" className="text-right">
                        URL
                      </Label>
                      <Input
                        id="webhook-url"
                        placeholder="https://..."
                        className="col-span-3"
                        value={newWebhook.url}
                        onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="webhook-type" className="text-right">
                        Type
                      </Label>
                      <Select 
                        value={newWebhook.type}
                        onValueChange={(value) => setNewWebhook({ ...newWebhook, type: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Sélectionner un type de webhook" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slack">Slack</SelectItem>
                          <SelectItem value="discord">Discord</SelectItem>
                          <SelectItem value="telegram">Telegram</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="custom">HTTP personnalisé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={handleAddWebhook}
                      disabled={updateWebhooksMutation.isPending}
                    >
                      {updateWebhooksMutation.isPending ? "Ajout en cours..." : "Ajouter le webhook"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {isLoadingWebhooks ? (
                <div className="py-10 text-center text-muted-foreground">
                  Chargement des webhooks...
                </div>
              ) : webhooks.length > 0 ? (
                <div className="space-y-4 mt-4">
                  {webhooks.map((webhook) => (
                    <div
                      key={webhook.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-card"
                    >
                      <div className="space-y-1 mb-2 sm:mb-0">
                        <div className="font-medium flex flex-wrap gap-2 items-center">
                          {webhook.name}
                          <Badge
                            variant="outline"
                            className={webhook.active ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}
                          >
                            {webhook.active ? "Actif" : "Inactif"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground truncate max-w-md">{webhook.url}</div>
                        <div className="text-xs">
                          <Badge variant="outline" className="capitalize">
                            {webhook.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`webhook-toggle-${webhook.id}`}
                            checked={webhook.active}
                            onCheckedChange={() => handleToggleWebhookActive(webhook.id)}
                          />
                          <Label htmlFor={`webhook-toggle-${webhook.id}`} className="text-sm">
                            {webhook.active ? "Activé" : "Désactivé"}
                          </Label>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => {
                          toast({
                            title: "Test envoyé",
                            description: "Une notification test a été envoyée au webhook.",
                          });
                        }}>
                          Test
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveWebhook(webhook.id)}
                          disabled={updateWebhooksMutation.isPending}
                        >
                          <TrashIcon className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-muted-foreground">
                  Aucun webhook configuré. Ajoutez-en un pour recevoir des notifications.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Règles d'alerte et notifications</CardTitle>
              <CardDescription>
                Configurez quels types d'alertes déclenchent des notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-500/20 text-red-500">critique</Badge>
                    <span>Alertes critiques</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-500/20 text-orange-500">haute</Badge>
                    <span>Alertes haute sévérité</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-500/20 text-yellow-500">moyenne</Badge>
                    <span>Alertes moyenne sévérité</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500/20 text-blue-500">basse</Badge>
                    <span>Alertes basse sévérité</span>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-500">info</Badge>
                    <span>Alertes informatives</span>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>API Keys & Access</CardTitle>
              <CardDescription>
                Manage access keys for the Web3 SOC API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Primary API Key</div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500">Active</Badge>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Input 
                      type="password" 
                      value="••••••••••••••••••••••••••••••" 
                      readOnly 
                      className="font-mono"
                    />
                    <Button variant="outline" size="sm" onClick={() => {
                      toast({
                        title: "API Key Copied",
                        description: "The API key has been copied to your clipboard.",
                      });
                    }}>
                      Copy
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created: August 1, 2023 • Last used: Today
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="outline">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Generate New Key
                  </Button>
                  <Button variant="outline">
                    View API Documentation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>External Integrations</CardTitle>
              <CardDescription>
                Connect to external services and data providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-full">
                      <GlobeIcon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium">Etherscan API</div>
                      <div className="text-sm text-muted-foreground">Connect to Etherscan for transaction data</div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-purple-500/10 rounded-full">
                      <GlobeIcon className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <div className="font-medium">Chainalysis</div>
                      <div className="text-sm text-muted-foreground">Risk scoring and address flagging</div>
                    </div>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-500/10 rounded-full">
                      <GlobeIcon className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <div className="font-medium">Infura</div>
                      <div className="text-sm text-muted-foreground">Node services for blockchain access</div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general system settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="timezone" className="text-right">
                    Timezone
                  </Label>
                  <Select defaultValue="utc">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time (ET)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                      <SelectItem value="cet">Central European Time (CET)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date-format" className="text-right">
                    Date Format
                  </Label>
                  <Select defaultValue="iso">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iso">ISO (YYYY-MM-DD)</SelectItem>
                      <SelectItem value="us">US (MM/DD/YYYY)</SelectItem>
                      <SelectItem value="eu">EU (DD/MM/YYYY)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Always use dark theme</p>
                  </div>
                  <Switch id="dark-mode" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-refresh" className="text-base">Auto-refresh Data</Label>
                    <p className="text-sm text-muted-foreground">Automatically refresh dashboard data</p>
                  </div>
                  <Switch id="auto-refresh" defaultChecked />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="refresh-interval" className="text-right">
                    Refresh Interval
                  </Label>
                  <Select defaultValue="30">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">1 minute</SelectItem>
                      <SelectItem value="300">5 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => {
                toast({
                  title: "Settings Saved",
                  description: "Your general settings have been updated.",
                });
              }}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
              <CardDescription>
                Configure how long data is stored in the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="alert-retention" className="text-right">
                  Alert History
                </Label>
                <Select defaultValue="90">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select retention period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="logs-retention" className="text-right">
                  System Logs
                </Label>
                <Select defaultValue="14">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select retention period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;