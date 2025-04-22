import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellRingIcon } from 'lucide-react';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import RecentAlerts from '@/components/analytics/RecentAlerts';
import { useNavigate } from 'react-router-dom';
import { alertsApi } from '@/services/apiService';
import AlertFilters from '@/components/analytics/AlertFilters';

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
        
        // Process alerts by type
        const typeCounts = alerts.reduce((acc, alert) => {
          acc[alert.alert_type] = (acc[alert.alert_type] || 0) + 1;
          return acc;
        }, {});
        
        const typeData = Object.entries(typeCounts).map(([name, value]) => ({
          name,
          value
        }));
        
        // Process alerts by severity
        const severityCounts = alerts.reduce((acc, alert) => {
          acc[alert.severity] = (acc[alert.severity] || 0) + 1;
          return acc;
        }, {});
        
        const severityData = Object.entries(severityCounts).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
          active: selectedSeverity === name.toLowerCase()
        }));
        
        // Prepare timeline data for the last 24 hours
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        
        // Group alerts by hour
        const hourlyAlerts = {};
        
        alerts
          .filter(alert => new Date(alert.date) >= twentyFourHoursAgo)
          .forEach(alert => {
            const alertDate = new Date(alert.date);
            const hourKey = alertDate.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });
            
            if (!hourlyAlerts[hourKey]) {
              hourlyAlerts[hourKey] = {
                time: hourKey,
                critical: 0,
                high: 0,
                medium: 0,
                low: 0,
                info: 0,
                alerts: []
              };
            }
            
            hourlyAlerts[hourKey][alert.severity.toLowerCase()] += 1;
            hourlyAlerts[hourKey].alerts.push(alert);
          });
        
        // Convert to array and sort by time
        const timelinePoints = Object.values(hourlyAlerts)
          .sort((a: any, b: any) => {
            const timeA = a.time.split(':').map(Number);
            const timeB = b.time.split(':').map(Number);
            return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
          });
        
        setAlertsByTypeData(typeData);
        setAlertsBySeverityData(severityData);
        setTimelineData(timelinePoints);
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

      <div className="flex items-center justify-between">
        <RecentAlerts 
          activeSeverity={selectedSeverity} 
          selectedAlertId={selectedAlertId} 
        />
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
    </div>
  );
};

export default Analytics;
