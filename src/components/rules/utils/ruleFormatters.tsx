
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, XIcon, PauseCircleIcon, ScrollTextIcon, BookIcon, InfoIcon } from 'lucide-react';

// Format severity badges
export const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case 'critical':
      return <Badge variant="outline" className="alert-badge-critical">Critical</Badge>;
    case 'high':
      return <Badge variant="outline" className="alert-badge-high">High</Badge>;
    case 'medium':
      return <Badge variant="outline" className="alert-badge-medium">Medium</Badge>;
    case 'low':
      return <Badge variant="outline" className="alert-badge-low">Low</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

// Format status indicators
export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return (
        <div className="flex items-center gap-1 text-green-500">
          <CheckIcon className="h-3 w-3" />
          <span>Active</span>
        </div>
      );
    case 'paused':
      return (
        <div className="flex items-center gap-1 text-amber-500">
          <PauseCircleIcon className="h-3 w-3" />
          <span>Paused</span>
        </div>
      );
    case 'disabled':
      return (
        <div className="flex items-center gap-1 text-gray-500">
          <XIcon className="h-3 w-3" />
          <span>Disabled</span>
        </div>
      );
    default:
      return <span>Unknown</span>;
  }
};

// Format category icons
export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'transaction':
      return <ScrollTextIcon className="h-4 w-4" />;
    case 'smart-contract':
      return <BookIcon className="h-4 w-4" />;
    case 'gas':
      return <InfoIcon className="h-4 w-4" />;
    default:
      return <InfoIcon className="h-4 w-4" />;
  }
};

// Format dates
export const formatDate = (dateString?: string) => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
