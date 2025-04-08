import React, { useState, useEffect } from 'react';
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
  InfoIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

type Rule = {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  status: 'active' | 'paused' | 'disabled';
  created: string;
  triggers: number;
  lastTriggered?: string;
}

interface RuleListProps {
  rules: Rule[];
  onToggleRule?: (ruleName: string, active: boolean) => Promise<void>;
}

type SortField = 'name' | 'category' | 'severity' | 'status' | 'triggers';
type SortDirection = 'asc' | 'desc';

const RuleList: React.FC<RuleListProps> = ({ rules, onToggleRule }) => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [triggerCounts, setTriggerCounts] = useState<Record<string, {count: number, lastTriggered?: string}>>({});

  // Fetch trigger counts on component mount
  useEffect(() => {
    const fetchTriggerCounts = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/rule-counters');
        const data = await response.json();
        
        const countsMap = data.reduce((acc, item) => {
          // Normalise les noms de règles en minuscules pour la correspondance
          const normalizedRuleName = item.ruleName.toLowerCase();
          acc[normalizedRuleName] = {
            count: item.triggerCount,
            lastTriggered: item.lastTriggered
          };
          return acc;
        }, {});
        
        console.log('Fetched trigger counts:', countsMap); // Debug
        setTriggerCounts(countsMap);
      } catch (error) {
        console.error("Failed to fetch trigger counts:", error);
      }
    };
    
    // Dans la fusion des règles :
    const rulesWithCounts = rules.map(rule => {
      const normalizedRuleName = rule.name.toLowerCase();
      return {
        ...rule,
        triggers: triggerCounts[normalizedRuleName]?.count || 0,
        lastTriggered: triggerCounts[normalizedRuleName]?.lastTriggered
      };
    });
    
    fetchTriggerCounts();
    
    // Set up polling every 30 seconds
    const interval = setInterval(fetchTriggerCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  // Merge rules with their trigger counts
  const rulesWithCounts = rules.map(rule => ({
    ...rule,
    triggers: triggerCounts[rule.name]?.count || 0,
    lastTriggered: triggerCounts[rule.name]?.lastTriggered
  }));

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

  const handleToggleRule = async (rule: Rule) => {
    if (!onToggleRule) return;
    
    const isCurrentlyActive = rule.status === 'active';
    
    try {
      await onToggleRule(rule.name, !isCurrentlyActive);
      
      toast({
        title: !isCurrentlyActive ? "Règle activée" : "Règle désactivée",
        description: `La règle "${rule.name}" a été ${!isCurrentlyActive ? 'activée' : 'désactivée'} avec succès.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error toggling rule:", error);
      toast({
        title: "Erreur",
        description: `Échec de ${!isCurrentlyActive ? "l'activation" : "la désactivation"} de la règle "${rule.name}".`,
        variant: "destructive",
      });
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' 
      ? <ArrowUpIcon className="ml-1 h-4 w-4" /> 
      : <ArrowDownIcon className="ml-1 h-4 w-4" />;
  };

  const sortedRules = [...rulesWithCounts].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'severity': {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        comparison = (severityOrder[a.severity] || 0) - (severityOrder[b.severity] || 0);
        break;
      }
      case 'status': {
        const statusOrder = { active: 3, paused: 2, disabled: 1 };
        comparison = (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
        break;
      }
      case 'triggers':
        comparison = a.triggers - b.triggers;
        break;
      default:
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const formatDate = (dateString?: string) => {
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
            <div className="flex items-center">
              Name
              {getSortIcon('name') || <div className="ml-1 h-4 w-4 opacity-0">•</div>}
            </div>
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort('category')}>
            <div className="flex items-center">
              Category
              {getSortIcon('category') || <div className="ml-1 h-4 w-4 opacity-0">•</div>}
            </div>
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort('severity')}>
            <div className="flex items-center">
              Severity
              {getSortIcon('severity') || <div className="ml-1 h-4 w-4 opacity-0">•</div>}
            </div>
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
            <div className="flex items-center">
              Status
              {getSortIcon('status') || <div className="ml-1 h-4 w-4 opacity-0">•</div>}
            </div>
          </TableHead>
          <TableHead className="text-right cursor-pointer" onClick={() => handleSort('triggers')}>
            <div className="flex items-center justify-end">
              Triggers
              {getSortIcon('triggers') || <div className="ml-1 h-4 w-4 opacity-0">•</div>}
            </div>
          </TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedRules.length > 0 ? (
          sortedRules.map((rule) => (
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
              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <Badge variant={rule.triggers > 0 ? "default" : "secondary"}>
                    {rule.triggers} triggers
                  </Badge>
                  {rule.triggers > 0 && (
                    <span className="text-xs text-muted-foreground mt-1">
                      Last: {formatDate(rule.lastTriggered)}
                    </span>
                  )}
                </div>
              </TableCell>
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
                    <DropdownMenuItem onClick={() => handleToggleRule(rule)}>
                      {rule.status === 'active' ? 'Désactiver' : 'Activer'}
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