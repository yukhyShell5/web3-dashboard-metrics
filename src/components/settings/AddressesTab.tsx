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
import { addressesApi } from '@/services/apiService';

// Type pour les adresses surveillées
interface WatchedAddress {
  id: number;
  address: string;
  name: string;
  blockchain: string;
  active: boolean;
}

const AddressesTab = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Partial<WatchedAddress>>({
    address: '',
    name: '',
    blockchain: 'ethereum',
    active: true
  });
  const [isEditMode, setIsEditMode] = useState(false);

  // Requête pour obtenir les adresses surveillées
  const { data: watchedAddresses, isLoading: isLoadingAddresses } = useQuery<WatchedAddress[]>({
    queryKey: ['watched-addresses'],
    queryFn: () => addressesApi.getWatchedAddresses().then(res => res.watched_addresses)
  });

  // Mutation pour créer une nouvelle adresse
  const createAddressMutation = useMutation({
    mutationFn: (newAddress: Omit<WatchedAddress, 'id'>) => 
      addressesApi.createWatchedAddress(newAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watched-addresses'] });
      toast({
        title: "Adresse ajoutée",
        description: "L'adresse blockchain a été ajoutée au monitoring.",
      });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de l'adresse.",
        variant: "destructive",
      });
    }
  });

  // Mutation pour mettre à jour une adresse
  const updateAddressMutation = useMutation({
    mutationFn: ({ id, ...data }: WatchedAddress) => 
      addressesApi.updateWatchedAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watched-addresses'] });
      toast({
        title: "Adresse mise à jour",
        description: "L'adresse blockchain a été modifiée avec succès.",
      });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'adresse.",
        variant: "destructive",
      });
    }
  });

  // Mutation pour supprimer une adresse
  const deleteAddressMutation = useMutation({
    mutationFn: (id: number) => addressesApi.deleteWatchedAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watched-addresses'] });
      toast({
        title: "Adresse supprimée",
        description: "L'adresse blockchain a été supprimée du monitoring.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'adresse.",
        variant: "destructive",
      });
    }
  });

  const handleOpenAddDialog = () => {
    setIsEditMode(false);
    setCurrentAddress({
      address: '',
      name: '',
      blockchain: 'ethereum',
      active: true
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (address: WatchedAddress) => {
    setIsEditMode(true);
    setCurrentAddress(address);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!currentAddress.address || !currentAddress.name) {
      toast({
        title: "Information manquante",
        description: "Veuillez remplir tous les champs requis.",
        variant: "destructive",
      });
      return;
    }

    if (isEditMode && currentAddress.id) {
      updateAddressMutation.mutate(currentAddress as WatchedAddress);
    } else {
      createAddressMutation.mutate(currentAddress as Omit<WatchedAddress, 'id'>);
    }
  };

  const handleToggleActive = (address: WatchedAddress) => {
    updateAddressMutation.mutate({
      ...address,
      active: !address.active
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adresses blockchain surveillées</CardTitle>
        <CardDescription>
          Ajoutez, modifiez et gérez les adresses pour la surveillance de sécurité
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleOpenAddDialog} className="w-full">
          <PlusIcon className="h-4 w-4 mr-2" />
          Ajouter une nouvelle adresse
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Modifier l'adresse" : "Ajouter une adresse blockchain"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode 
                  ? "Modifiez les détails de l'adresse surveillée"
                  : "Ajoutez une nouvelle adresse à surveiller pour les événements de sécurité"}
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
                  value={currentAddress.address}
                  onChange={(e) => setCurrentAddress({...currentAddress, address: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="name"
                  placeholder="Mon portefeuille"
                  className="col-span-3"
                  value={currentAddress.name}
                  onChange={(e) => setCurrentAddress({...currentAddress, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="blockchain" className="text-right">
                  Blockchain
                </Label>
                <Select 
                  value={currentAddress.blockchain}
                  onValueChange={(value) => setCurrentAddress({...currentAddress, blockchain: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner une blockchain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="polygon">Polygon</SelectItem>
                    <SelectItem value="arbitrum">Arbitrum</SelectItem>
                    <SelectItem value="optimism">Optimism</SelectItem>
                    <SelectItem value="base">Base</SelectItem>
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
                    checked={currentAddress.active ?? false}
                    onCheckedChange={(checked) => setCurrentAddress({...currentAddress, active: checked})}
                    className="col-span-3"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button 
                onClick={handleSubmit}
                disabled={createAddressMutation.isPending || updateAddressMutation.isPending}
              >
                {createAddressMutation.isPending || updateAddressMutation.isPending 
                  ? "Enregistrement en cours..." 
                  : isEditMode ? "Mettre à jour" : "Ajouter"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {isLoadingAddresses ? (
          <div className="py-10 text-center text-muted-foreground">
            Chargement des adresses...
          </div>
        ) : watchedAddresses && watchedAddresses.length > 0 ? (
          <div className="space-y-4 mt-4">
            {watchedAddresses.map((address) => (
              <div
                key={address.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-card"
              >
                <div className="space-y-1 mb-2 sm:mb-0">
                  <div className="font-medium flex flex-wrap gap-2 items-center">
                    {address.name}
                    <Badge
                      variant="outline"
                      className={address.active ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}
                    >
                      {address.active ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground font-mono">{address.address}</div>
                  <div className="text-xs">
                    <Badge variant="outline" className="mr-1">
                      {address.blockchain}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`address-toggle-${address.id}`}
                      checked={address.active}
                      onCheckedChange={() => handleToggleActive(address)}
                      disabled={updateAddressMutation.isPending}
                    />
                    <Label htmlFor={`address-toggle-${address.id}`} className="text-sm">
                      {address.active ? "Activé" : "Désactivé"}
                    </Label>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenEditDialog(address)}
                    disabled={updateAddressMutation.isPending}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteAddressMutation.mutate(address.id)}
                    disabled={deleteAddressMutation.isPending}
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
  );
};

export default AddressesTab;