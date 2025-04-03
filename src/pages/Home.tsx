import React from 'react';
import { AlertCircleIcon, ActivityIcon, DatabaseIcon, EyeIcon, BarChart4Icon, ArrowUpRightIcon } from 'lucide-react';
import ChartCard from '@/components/ChartCard';
import StatCard from '@/components/StatCard';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import { Button } from '@/components/ui/button';
import { getPrimaryDashboard, useDashboardStore } from '@/services/dashboardService';
import { Link } from 'react-router-dom';

// Mock data for charts with 1-hour intervals
const activityData = [{
  time: '00:00',
  transactions: 120
}, {
  time: '01:00',
  transactions: 95
}, {
  time: '02:00',
  transactions: 75
}, {
  time: '03:00',
  transactions: 60
}, {
  time: '04:00',
  transactions: 45
}, {
  time: '05:00',
  transactions: 40
}, {
  time: '06:00',
  transactions: 65
}, {
  time: '07:00',
  transactions: 85
}, {
  time: '08:00',
  transactions: 160
}, {
  time: '09:00',
  transactions: 220
}, {
  time: '10:00',
  transactions: 280
}, {
  time: '11:00',
  transactions: 310
}, {
  time: '12:00',
  transactions: 290
}, {
  time: '13:00',
  transactions: 275
}, {
  time: '14:00',
  transactions: 310
}, {
  time: '15:00',
  transactions: 340
}, {
  time: '16:00',
  transactions: 350
}, {
  time: '17:00',
  transactions: 325
}, {
  time: '18:00',
  transactions: 290
}, {
  time: '19:00',
  transactions: 265
}, {
  time: '20:00',
  transactions: 240
}, {
  time: '21:00',
  transactions: 210
}, {
  time: '22:00',
  transactions: 180
}, {
  time: '23:00',
  transactions: 150
}];
const alertsByTypeData = [{
  name: 'Suspicious Tx',
  value: 53
}, {
  name: 'Smart Contract',
  value: 28
}, {
  name: 'Wallet',
  value: 43
}, {
  name: 'DeFi Attack',
  value: 15
}, {
  name: 'Gas Anomaly',
  value: 22
}];
const alertsBySeverityData = [{
  name: 'Critical',
  value: 12
}, {
  name: 'High',
  value: 24
}, {
  name: 'Medium',
  value: 36
}, {
  name: 'Low',
  value: 48
}, {
  name: 'Info',
  value: 30
}];
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
        <Button className="flex items-center gap-2" asChild>
          <Link to="/dashboards">
            Manage Dashboards <ArrowUpRightIcon className="h-4 w-4" />
          </Link>
        </Button>
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