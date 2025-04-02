
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
const activityData = [
  { time: '00:00', transactions: 120 },
  { time: '01:00', transactions: 95 },
  { time: '02:00', transactions: 75 },
  { time: '03:00', transactions: 60 },
  { time: '04:00', transactions: 45 },
  { time: '05:00', transactions: 40 },
  { time: '06:00', transactions: 65 },
  { time: '07:00', transactions: 85 },
  { time: '08:00', transactions: 160 },
  { time: '09:00', transactions: 220 },
  { time: '10:00', transactions: 280 },
  { time: '11:00', transactions: 310 },
  { time: '12:00', transactions: 290 },
  { time: '13:00', transactions: 275 },
  { time: '14:00', transactions: 310 },
  { time: '15:00', transactions: 340 },
  { time: '16:00', transactions: 350 },
  { time: '17:00', transactions: 325 },
  { time: '18:00', transactions: 290 },
  { time: '19:00', transactions: 265 },
  { time: '20:00', transactions: 240 },
  { time: '21:00', transactions: 210 },
  { time: '22:00', transactions: 180 },
  { time: '23:00', transactions: 150 },
];

const alertsByTypeData = [
  { name: 'Suspicious Tx', value: 53 },
  { name: 'Smart Contract', value: 28 },
  { name: 'Wallet', value: 43 },
  { name: 'DeFi Attack', value: 15 },
  { name: 'Gas Anomaly', value: 22 },
];

const alertsBySeverityData = [
  { name: 'Critical', value: 12 },
  { name: 'High', value: 24 },
  { name: 'Medium', value: 36 },
  { name: 'Low', value: 48 },
  { name: 'Info', value: 30 },
];

const Home = () => {
  const primaryDashboard = useDashboardStore(state => state.dashboards.find(d => d.isPrimary));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          {primaryDashboard && (
            <p className="text-muted-foreground">
              Displaying primary dashboard: {primaryDashboard.title}
            </p>
          )}
        </div>
        <Button className="flex items-center gap-2" asChild>
          <Link to="/dashboards">
            Manage Dashboards <ArrowUpRightIcon className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Alerts" 
          value="253" 
          icon={<AlertCircleIcon className="h-4 w-4" />} 
          change={{ value: 12, positive: true }}
        />
        <StatCard 
          title="Monitored Addresses" 
          value="42" 
          icon={<DatabaseIcon className="h-4 w-4" />} 
          change={{ value: 5, positive: true }}
        />
        <StatCard 
          title="Active Rules" 
          value="18" 
          icon={<EyeIcon className="h-4 w-4" />} 
          change={{ value: 2, positive: true }}
        />
        <StatCard 
          title="Tx Monitored" 
          value="18,256" 
          icon={<ActivityIcon className="h-4 w-4" />} 
          change={{ value: 8, positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="24h Activity Overview" className="lg:col-span-2">
          <BarChart 
            data={activityData} 
            xDataKey="time" 
            height={300}
            bars={[
              { dataKey: 'transactions', fill: '#3b82f6', name: 'Transactions' }
            ]}
          />
        </ChartCard>
        <ChartCard title="Alerts by Category">
          <BarChart 
            data={alertsByTypeData.map(item => ({ name: item.name, value: item.value }))} 
            xDataKey="name" 
            height={300}
            bars={[
              { dataKey: 'value', fill: '#8b5cf6', name: 'Count' },
            ]}
          />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Alert Trend (Last 7 days)">
          <LineChart 
            data={[
              { day: 'Mon', critical: 5, high: 8, medium: 12, low: 15 },
              { day: 'Tue', critical: 3, high: 10, medium: 8, low: 12 },
              { day: 'Wed', critical: 7, high: 13, medium: 15, low: 18 },
              { day: 'Thu', critical: 2, high: 9, medium: 11, low: 14 },
              { day: 'Fri', critical: 4, high: 7, medium: 13, low: 16 },
              { day: 'Sat', critical: 1, high: 5, medium: 7, low: 10 },
              { day: 'Sun', critical: 6, high: 11, medium: 9, low: 13 },
            ]}
            xDataKey="day"
            lines={[
              { dataKey: 'critical', stroke: '#ef4444', name: 'Critical' },
              { dataKey: 'high', stroke: '#f97316', name: 'High' },
              { dataKey: 'medium', stroke: '#eab308', name: 'Medium' },
              { dataKey: 'low', stroke: '#3b82f6', name: 'Low' },
            ]}
          />
        </ChartCard>
        <ChartCard title="Recent Active Chains">
          <BarChart 
            data={[
              { chain: 'Ethereum', alerts: 42, transactions: 5600 },
              { chain: 'Polygon', alerts: 28, transactions: 4200 },
              { chain: 'Optimism', alerts: 23, transactions: 3800 },
              { chain: 'Arbitrum', alerts: 34, transactions: 4800 },
              { chain: 'Base', alerts: 18, transactions: 2600 },
            ]}
            xDataKey="chain"
            bars={[
              { dataKey: 'alerts', fill: '#8b5cf6', name: 'Alerts' },
              { dataKey: 'transactions', fill: '#22c55e', name: 'Transactions' },
            ]}
          />
        </ChartCard>
      </div>
    </div>
  );
};

export default Home;
