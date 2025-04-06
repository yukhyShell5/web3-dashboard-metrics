
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDashboardStore, Dashboard, LayoutItem } from '@/services/dashboardService';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, SaveIcon } from 'lucide-react';
import { toast } from 'sonner';
import DashboardFactory from '@/components/dashboard/DashboardFactory';

const DashboardEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dashboards = useDashboardStore(state => state.dashboards);
  const updateDashboard = useDashboardStore(state => state.updateDashboard);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundDashboard = dashboards.find(d => d.id === id);
      if (foundDashboard) {
        setDashboard(foundDashboard);
      } else {
        toast.error('Dashboard not found');
        navigate('/dashboards');
      }
    }
  }, [id, dashboards, navigate]);

  if (!dashboard && id !== 'new') {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/dashboards')}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            {id === 'new' ? 'Create New Dashboard' : `Edit ${dashboard?.title}`}
          </h1>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border h-[calc(100vh-200px)]">
        <DashboardFactory />
      </div>
    </div>
  );
};

export default DashboardEdit;
