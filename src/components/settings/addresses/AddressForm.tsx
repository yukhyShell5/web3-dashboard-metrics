
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { WatchedAddressCreate } from '@/services/apiService';
import { toast } from '@/components/ui/use-toast';
import { DialogFooter } from '@/components/ui/dialog';

interface AddressFormProps {
  onSubmit: (address: WatchedAddressCreate) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ onSubmit, isSubmitting, onCancel }) => {
  const [formData, setFormData] = useState<WatchedAddressCreate>({
    address: '',
    name: '',
    blockchain: 'ethereum',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlockchainChange = (value: string) => {
    setFormData(prev => ({ ...prev, blockchain: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.address || !formData.name) {
      toast({
        title: "Information manquante",
        description: "Veuillez remplir tous les champs requis.",
        variant: "destructive",
      });
      return;
    }

    // Validation de l'adresse Ethereum (0x + 40 caractères hexadécimaux)
    const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethereumAddressRegex.test(formData.address)) {
      toast({
        title: "Adresse invalide",
        description: "Veuillez entrer une adresse Ethereum valide (format: 0x...).",
        variant: "destructive",
      });
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 py-2">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="address" className="text-right">
            Adresse
          </Label>
          <Input
            id="address"
            name="address"
            placeholder="0x..."
            className="col-span-3"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Libellé
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Mon portefeuille"
            className="col-span-3"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="blockchain" className="text-right">
            Blockchain
          </Label>
          <Select 
            value={formData.blockchain}
            onValueChange={handleBlockchainChange}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Sélectionner une blockchain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="polygon">Polygon</SelectItem>
              <SelectItem value="bsc">BSC</SelectItem>
              <SelectItem value="arbitrum">Arbitrum</SelectItem>
              <SelectItem value="optimism">Optimism</SelectItem>
              <SelectItem value="base">Base</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="notes" className="text-right">
            Notes
          </Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Notes optionnelles"
            className="col-span-3"
            value={formData.notes || ''}
            onChange={handleChange}
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="mr-2"
        >
          Annuler
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Ajout en cours..." : "Ajouter l'adresse"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AddressForm;
