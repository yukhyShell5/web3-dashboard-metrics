
import React from 'react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { MoreVerticalIcon } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Rule } from './utils/sortHelpers';

interface RuleActionsProps {
  rule: Rule;
  onToggleRule?: (ruleName: string, active: boolean) => Promise<void>;
  onEditRule: (rule: Rule) => void;
}

const RuleActions: React.FC<RuleActionsProps> = ({ 
  rule, 
  onToggleRule, 
  onEditRule
}) => {
  const handleToggleRule = async () => {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="mx-auto">
          <MoreVerticalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEditRule(rule)}>Edit</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggleRule}>
          {rule.status === 'active' ? 'Désactiver' : 'Activer'}
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RuleActions;
