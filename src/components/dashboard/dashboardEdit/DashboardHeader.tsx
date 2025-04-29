
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeftIcon, SaveIcon } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  dashboardId: string;
  onSave: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  dashboardId,
  onSave
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate('/dashboards')}
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold bg-transparent border-none focus-visible:ring-0 p-0 h-auto"
            placeholder="Dashboard Title"
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-sm text-muted-foreground bg-transparent border-none focus-visible:ring-0 p-0 h-auto"
            placeholder="Add a description"
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline"
          onClick={() => navigate(`/dashboards/view/${dashboardId}`)}
        >
          Cancel
        </Button>
        <Button 
          onClick={onSave}
          className="flex items-center gap-2"
        >
          <SaveIcon className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
