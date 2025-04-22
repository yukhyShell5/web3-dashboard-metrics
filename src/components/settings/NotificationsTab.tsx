import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusIcon, TrashIcon, PencilIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { webhooksApi, notificationApi } from '@/services/apiService';

interface Webhook {
  id: number;
  name: string;
  url: string;
  type: string;
  active: boolean;
}

interface NotificationSettings {
  critical: boolean;
  high: boolean;
  medium: boolean;
  low: boolean;
  info: boolean;
}

const NotificationsTab = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentWebhook, setCurrentWebhook] = useState<Partial<Webhook>>({
    name: '',
    url: '',
    type: 'slack',
    active: true
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    critical: true,
    high: true,
    medium: true,
    low: false,
    info: false
  });

  // Requête pour obtenir les webhooks
  const { data: webhooks, isLoading: isLoadingWebhooks } = useQuery<Webhook[]>({
    queryKey: ['webhooks'],
    queryFn: () => webhooksApi.getWebhooks().then(res => res.webhooks)
  });

  // Requête pour obtenir les paramètres de notification
  useQuery<NotificationSettings>({
    queryKey: ['notificationSettings'],
    queryFn: () => notificationApi.getNotificationSettings(),
    onSuccess: (data) => setNotificationSettings(data)
  });

  // Mutation pour créer un nouveau webhook
  const createWebhookMutation = useMutation({
    mutationFn: (newWebhook: Omit<Webhook, 'id'>) => 
      webhooksApi.createWebhook(newWebhook),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast({
        title: "Webhook ajouté",
        description: "Le webhook a été ajouté avec succès.",
      });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du webhook.",
        variant: "destructive",
      });
    }
  });

  // Mutation pour mettre à jour un webhook
  const updateWebhookMutation = useMutation({
    mutationFn: ({ id, ...data }: Webhook) => 
      webhooksApi.updateWebhook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast({
        title: "Webhook mis à jour",
        description: "Le webhook a été modifié avec succès.",
      });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du webhook.",
        variant: "destructive",
      });
    }
  });

  // Mutation pour supprimer un webhook
  const deleteWebhookMutation = useMutation({
    mutationFn: (id: number) => webhooksApi.deleteWebhook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast({
        title: "Webhook supprimé",
        description: "Le webhook a été supprimé avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du webhook.",
        variant: "destructive",
      });
    }
  });

  // Mutation pour tester un webhook
  const testWebhookMutation = useMutation({
    mutationFn: (id: number) => webhooksApi.testWebhook(id),
    onSuccess: () => {
      toast({
        title: "Test réussi",
        description: "La notification test a été envoyée avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi du test.",
        variant: "destructive",
      });
    }
  });

  // Mutation pour mettre à jour les paramètres de notification
  const updateSettingsMutation = useMutation({
    mutationFn: (settings: NotificationSettings) => 
      notificationApi.updateNotificationSettings(settings),
    onSuccess: () => {
      toast({
        title: "Paramètres enregistrés",
        description: "Les préférences de notification ont été mises à jour.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des paramètres.",
        variant: "destructive",
      });
    }
  });

  const handleOpenAddDialog = () => {
    setIsEditMode(false);
    setCurrentWebhook({
      name: '',
      url: '',
      type: 'slack',
      active: true
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (webhook: Webhook) => {
    setIsEditMode(true);
    setCurrentWebhook(webhook);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!currentWebhook.name || !currentWebhook.url) {
      toast({
        title: "Information manquante",
        description: "Veuillez remplir tous les champs requis.",
        variant: "destructive",
      });
      return;
    }

    if (isEditMode && currentWebhook.id) {
      updateWebhookMutation.mutate(currentWebhook as Webhook);
    } else {
      createWebhookMutation.mutate(currentWebhook as Omit<Webhook, 'id'>);
    }
  };

  const handleToggleActive = (webhook: Webhook) => {
    updateWebhookMutation.mutate({
      ...webhook,
      active: !webhook.active
    });
  };

  const handleTestWebhook = (id: number) => {
    testWebhookMutation.mutate(id);
  };

  const handleSeverityToggle = (severity: keyof NotificationSettings, checked: boolean) => {
    const newSettings = {
      ...notificationSettings,
      [severity]: checked
    };
    setNotificationSettings(newSettings);
    updateSettingsMutation.mutate(newSettings);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Webhooks & Notifications d'alerte</CardTitle>
          <CardDescription>
            Configurez les points d'intégration pour recevoir les alertes de sécurité
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleOpenAddDialog} className="w-full">
            <PlusIcon className="h-4 w-4 mr-2" />
            Ajouter un nouveau webhook
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "Modifier le webhook" : "Ajouter un webhook"}
                </DialogTitle>
                <DialogDescription>
                  {isEditMode 
                    ? "Modifiez les détails du webhook de notification"
                    : "Ajoutez un nouveau webhook pour recevoir les alertes de sécurité"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nom
                  </Label>
                  <Input
                    id="name"
                    placeholder="Alertes Slack"
                    className="col-span-3"
                    value={currentWebhook.name}
                    onChange={(e) => setCurrentWebhook({...currentWebhook, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="url" className="text-right">
                    URL
                  </Label>
                  <Input
                    id="url"
                    placeholder="https://..."
                    className="col-span-3"
                    value={currentWebhook.url}
                    onChange={(e) => setCurrentWebhook({...currentWebhook, url: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select 
                    value={currentWebhook.type}
                    onValueChange={(value) => setCurrentWebhook({...currentWebhook, type: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner un type" />
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
                {isEditMode && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="active" className="text-right">
                      Actif
                    </Label>
                    <Switch
                      id="active"
                      checked={currentWebhook.active ?? false}
                      onCheckedChange={(checked) => setCurrentWebhook({...currentWebhook, active: checked})}
                      className="col-span-3"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleSubmit}
                  disabled={createWebhookMutation.isPending || updateWebhookMutation.isPending}
                >
                  {createWebhookMutation.isPending || updateWebhookMutation.isPending 
                    ? "Enregistrement en cours..." 
                    : isEditMode ? "Mettre à jour" : "Ajouter"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {isLoadingWebhooks ? (
            <div className="py-10 text-center text-muted-foreground">
              Chargement des webhooks...
            </div>
          ) : webhooks && webhooks.length > 0 ? (
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
                        onCheckedChange={() => handleToggleActive(webhook)}
                        disabled={updateWebhookMutation.isPending}
                      />
                      <Label htmlFor={`webhook-toggle-${webhook.id}`} className="text-sm">
                        {webhook.active ? "Activé" : "Désactivé"}
                      </Label>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestWebhook(webhook.id)}
                      disabled={testWebhookMutation.isPending}
                    >
                      {testWebhookMutation.isPending ? "Test en cours..." : "Tester"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEditDialog(webhook)}
                      disabled={updateWebhookMutation.isPending}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteWebhookMutation.mutate(webhook.id)}
                      disabled={deleteWebhookMutation.isPending}
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
              <Switch 
                checked={notificationSettings.critical}
                onCheckedChange={(checked) => handleSeverityToggle('critical', checked)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-500/20 text-orange-500">haute</Badge>
                <span>Alertes haute sévérité</span>
              </div>
              <Switch 
                checked={notificationSettings.high}
                onCheckedChange={(checked) => handleSeverityToggle('high', checked)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-500/20 text-yellow-500">moyenne</Badge>
                <span>Alertes moyenne sévérité</span>
              </div>
              <Switch 
                checked={notificationSettings.medium}
                onCheckedChange={(checked) => handleSeverityToggle('medium', checked)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500/20 text-blue-500">basse</Badge>
                <span>Alertes basse sévérité</span>
              </div>
              <Switch 
                checked={notificationSettings.low}
                onCheckedChange={(checked) => handleSeverityToggle('low', checked)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/20 text-green-500">info</Badge>
                <span>Alertes informatives</span>
              </div>
              <Switch 
                checked={notificationSettings.info}
                onCheckedChange={(checked) => handleSeverityToggle('info', checked)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsTab;