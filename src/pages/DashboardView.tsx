
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDashboardStore, Dashboard } from '@/services/dashboardService';
import { ArrowLeftIcon, EditIcon } from 'lucide-react';
import DashboardViewer from '@/components/dashboard/DashboardViewer';
import { toast } from 'sonner';

const DashboardView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dashboards = useDashboardStore(state => state.dashboards);
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

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/dashboards')}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{dashboard.title}</h1>
            <p className="text-muted-foreground">{dashboard.description}</p>
          </div>
        </div>
        <Button 
          onClick={() => navigate(`/dashboards/edit/${dashboard.id}`)}
          variant="outline"
        >
          <EditIcon className="h-4 w-4 mr-2" /> Edit Dashboard
        </Button>
      </div>

      <div className="bg-card p-6 rounded-lg border">
        <DashboardViewer dashboard={dashboard} />
      </div>
    </div>
  );
};

export default DashboardView;
