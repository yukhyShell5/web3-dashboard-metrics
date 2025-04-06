
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DashboardDetailsFormProps {
  dashboardData: {
    title: string;
    description: string;
    isPrimary: boolean;
  };
  onChange: (data: any) => void;
}

const DashboardDetailsForm: React.FC<DashboardDetailsFormProps> = ({
  dashboardData,
  onChange
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input 
          id="name" 
          placeholder="Dashboard name" 
          className="col-span-3"
          value={dashboardData.title}
          onChange={(e) => onChange({...dashboardData, title: e.target.value})}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Input 
          id="description" 
          placeholder="Brief description" 
          className="col-span-3" 
          value={dashboardData.description}
          onChange={(e) => onChange({...dashboardData, description: e.target.value})}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="primary" className="text-right">
          Set as primary
        </Label>
        <div className="col-span-3">
          <p className="text-sm text-muted-foreground mb-2">
            If checked, this dashboard will appear on the home page.
          </p>
          <input 
            type="checkbox" 
            id="primary" 
            checked={dashboardData.isPrimary}
            onChange={(e) => onChange({...dashboardData, isPrimary: e.target.checked})}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardDetailsForm;
