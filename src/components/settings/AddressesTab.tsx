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
import { addressesApi, MonitoredAddress } from '@/services/apiService';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Schéma de validation pour le formulaire d'adresse
const addressFormSchema = z.object({
  address: z.string()
    .min(1, "L'adresse est requise")
    .regex(/^0x[a-fA-F0-9]{40}$/, "L'adresse doit être au format 0x... (42 caractères)"),
  name: z.string()
    .min(2, "Le libellé doit contenir au moins 2 caractères")
    .max(50, "Le libellé ne peut pas dépasser 50 caractères"),
  blockchain: z.string(),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

// Updated blockchains array to use lowercase values that match the FastAPI enum
const blockchains = [
  { value: "ethereum", label: "Ethereum" },
  { value: "polygon", label: "Polygon" },
  { value: "arbitrum", label: "Arbitrum" },
  { value: "optimism", label: "Optimism" },
  { value: "base", label: "Base" },
  { value: "bsc", label: "BSC" }
];

const AddressesTab = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Formulaire pour l'ajout d'adresse
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      address: '',
      name: '',
      blockchain: 'ethereum',
    },
  });

  // Requête pour obtenir les adresses surveillées
  const { data: addresses = [], isLoading: isLoadingAddresses } = useQuery({
    queryKey: ['watchedAddresses'],
    queryFn: addressesApi.getWatchedAddresses,
  });

  // Mutation pour ajouter une adresse
  const addAddressMutation = useMutation({
    mutationFn: (newAddress: Omit<MonitoredAddress, 'id'>) => 
      addressesApi.addWatchedAddress(newAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchedAddresses'] });
      setIsAddDialogOpen(false);
      form.reset();
    },
  });

  // Mutation pour mettre à jour une adresse
  const updateAddressMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<MonitoredAddress> }) => 
      addressesApi.updateWatchedAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchedAddresses'] });
    },
  });

  // Mutation pour supprimer une adresse
  const deleteAddressMutation = useMutation({
    mutationFn: (id: number) => addressesApi.deleteWatchedAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchedAddresses'] });
    },
  });

  // Gestion de l'ajout d'adresse
  const handleAddAddress = (values: AddressFormValues) => {
    addAddressMutation.mutate({
      address: values.address,
      name: values.name,
      blockchain: values.blockchain,
      actif: true,
    });
  };

  // Gestion de la suppression d'adresse
  const handleRemoveAddress = (id: number) => {
    deleteAddressMutation.mutate(id);
  };

  // Gestion de l'activation/désactivation d'adresse
  const handleToggleAddressMonitoring = (id: number, currentState: boolean) => {
    updateAddressMutation.mutate({
      id,
      data: { actif: !currentState }
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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddAddress)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input placeholder="0x..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Libellé</FormLabel>
                      <FormControl>
                        <Input placeholder="Mon portefeuille" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="blockchain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blockchain</FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une blockchain" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {blockchains.map((blockchain) => (
                            <SelectItem key={blockchain.value} value={blockchain.value}>
                              {blockchain.label}
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
                    disabled={addAddressMutation.isPending}
                  >
                    {addAddressMutation.isPending ? "Ajout en cours..." : "Ajouter l'adresse"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
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
                    {address.name}
                    <Badge
                      variant="outline"
                      className={address.actif ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}
                    >
                      {address.actif ? "Surveillance active" : "En pause"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground font-mono">{address.address}</div>
                  <div className="text-xs">
                    <Badge variant="outline" className="capitalize">
                      {address.blockchain}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`address-toggle-${address.id}`}
                      checked={address.actif}
                      onCheckedChange={() => handleToggleAddressMonitoring(address.id, address.actif)}
                      disabled={updateAddressMutation.isPending}
                    />
                    <Label htmlFor={`address-toggle-${address.id}`} className="text-sm">
                      {address.actif ? "Activé" : "Désactivé"}
                    </Label>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAddress(address.id)}
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
