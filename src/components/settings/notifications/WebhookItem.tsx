
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TrashIcon, BellIcon, BellOff, ExternalLinkIcon } from 'lucide-react';
import { Webhook } from '@/services/apiService';

interface WebhookItemProps {
  webhook: Webhook;
  onToggle: (id: number, isActive: boolean) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

const WebhookItem: React.FC<WebhookItemProps> = ({ 
  webhook, 
  onToggle, 
  onDelete,
  isDeleting
}) => {
  const displayWebhookType = (type: string) => {
    switch(type.toLowerCase()) {
      case 'discord': return 'Discord';
      case 'slack': return 'Slack';
      case 'teams': return 'MS Teams';
      case 'email': return 'Email';
      default: return type;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-card">
      <div className="space-y-1 mb-2 sm:mb-0">
        <div className="font-medium flex flex-wrap gap-2 items-center">
          {webhook.name}
          <Badge
            variant="outline"
            className={webhook.is_active ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}
          >
            {webhook.is_active ? "Notifications actives" : "Notifications en pause"}
          </Badge>
        </div>
        <div className="text-sm flex items-center gap-2">
          <Badge>{displayWebhookType(webhook.type)}</Badge>
          <a href={webhook.url} 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-muted-foreground hover:text-primary inline-flex items-center gap-1 underline-offset-4 hover:underline">
            <span className="text-xs truncate max-w-[300px]">{webhook.url}</span>
            <ExternalLinkIcon className="h-3 w-3" />
          </a>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <Switch
            id={`webhook-toggle-${webhook.id}`}
            checked={webhook.is_active}
            onCheckedChange={() => onToggle(webhook.id, !webhook.is_active)}
          />
          <Label htmlFor={`webhook-toggle-${webhook.id}`} className="text-sm flex items-center gap-1">
            {webhook.is_active ? (
              <>
                <BellIcon className="h-3 w-3" />
                <span>Activé</span>
              </>
            ) : (
              <>
                <BellOff className="h-3 w-3" />
                <span>Désactivé</span>
              </>
            )}
          </Label>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(webhook.id)}
          disabled={isDeleting}
        >
          <TrashIcon className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
};

export default WebhookItem;
