
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
import { addressesApi } from '@/services/apiService';

// Type pour les adresses surveillées
interface MonitoredAddress {
  id: string;
  address: string;
  label: string;
  chain: string;
  monitored: boolean;
}

const AddressesTab = () => {
  const queryClient = useQueryClient();
  const [addresses, setAddresses] = useState<MonitoredAddress[]>([]);
  const [newAddress, setNewAddress] = useState({ address: '', label: '', chain: 'ethereum' });

  // Requête pour obtenir les adresses surveillées
  const { data: watchedAddresses, isLoading: isLoadingAddresses } = useQuery({
    queryKey: ['watchedAddresses'],
    queryFn: addressesApi.getWatchedAddresses
  });

  // Mutation pour mettre à jour les adresses surveillées
  const updateAddressesMutation = useMutation({
    mutationFn: (addressList: string[]) => addressesApi.updateWatchedAddresses(addressList),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchedAddresses'] });
    }
  });

  // Effet pour mettre à jour l'état local à partir des données de l'API
  React.useEffect(() => {
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

  return (
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
  );
};

export default AddressesTab;
