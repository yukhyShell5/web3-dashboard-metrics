
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Rule } from './utils/sortHelpers';
import { getSeverityBadge, getStatusBadge, getCategoryIcon, formatDate } from './utils/ruleFormatters';
import RuleActions from './RuleActions';

interface RuleRowItemProps {
  rule: Rule;
  onToggleRule?: (ruleName: string, active: boolean) => Promise<void>;
  onEditRule: (rule: Rule) => void;
}

const RuleRowItem: React.FC<RuleRowItemProps> = ({ 
  rule, 
  onToggleRule,
  onEditRule
}) => {
  return (
    <TableRow key={rule.id}>
      <TableCell className="text-left">
        <div className="flex flex-col items-start">
          <div className="font-medium">{rule.name}</div>
          <div className="text-xs text-muted-foreground">{rule.description}</div>
        </div>
      </TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-start gap-2">
          {getCategoryIcon(rule.category)}
          <span className="capitalize">{rule.category.replace('-', ' ')}</span>
        </div>
      </TableCell>
      <TableCell className="text-center">
        <div className="flex justify-center">
          {getSeverityBadge(rule.severity)}
        </div>
      </TableCell>
      <TableCell className="text-center">
        <div className="flex justify-center">
          {getStatusBadge(rule.status)}
        </div>
      </TableCell>
      <TableCell className="text-center">
        <div className="flex flex-col items-center">
          <Badge variant={rule.triggers > 0 ? "default" : "secondary"} className="mx-auto">
            {rule.triggers} triggers
          </Badge>
          {rule.triggers > 0 && (
            <span className="text-xs text-muted-foreground mt-1">
              Last: {formatDate(rule.lastTriggered)}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-center">
        <RuleActions 
          rule={rule} 
          onToggleRule={onToggleRule}
          onEditRule={onEditRule}
        />
      </TableCell>
    </TableRow>
  );
};

export default RuleRowItem;
