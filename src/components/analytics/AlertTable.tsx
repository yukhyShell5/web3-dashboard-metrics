// --- START OF FILE AlertTable.tsx ---

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, ShieldCheck } from 'lucide-react'; // Added ShieldCheck for compensation
import { AlertSeverity, AlertItemProps } from './RecentAlerts'; // Make sure RecentAlerts exports these

interface AlertTableProps {
  alerts: AlertItemProps[];
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  onViewAlert: (alert: AlertItemProps) => void;
  onCompensate: (alert: AlertItemProps) => void; // New prop
}

const AlertTable: React.FC<AlertTableProps> = ({
  alerts,
  sortField,
  sortDirection,
  onSort,
  onViewAlert,
  onCompensate, // New prop
}) => {
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const getSeverityBadge = (severity: AlertSeverity) => {
    const badgeClasses = {
      critical: 'bg-red-500/20 text-red-500',
      high: 'bg-orange-500/20 text-orange-500',
      medium: 'bg-yellow-500/20 text-yellow-500',
      low: 'bg-blue-500/20 text-blue-500',
      info: 'bg-green-500/20 text-green-500',
    };

    return (
      <Badge variant="outline" className={badgeClasses[severity]}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="cursor-pointer" onClick={() => onSort('title')}>
            <div className="flex items-center">
              Alert
              {getSortIcon('title')}
            </div>
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort('source')}>
            <div className="flex items-center">
              Source
              {getSortIcon('source')}
            </div>
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort('severity')}>
            <div className="flex items-center">
              Severity
              {getSortIcon('severity')}
            </div>
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort('timestamp')}>
            <div className="flex items-center">
              Time
              {getSortIcon('timestamp')}
            </div>
          </TableHead>
          <TableHead>Actions</TableHead> {/* Changed to Actions */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <TableRow key={alert.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{alert.title}</div>
                  <div className="text-xs text-muted-foreground">{alert.description}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{alert.source}</Badge>
              </TableCell>
              <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {new Date(alert.timestamp).toLocaleString()}
              </TableCell>
              <TableCell className="space-x-2"> {/* Added space-x-2 for button spacing */}
                <button
                  className="p-2 rounded border border-muted-foreground/20 hover:border-primary/80 text-muted-foreground hover:text-primary transition-all duration-200 hover:shadow-sm hover:bg-primary/5 group"
                  onClick={() => onViewAlert(alert)}
                  title="View Alert Details"
                >
                  <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  className="p-2 rounded border border-green-500/30 hover:border-green-500/80 text-green-600 hover:text-green-500 transition-all duration-200 hover:shadow-sm hover:bg-green-500/5 group"
                  onClick={() => onCompensate(alert)}
                  title="Trigger Compensation"
                >
                  <ShieldCheck className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
              No alerts match your filters
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default AlertTable;