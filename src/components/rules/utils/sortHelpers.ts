
export type SortField = 'name' | 'category' | 'severity' | 'status' | 'triggers';
export type SortDirection = 'asc' | 'desc';

export type Rule = {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  status: 'active' | 'paused' | 'disabled';
  created: string;
  triggers: number;
  lastTriggered?: string;
  code?: string;
}

// Sort rule list based on sort field and direction
export const sortRules = (rules: Rule[], sortField: SortField, sortDirection: SortDirection): Rule[] => {
  return [...rules].sort((a, b) => {
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
};
