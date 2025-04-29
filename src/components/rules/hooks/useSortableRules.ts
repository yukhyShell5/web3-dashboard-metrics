
import { useState, useEffect, useMemo } from 'react';
import { sortRules, SortField, SortDirection, Rule } from '../utils/sortHelpers';

export function useSortableRules(rules: Rule[]) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedRules = useMemo(() => {
    return sortRules(rules, sortField, sortDirection);
  }, [rules, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    sortedRules,
    sortField,
    sortDirection,
    handleSort
  };
}
