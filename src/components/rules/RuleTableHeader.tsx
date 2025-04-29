
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { SortField, SortDirection } from './utils/sortHelpers';

interface RuleTableHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  handleSort: (field: SortField) => void;
}

const RuleTableHeader: React.FC<RuleTableHeaderProps> = ({
  sortField,
  sortDirection,
  handleSort
}) => {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' 
      ? <ArrowUpIcon className="ml-1 h-4 w-4" /> 
      : <ArrowDownIcon className="ml-1 h-4 w-4" />;
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="cursor-pointer text-left" onClick={() => handleSort('name')}>
          <div className="flex items-center justify-start">
            Name
            {getSortIcon('name') || <div className="ml-1 h-4 w-4 opacity-0">•</div>}
          </div>
        </TableHead>
        <TableHead className="cursor-pointer text-left" onClick={() => handleSort('category')}>
          <div className="flex items-center justify-start">
            Category
            {getSortIcon('category') || <div className="ml-1 h-4 w-4 opacity-0">•</div>}
          </div>
        </TableHead>
        <TableHead className="cursor-pointer text-center" onClick={() => handleSort('severity')}>
          <div className="flex items-center justify-center">
            Severity
            {getSortIcon('severity') || <div className="ml-1 h-4 w-4 opacity-0">•</div>}
          </div>
        </TableHead>
        <TableHead className="cursor-pointer text-center" onClick={() => handleSort('status')}>
          <div className="flex items-center justify-center">
            Status
            {getSortIcon('status') || <div className="ml-1 h-4 w-4 opacity-0">•</div>}
          </div>
        </TableHead>
        <TableHead className="cursor-pointer text-center" onClick={() => handleSort('triggers')}>
          <div className="flex items-center justify-center">
            Triggers
            {getSortIcon('triggers') || <div className="ml-1 h-4 w-4 opacity-0">•</div>}
          </div>
        </TableHead>
        <TableHead className="text-center">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default RuleTableHeader;
