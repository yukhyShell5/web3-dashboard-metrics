
import React from 'react';
import { getPrimaryDashboard, useDashboardStore } from '@/services/dashboardStore';
import DashboardView from '@/components/dashboard/DashboardView';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const primaryDashboard = useDashboardStore(state => state.getPrimaryDashboard());
  const navigate = useNavigate();
  
  if (!primaryDashboard) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        </div>
        <div className="flex flex-col items-center justify-center h-[400px] border border-dashed rounded-lg p-6">
          <p className="text-muted-foreground mb-4">No primary dashboard set</p>
          <Button onClick={() => navigate('/dashboards')}>
            Go to Dashboards
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <DashboardView dashboardId={primaryDashboard.id} isHomePage={true} />
  );
};

export default Home;
