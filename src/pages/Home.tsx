
import React from 'react';
import { AlertCircleIcon, ActivityIcon, DatabaseIcon, EyeIcon } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { getPrimaryDashboard, useDashboardStore } from '@/services/dashboardService';

const Home = () => {
  const primaryDashboard = useDashboardStore(state => state.dashboards.find(d => d.isPrimary));
  return <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          {primaryDashboard && <p className="text-muted-foreground">
              Displaying primary dashboard: {primaryDashboard.title}
            </p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Alerts" value="253" icon={<AlertCircleIcon className="h-4 w-4" />} change={{
        value: 12,
        positive: true
      }} />
        <StatCard title="Monitored Addresses" value="42" icon={<DatabaseIcon className="h-4 w-4" />} change={{
        value: 5,
        positive: true
      }} />
        <StatCard title="Active Rules" value="18" icon={<EyeIcon className="h-4 w-4" />} change={{
        value: 2,
        positive: true
      }} />
        <StatCard title="Tx Monitored" value="18,256" icon={<ActivityIcon className="h-4 w-4" />} change={{
        value: 8,
        positive: true
      }} />
      </div>
    </div>;
};
export default Home;
