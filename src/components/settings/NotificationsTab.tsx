
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon, BellIcon } from 'lucide-react';
import { WebhookCreate, Webhook, webhooksApi } from '@/services/apiService';
import WebhookItem from './notifications/WebhookItem';
import WebhookForm from './notifications/WebhookForm';

const NotificationsTab: React.FC = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // Requête pour obtenir les webhooks
  const { 
    data: webhooks, 
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['webhooks'],
    queryFn: webhooksApi.getWebhooks
  });

  // Mutation pour créer un nouveau webhook
  const createWebhookMutation = useMutation({
    mutationFn: webhooksApi.createWebhook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      setIsDialogOpen(false);
    }
  });

  // Mutation pour activer/désactiver un webhook
  const toggleWebhookMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number, isActive: boolean }) => 
      webhooksApi.toggleWebhook(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    }
  });

  // Mutation pour supprimer un webhook
  const deleteWebhookMutation = useMutation({
    mutationFn: (id: number) => webhooksApi.deleteWebhook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    }
  });

  // Gérer l'ajout d'un nouveau webhook
  const handleAddWebhook = (webhook: WebhookCreate) => {
    createWebhookMutation.mutate(webhook);
  };

  // Gérer l'activation/désactivation d'un webhook
  const handleToggleWebhook = (id: number, isActive: boolean) => {
    toggleWebhookMutation.mutate({ id, isActive });
  };

  // Gérer la suppression d'un webhook
  const handleDeleteWebhook = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce webhook ?")) {
      deleteWebhookMutation.mutate(id);
    }
  };

  if (isError) {
    console.error("Erreur lors du chargement des webhooks :", error);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications et webhooks</CardTitle>
        <CardDescription>
          Configurez vos canaux de notifications pour les alertes de sécurité
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <PlusIcon className="h-4 w-4 mr-2" />
              Ajouter un webhook de notification
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un webhook</DialogTitle>
              <DialogDescription>
                Ajoutez un endpoint de notification pour recevoir les alertes de sécurité
              </DialogDescription>
            </DialogHeader>
            <WebhookForm 
              onSubmit={handleAddWebhook} 
              isSubmitting={createWebhookMutation.isPending}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {isLoading ? (
          <div className="py-10 text-center text-muted-foreground">
            Chargement des webhooks...
          </div>
        ) : isError ? (
          <div className="py-10 text-center text-destructive">
            Erreur lors du chargement des webhooks. Veuillez réessayer.
          </div>
        ) : webhooks && webhooks.length > 0 ? (
          <div className="space-y-4 mt-4">
            {webhooks.map((webhook: Webhook) => (
              <WebhookItem
                key={webhook.id}
                webhook={webhook}
                onToggle={handleToggleWebhook}
                onDelete={handleDeleteWebhook}
                isDeleting={deleteWebhookMutation.isPending}
              />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-muted-foreground flex flex-col items-center gap-3">
            <BellIcon className="h-8 w-8 text-muted-foreground/50" />
            <p>Aucun webhook configuré. Ajoutez-en un pour recevoir des alertes.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsTab;
