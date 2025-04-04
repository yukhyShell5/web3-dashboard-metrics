
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { webhooksApi, Webhook } from '@/services/apiService';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Schéma de validation pour le formulaire de webhook
const webhookFormSchema = z.object({
  name: z.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  url: z.string()
    .url("L'URL doit être valide (ex: https://example.com)"),
  type: z.string(),
});

type WebhookFormValues = z.infer<typeof webhookFormSchema>;

const webhookTypes = [
  { value: "discord", label: "Discord" },
  { value: "slack", label: "Slack" },
  { value: "teams", label: "Microsoft Teams" },
  { value: "custom", label: "HTTP personnalisé" },
];

const NotificationsTab = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Formulaire pour l'ajout de webhook
  const form = useForm<WebhookFormValues>({
    resolver: zodResolver(webhookFormSchema),
    defaultValues: {
      name: '',
      url: '',
      type: 'discord',
    },
  });

  // Requête pour obtenir les webhooks
  const { data: webhooks = [], isLoading: isLoadingWebhooks } = useQuery({
    queryKey: ['webhooks'],
    queryFn: webhooksApi.getWebhooks,
  });

  // Mutation pour ajouter un webhook
  const addWebhookMutation = useMutation({
    mutationFn: (newWebhook: Omit<Webhook, 'id'>) => 
      webhooksApi.addWebhook(newWebhook),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      setIsAddDialogOpen(false);
      form.reset();
    },
  });

  // Mutation pour mettre à jour un webhook
  const updateWebhookMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<Webhook> }) => 
      webhooksApi.updateWebhook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    },
  });

  // Mutation pour supprimer un webhook
  const deleteWebhookMutation = useMutation({
    mutationFn: (id: number) => webhooksApi.deleteWebhook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    },
  });

  // Gestion de l'ajout de webhook
  const handleAddWebhook = (values: WebhookFormValues) => {
    addWebhookMutation.mutate({
      name: values.name,
      url: values.url,
      type: values.type,
      actif: true,
    });
  };

  // Gestion de la suppression de webhook
  const handleRemoveWebhook = (id: number) => {
    deleteWebhookMutation.mutate(id);
  };

  // Gestion de l'activation/désactivation de webhook
  const handleToggleWebhookActive = (id: number, currentState: boolean) => {
    updateWebhookMutation.mutate({
      id,
      data: { actif: !currentState }
    });
  };

  // Gestion de l'envoi de test
  const handleSendTest = (webhook: Webhook) => {
    toast({
      title: "Test envoyé",
      description: `Une notification test a été envoyée à ${webhook.name}.`,
    });
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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddWebhook)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Alertes Slack" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un type de webhook" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {webhookTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button 
                      type="submit"
                      disabled={addWebhookMutation.isPending}
                    >
                      {addWebhookMutation.isPending ? "Ajout en cours..." : "Ajouter le webhook"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
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
                        className={webhook.actif ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}
                      >
                        {webhook.actif ? "Actif" : "Inactif"}
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
                        checked={webhook.actif}
                        onCheckedChange={() => handleToggleWebhookActive(webhook.id, webhook.actif)}
                        disabled={updateWebhookMutation.isPending}
                      />
                      <Label htmlFor={`webhook-toggle-${webhook.id}`} className="text-sm">
                        {webhook.actif ? "Activé" : "Désactivé"}
                      </Label>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleSendTest(webhook)}
                    >
                      Test
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveWebhook(webhook.id)}
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
