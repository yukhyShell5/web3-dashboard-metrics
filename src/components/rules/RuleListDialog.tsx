
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import RuleEditForm from './RuleEditForm';
import { Rule } from './utils/sortHelpers';

interface RuleListDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  currentRule: Rule | null;
  handleEditSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const RuleListDialog: React.FC<RuleListDialogProps> = ({
  dialogOpen,
  setDialogOpen,
  currentRule,
  handleEditSubmit
}) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Rule</DialogTitle>
          <DialogDescription>
            Modify the rule settings and click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {currentRule && (
          <RuleEditForm rule={currentRule} onSubmit={handleEditSubmit} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RuleListDialog;
