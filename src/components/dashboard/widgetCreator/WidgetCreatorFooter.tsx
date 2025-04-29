
import React from 'react';
import { Button } from '@/components/ui/button';

interface WidgetCreatorFooterProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const WidgetCreatorFooter: React.FC<WidgetCreatorFooterProps> = ({
  onSubmit,
  onCancel
}) => {
  return (
    <div className="p-4 border-t bg-muted/30 flex justify-end space-x-2">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button onClick={onSubmit}>
        Add Widget
      </Button>
    </div>
  );
};

export default WidgetCreatorFooter;
