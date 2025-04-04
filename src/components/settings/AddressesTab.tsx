
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { WatchedAddress, WatchedAddressCreate, addressesApi } from '@/services/apiService';
import AddressItem from './addresses/AddressItem';
import AddressForm from './addresses/AddressForm';

const AddressesTab: React.FC = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // Requête pour obtenir les adresses surveillées
  const { 
    data: addresses, 
    isLoading: isLoadingAddresses,
    isError,
    error
  } = useQuery({
    queryKey: ['watchedAddresses'],
    queryFn: addressesApi.getWatchedAddresses
  });

  // Mutation pour créer une nouvelle adresse
  const createAddressMutation = useMutation({
    mutationFn: addressesApi.createWatchedAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchedAddresses'] });
      setIsDialogOpen(false);
    }
  });

  // Mutation pour activer/désactiver une adresse
  const toggleAddressMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number, isActive: boolean }) => 
      addressesApi.toggleWatchedAddress(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchedAddresses'] });
    }
  });

  // Mutation pour supprimer une adresse
  const deleteAddressMutation = useMutation({
    mutationFn: (id: number) => addressesApi.deleteWatchedAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchedAddresses'] });
    }
  });

  // Gérer l'ajout d'une nouvelle adresse
  const handleAddAddress = (address: WatchedAddressCreate) => {
    createAddressMutation.mutate(address);
  };

  // Gérer l'activation/désactivation d'une adresse
  const handleToggleAddress = (id: number, isActive: boolean) => {
    toggleAddressMutation.mutate({ id, isActive });
  };

  // Gérer la suppression d'une adresse
  const handleDeleteAddress = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette adresse ?")) {
      deleteAddressMutation.mutate(id);
    }
  };

  if (isError) {
    console.error("Erreur lors du chargement des adresses :", error);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adresses blockchain surveillées</CardTitle>
        <CardDescription>
          Ajoutez, modifiez et gérez les adresses pour la surveillance de sécurité
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            <AddressForm 
              onSubmit={handleAddAddress} 
              isSubmitting={createAddressMutation.isPending}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {isLoadingAddresses ? (
          <div className="py-10 text-center text-muted-foreground">
            Chargement des adresses...
          </div>
        ) : isError ? (
          <div className="py-10 text-center text-destructive">
            Erreur lors du chargement des adresses. Veuillez réessayer.
          </div>
        ) : addresses && addresses.length > 0 ? (
          <div className="space-y-4 mt-4">
            {addresses.map((address: WatchedAddress) => (
              <AddressItem
                key={address.id}
                address={address}
                onToggle={handleToggleAddress}
                onDelete={handleDeleteAddress}
                isDeleting={deleteAddressMutation.isPending}
              />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-muted-foreground">
            Aucune adresse surveillée. Ajoutez-en une pour commencer.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddressesTab;
