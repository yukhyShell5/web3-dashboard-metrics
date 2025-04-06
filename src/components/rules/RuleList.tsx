import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  MoreVerticalIcon, 
  CheckIcon, 
  XIcon, 
  PauseCircleIcon,
  ScrollTextIcon,
  BookIcon,
  InfoIcon
} from 'lucide-react';

type Rule = {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  status: 'active' | 'inactive' | 'error' | 'paused' | 'disabled';
  created: string;
  triggers: number;
}

interface RuleListProps {
  rules: Rule[];
  onToggleRule: (ruleName: string, active: boolean) => void;
}

const RuleList: React.FC<RuleListProps> = ({ rules, onToggleRule }) => {
  const getSeverityBadge = (severity: string) => {
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

  const getStatusBadge = (status: string) => {
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

  const getCategoryIcon = (category: string) => {
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Triggers</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rules.length > 0 ? (
          rules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{rule.name}</div>
                  <div className="text-xs text-muted-foreground">{rule.description}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getCategoryIcon(rule.category)}
                  <span className="capitalize">{rule.category.replace('-', ' ')}</span>
                </div>
              </TableCell>
              <TableCell>{getSeverityBadge(rule.severity)}</TableCell>
              <TableCell>{getStatusBadge(rule.status)}</TableCell>
              <TableCell className="text-right">{rule.triggers}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVerticalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem>
                      {rule.status === 'active' ? 'Pause' : 'Activate'}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
              No rules found matching the filters.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default RuleList;
