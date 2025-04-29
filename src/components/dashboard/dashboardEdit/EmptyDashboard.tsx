
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EmptyDashboardProps {
  onGoBack: () => void;
}

const EmptyDashboard: React.FC<EmptyDashboardProps> = ({ onGoBack }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
      <p className="text-xl font-semibold mb-4">Dashboard not found</p>
      <Button onClick={onGoBack}>
        Back to Dashboards
      </Button>
    </div>
  );
};

export default EmptyDashboard;
