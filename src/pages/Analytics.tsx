import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellRingIcon } from 'lucide-react';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import RecentAlerts from '@/components/analytics/RecentAlerts';
import { useNavigate } from 'react-router-dom';
import { alertsApi } from '@/services/apiService';

const Analytics = () => {
  const navigate = useNavigate();
  const [alertsByTypeData, setAlertsByTypeData] = useState([]);
  const [alertsBySeverityData, setAlertsBySeverityData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlertData = async () => {
      try {
        const alerts = await alertsApi.getAlerts();
        
        // Process data for type distribution
        const typeCounts = alerts.reduce((acc, alert) => {
          acc[alert.alert_type] = (acc[alert.alert_type] || 0) + 1;
          return acc;
        }, {});
        
        const typeData = Object.entries(typeCounts).map(([name, value]) => ({
          name,
          value
        }));
        
        // Process data for severity distribution
        const severityCounts = alerts.reduce((acc, alert) => {
          acc[alert.severity] = (acc[alert.severity] || 0) + 1;
          return acc;
        }, {});
        
        const severityData = Object.entries(severityCounts).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
          active: selectedSeverity === name.toLowerCase()
        }));
        
        // Process timeline data - now keeping individual alerts
        const timelinePoints = alerts.map(alert => ({
          time: new Date(alert.date).toLocaleTimeString(),
          id: alert.id.toString(),
          [alert.severity.toLowerCase()]: 1,
          critical: alert.severity === 'critical' ? 1 : 0,
          high: alert.severity === 'high' ? 1 : 0,
          medium: alert.severity === 'medium' ? 1 : 0,
          low: alert.severity === 'low' ? 1 : 0,
          info: alert.severity === 'info' ? 1 : 0,
          alert
        }));
        
        // Sort by time
        const sortedTimeline = timelinePoints.sort((a, b) => 
          new Date(a.alert.date).getTime() - new Date(b.alert.date).getTime()
        );
        
        setAlertsByTypeData(typeData);
        setAlertsBySeverityData(severityData);
        setTimelineData(sortedTimeline);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching alert data:", error);
        setLoading(false);
      }
    };

    fetchAlertData();
  }, [selectedSeverity]);

  const handleSeverityClick = (severity: string) => {
    setSelectedSeverity(selectedSeverity === severity ? null : severity);
    setSelectedAlertId(null);
  };

  const handlePointClick = (alertId: string) => {
    setSelectedAlertId(alertId);
  };

  if (loading) {
    return <div>Loading analytics data...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Alerts</h1>
          <p className="text-muted-foreground">Monitor blockchain security events and alerts</p>
        </div>
        <Button className="flex items-center gap-2" variant="default" onClick={() => navigate('/settings?tab=notifications')}>
          <BellRingIcon className="h-4 w-4" />
          Configure Notifications
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Alert Distribution By Type</CardTitle>
            <CardDescription>Analytics of alert categories</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart 
              data={alertsByTypeData}
              colors={['#ef4444', '#f97316', '#3b82f6', '#a855f7', '#22c55e']}
              height={250}
              activeSeverity={selectedSeverity}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Alert Distribution By Severity</CardTitle>
            <CardDescription>Breakdown of alerts by severity level</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart 
              data={alertsBySeverityData}
              colors={['#ef4444', '#f97316', '#eab308', '#3b82f6', '#22c55e']}
              height={250}
              activeSeverity={selectedSeverity}
              onSeverityClick={handleSeverityClick}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row flex items-center justify-between">
          <div>
            <CardTitle>Alert Timeline</CardTitle>
            <CardDescription>Alert frequency over time</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <LineChart 
            data={timelineData}
            xDataKey="time"
            lines={[
              { dataKey: 'critical', stroke: '#ef4444', name: 'Critical', active: selectedSeverity === 'critical' },
              { dataKey: 'high', stroke: '#f97316', name: 'High', active: selectedSeverity === 'high' },
              { dataKey: 'medium', stroke: '#eab308', name: 'Medium', active: selectedSeverity === 'medium' },
              { dataKey: 'low', stroke: '#3b82f6', name: 'Low', active: selectedSeverity === 'low' },
              { dataKey: 'info', stroke: '#22c55e', name: 'Info', active: selectedSeverity === 'info' },
            ]}
            onLineClick={handleSeverityClick}
            onPointClick={handlePointClick}
          />
        </CardContent>
      </Card>

      <RecentAlerts 
        activeSeverity={selectedSeverity} 
        selectedAlertId={selectedAlertId} 
      />
    </div>
  );
};

export default Analytics;
