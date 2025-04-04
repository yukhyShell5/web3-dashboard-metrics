
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WebhookCreate } from '@/services/apiService';
import { toast } from '@/components/ui/use-toast';
import { DialogFooter } from '@/components/ui/dialog';

interface WebhookFormProps {
  onSubmit: (webhook: WebhookCreate) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

const WebhookForm: React.FC<WebhookFormProps> = ({ onSubmit, isSubmitting, onCancel }) => {
  const [formData, setFormData] = useState<WebhookCreate>({
    url: '',
    name: '',
    type: 'discord'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.url || !formData.name) {
      toast({
        title: "Information manquante",
        description: "Veuillez remplir tous les champs requis.",
        variant: "destructive",
      });
      return;
    }

    // Validation basique URL
    try {
      new URL(formData.url);
    } catch (e) {
      toast({
        title: "URL invalide",
        description: "Veuillez entrer une URL valide.",
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
          <Label htmlFor="name" className="text-right">
            Nom
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Webhook Discord principal"
            className="col-span-3"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="url" className="text-right">
            URL
          </Label>
          <Input
            id="url"
            name="url"
            placeholder="https://discord.com/api/webhooks/..."
            className="col-span-3"
            value={formData.url}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right">
            Type
          </Label>
          <Select 
            value={formData.type}
            onValueChange={handleTypeChange}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Sélectionner un type de webhook" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="discord">Discord</SelectItem>
              <SelectItem value="slack">Slack</SelectItem>
              <SelectItem value="teams">Microsoft Teams</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>
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
          {isSubmitting ? "Ajout en cours..." : "Ajouter le webhook"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default WebhookForm;
