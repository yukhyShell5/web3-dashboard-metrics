
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TrashIcon } from 'lucide-react';
import { WatchedAddress } from '@/services/apiService';

interface AddressItemProps {
  address: WatchedAddress;
  onToggle: (id: number, isActive: boolean) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

const AddressItem: React.FC<AddressItemProps> = ({ 
  address, 
  onToggle, 
  onDelete,
  isDeleting
}) => {
  const displayBlockchain = (chain: string) => {
    switch(chain.toLowerCase()) {
      case 'all': return 'Toutes les chaînes';
      case 'ethereum': return 'Ethereum';
      case 'polygon': return 'Polygon';
      case 'arbitrum': return 'Arbitrum';
      case 'optimism': return 'Optimism';
      case 'bsc': return 'BSC';
      case 'base': return 'Base';
      default: return chain;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-card">
      <div className="space-y-1 mb-2 sm:mb-0">
        <div className="font-medium flex flex-wrap gap-2 items-center">
          {address.name}
          <Badge
            variant="outline"
            className={address.is_active ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}
          >
            {address.is_active ? "Surveillance active" : "En pause"}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground font-mono">{address.address}</div>
        <div className="text-xs">
          <Badge variant="outline" className="mr-1">
            {displayBlockchain(address.blockchain)}
          </Badge>
          {address.notes && (
            <span className="text-muted-foreground ml-2">{address.notes}</span>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <Switch
            id={`address-toggle-${address.id}`}
            checked={address.is_active}
            onCheckedChange={() => onToggle(address.id, !address.is_active)}
          />
          <Label htmlFor={`address-toggle-${address.id}`} className="text-sm">
            {address.is_active ? "Activé" : "Désactivé"}
          </Label>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(address.id)}
          disabled={isDeleting}
        >
          <TrashIcon className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
};

export default AddressItem;
