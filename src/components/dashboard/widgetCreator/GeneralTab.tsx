
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface GeneralTabProps {
  title: string;
  setTitle: (title: string) => void;
}

const GeneralTab: React.FC<GeneralTabProps> = ({
  title,
  setTitle
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="widget-title">Widget Title</Label>
      <Input
        id="widget-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter widget title"
      />
    </div>
  );
};

export default GeneralTab;
