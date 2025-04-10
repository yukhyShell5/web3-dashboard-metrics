import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  CheckIcon, 
  AlertTriangleIcon, 
  PlusIcon, 
  PauseCircleIcon,
  StopCircleIcon,
  SlidersIcon,
  ZapIcon,
  BellIcon,
  CircleDotIcon
} from 'lucide-react';
import { rulesApi } from '@/services/apiService';

const RecentRuleActivity: React.FC = () => {
  const [lastTriggeredRules, setLastTriggeredRules] = useState<any[]>([]);

  useEffect(() => {
    const fetchLastTriggeredRules = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/last-triggered-rules`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setLastTriggeredRules(data);
      } catch (error) {
        console.error('Error fetching last triggered rules:', error);
      }
    };

    fetchLastTriggeredRules();
    const interval = setInterval(fetchLastTriggeredRules, 30000); // Rafraîchir toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  // Fonction pour formater la date relative (ex: "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Rule Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Première colonne */}
          <div className="space-y-4">
            <div className="flex gap-2 items-start">
              <div className="bg-green-500/20 text-green-500 p-1 rounded">
                <CheckIcon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium">Rule Activated</div>
                <div className="text-xs text-muted-foreground">High Value Transfer - 2 hours ago</div>
              </div>
            </div>
            <div className="flex gap-2 items-start">
              <div className="bg-orange-500/20 text-orange-500 p-1 rounded">
                <AlertTriangleIcon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium">Rule Modified</div>
                <div className="text-xs text-muted-foreground">Gas Anomaly - 1 day ago</div>
              </div>
            </div>
            {/* Nouvel élément - Dernière règle déclenchée */}
            {lastTriggeredRules[0] && (
              <div className="flex gap-2 items-start">
                <div className="bg-purple-500/20 text-purple-500 p-1 rounded">
                  <CircleDotIcon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Rule Triggered</div>
                  <div className="text-xs text-muted-foreground">
                    {lastTriggeredRules[0].ruleName} - {formatRelativeTime(lastTriggeredRules[0].lastTriggered)}
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-2 items-start">
              <div className="bg-red-500/20 text-red-500 p-1 rounded">
                <StopCircleIcon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium">Rule Disabled</div>
                <div className="text-xs text-muted-foreground">Flash Loan Detection - 1 week ago</div>
              </div>
            </div>
          </div>
          
          {/* Deuxième colonne */}
          <div className="space-y-4">
            <div className="flex gap-2 items-start">
              <div className="bg-blue-500/20 text-blue-500 p-1 rounded">
                <PlusIcon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium">Rule Created</div>
                <div className="text-xs text-muted-foreground">New Contract Deployment - 3 days ago</div>
              </div>
            </div>
            <div className="flex gap-2 items-start">
              <div className="bg-amber-500/20 text-amber-500 p-1 rounded">
                <PauseCircleIcon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium">Rule Paused</div>
                <div className="text-xs text-muted-foreground">MEV Detection - 5 days ago</div>
              </div>
            </div>
            {/* Nouvel élément - Seconde dernière règle déclenchée */}
            {lastTriggeredRules[1] && (
              <div className="flex gap-2 items-start">
                <div className="bg-yellow-500/20 text-yellow-500 p-1 rounded">
                  <ZapIcon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Rule Triggered</div>
                  <div className="text-xs text-muted-foreground">
                    {lastTriggeredRules[1].ruleName} - {formatRelativeTime(lastTriggeredRules[1].lastTriggered)}
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-2 items-start">
              <div className="bg-cyan-500/20 text-cyan-500 p-1 rounded">
                <BellIcon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium">Alert Configured</div>
                <div className="text-xs text-muted-foreground">New Notification - 4 days ago</div>
              </div>
            </div>
            <div className="flex gap-2 items-start">
              <div className="bg-purple-500/20 text-purple-500 p-1 rounded">
                <SlidersIcon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium">Threshold Updated</div>
                <div className="text-xs text-muted-foreground">Large Withdrawal - 2 days ago</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentRuleActivity;