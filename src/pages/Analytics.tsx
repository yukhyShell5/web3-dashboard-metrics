import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BellRingIcon,
} from 'lucide-react';
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

  useEffect(() => {
    const fetchAlertData = async () => {
      try {
        // Récupérer les alertes depuis l'API
        const alerts = await alertsApi.getAlerts();
        
        // Traiter les données pour le graphique par type
        const typeCounts = alerts.reduce((acc, alert) => {
          acc[alert.alert_type] = (acc[alert.alert_type] || 0) + 1;
          return acc;
        }, {});
        
        const typeData = Object.entries(typeCounts).map(([name, value]) => ({
          name,
          value
        }));
        
        // Traiter les données pour le graphique par sévérité
        const severityCounts = alerts.reduce((acc, alert) => {
          acc[alert.severity] = (acc[alert.severity] || 0) + 1;
          return acc;
        }, {});
        
        const severityData = Object.entries(severityCounts).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value
        }));
        
        // Traiter les données pour la timeline (groupées par heure)
        const timeline = alerts.reduce((acc, alert) => {
          const date = new Date(alert.date);
          const hour = `${date.getHours()}:00`;
          
          if (!acc[hour]) {
            acc[hour] = {
              critical: 0,
              high: 0,
              medium: 0,
              low: 0,
              info: 0
            };
          }
          
          const severity = alert.severity.toLowerCase();
          acc[hour][severity]++;
          
          return acc;
        }, {});
        
        const timelineFormatted = Object.entries(timeline).map(([time, counts]) => ({
          time,
          ...counts
        })).sort((a, b) => a.time.localeCompare(b.time));
        
        setAlertsByTypeData(typeData);
        setAlertsBySeverityData(severityData);
        setTimelineData(timelineFormatted);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching alert data:", error);
        setLoading(false);
      }
    };

    fetchAlertData();
  }, []);

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
              { dataKey: 'critical', stroke: '#ef4444', name: 'Critical' },
              { dataKey: 'high', stroke: '#f97316', name: 'High' },
              { dataKey: 'medium', stroke: '#eab308', name: 'Medium' },
              { dataKey: 'low', stroke: '#3b82f6', name: 'Low' },
              { dataKey: 'info', stroke: '#22c55e', name: 'Info' },
            ]}
          />
        </CardContent>
      </Card>

      <RecentAlerts />
    </div>
  );
};

export default Analytics;