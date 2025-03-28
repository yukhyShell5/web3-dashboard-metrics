
import React from 'react';
import { AlertCircleIcon, ActivityIcon, DatabaseIcon, EyeIcon, BarChart4Icon, ArrowUpRightIcon } from 'lucide-react';
import ChartCard from '@/components/ChartCard';
import StatCard from '@/components/StatCard';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';
import { Button } from '@/components/ui/button';

// Mock data for charts
const activityData = [
  { time: '00:00', alerts: 5, transactions: 120, events: 45 },
  { time: '04:00', alerts: 10, transactions: 240, events: 60 },
  { time: '08:00', alerts: 15, transactions: 300, events: 75 },
  { time: '12:00', alerts: 8, transactions: 280, events: 80 },
  { time: '16:00', alerts: 20, transactions: 350, events: 90 },
  { time: '20:00', alerts: 12, transactions: 200, events: 70 },
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
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <Button className="flex items-center gap-2">
          View All Analytics <ArrowUpRightIcon className="h-4 w-4" />
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
              { dataKey: 'alerts', fill: '#ef4444', name: 'Alerts' },
              { dataKey: 'transactions', fill: '#3b82f6', name: 'Transactions' },
              { dataKey: 'events', fill: '#22c55e', name: 'Events' }
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
