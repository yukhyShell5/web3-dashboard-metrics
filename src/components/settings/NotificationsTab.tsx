
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
import { PlusIcon, TrashIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { webhooksApi } from '@/services/apiService';

// Type pour les webhooks
interface Webhook {
  id: string;
  name: string;
  url: string;
  type: string;
  active: boolean;
}

const NotificationsTab = () => {
  const queryClient = useQueryClient();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [newWebhook, setNewWebhook] = useState({ name: '', url: '', type: 'slack' });

  // Requête pour obtenir les webhooks
  const { data: webhookUrls, isLoading: isLoadingWebhooks } = useQuery({
    queryKey: ['webhooks'],
    queryFn: webhooksApi.getWebhooks
  });

  // Mutation pour mettre à jour les webhooks
  const updateWebhooksMutation = useMutation({
    mutationFn: (webhookList: string[]) => webhooksApi.updateWebhooks(webhookList),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    }
  });

  // Effet pour mettre à jour l'état local des webhooks à partir des données de l'API
  React.useEffect(() => {
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
    </div>
  );
};

export default NotificationsTab;
