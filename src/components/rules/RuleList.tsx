
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
} from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { Rule } from './utils/sortHelpers';
import { useSortableRules } from './hooks/useSortableRules';
import RuleTableHeader from './RuleTableHeader';
import RuleRowItem from './RuleRowItem';
import RuleListDialog from './RuleListDialog';

interface RuleListProps {
  rules: Rule[];
  onToggleRule?: (ruleName: string, active: boolean) => Promise<void>;
}

const RuleList: React.FC<RuleListProps> = ({ rules, onToggleRule }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState<Rule | null>(null);
  
  const { sortedRules, sortField, sortDirection, handleSort } = useSortableRules(rules);

  const handleEditRule = (rule: Rule) => {
    setCurrentRule(rule);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!currentRule) return;
    
    const formData = new FormData(e.currentTarget);
    const updatedRule = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      severity: formData.get('severity') as 'critical' | 'high' | 'medium' | 'low',
      category: formData.get('category') as string,
      status: formData.get('status') as 'active' | 'paused' | 'disabled',
      code: formData.get('code') as string
    };
    
    try {
      // TODO: Implement API call to update rule
      // For now, just show a success message
      toast({
        title: "Règle modifiée",
        description: `La règle "${updatedRule.name}" a été modifiée avec succès.`,
        variant: "default",
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating rule:", error);
      toast({
        title: "Erreur",
        description: `Échec de la modification de la règle "${currentRule.name}".`,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Table>
        <RuleTableHeader 
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
        />
        <TableBody>
          {sortedRules.length > 0 ? (
            sortedRules.map((rule) => (
              <RuleRowItem 
                key={rule.id}
                rule={rule}
                onToggleRule={onToggleRule}
                onEditRule={handleEditRule}
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-6 text-muted-foreground">
                No rules found matching the filters.
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
      
      <RuleListDialog
        dialogOpen={editDialogOpen}
        setDialogOpen={setEditDialogOpen}
        currentRule={currentRule}
        handleEditSubmit={handleEditSubmit}
      />
    </>
  )
}

export default RuleList;
