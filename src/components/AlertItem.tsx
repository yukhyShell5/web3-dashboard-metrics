
import React from 'react';
import { AlertCircleIcon, AlertTriangleIcon, InfoIcon, ShieldIcon, ShieldAlertIcon } from 'lucide-react';

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface AlertItemProps {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
  source: string;
}

const severityConfig = {
  critical: {
    icon: AlertCircleIcon,
    badgeClass: 'alert-badge-critical',
    text: 'Critical',
  },
  high: {
    icon: ShieldAlertIcon,
    badgeClass: 'alert-badge-high',
    text: 'High',
  },
  medium: {
    icon: AlertTriangleIcon,
    badgeClass: 'alert-badge-medium',
    text: 'Medium',
  },
  low: {
    icon: ShieldIcon,
    badgeClass: 'alert-badge-low',
    text: 'Low',
  },
  info: {
    icon: InfoIcon,
    badgeClass: 'alert-badge-info',
    text: 'Info',
  },
};

const AlertItem: React.FC<AlertItemProps> = ({ title, description, severity, timestamp, source }) => {
  const { icon: Icon, badgeClass, text } = severityConfig[severity];
  
  return (
    <div className="border border-border rounded-lg p-4 mb-4 bg-card hover:bg-accent/5 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full ${severity === 'critical' ? 'bg-red-500/10' : severity === 'high' ? 'bg-orange-500/10' : severity === 'medium' ? 'bg-yellow-500/10' : severity === 'low' ? 'bg-blue-500/10' : 'bg-green-500/10'}`}>
            <Icon className={`h-5 w-5 ${severity === 'critical' ? 'text-red-500' : severity === 'high' ? 'text-orange-500' : severity === 'medium' ? 'text-yellow-500' : severity === 'low' ? 'text-blue-500' : 'text-green-500'}`} />
          </div>
          <div>
            <h3 className="font-semibold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{description}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{new Date(timestamp).toLocaleString()}</span>
              <span className="bg-secondary px-2 py-0.5 rounded">{source}</span>
            </div>
          </div>
        </div>
        <span className={`${badgeClass} alert-badge`}>{text}</span>
      </div>
    </div>
  );
};

export default AlertItem;
