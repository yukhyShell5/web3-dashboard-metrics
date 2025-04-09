import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { toast } from "@/components/ui/use-toast";

interface RuleStatsProps {
  rules: Array<{
    id: string;
    status: string;
    triggers?: number;
    name: string;
    severity?: 'critical' | 'high' | 'medium' | 'low';
  }>;
}

interface RuleCounter {
  ruleName: string;
  triggerCount: number;
  lastTriggered: string;
}

const RuleStatistics: React.FC<RuleStatsProps> = ({ rules }) => {
  const [ruleCounters, setRuleCounters] = useState<RuleCounter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRuleCounters = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/rule-counters');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRuleCounters(data);
      } catch (error) {
        console.error("Error fetching rule counters:", error);
        toast({
          title: "Error",
          description: "Failed to load rule triggers data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRuleCounters();
  }, []);

  // Calculate total triggers from rule counters
  const totalTriggers = ruleCounters.reduce((acc, counter) => acc + counter.triggerCount, 0);

  // Find most active rule
  const mostActiveRule = ruleCounters.length > 0 
    ? ruleCounters.reduce((prev, current) => 
        (prev.triggerCount > current.triggerCount) ? prev : current
      ).ruleName
    : 'N/A';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rule Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>Active Rules</div>
            <div className="font-bold">{rules.filter(r => r.status === 'active').length}</div>
          </div>
          <div className="flex justify-between items-center">
            <div>Paused Rules</div>
            <div className="font-bold">{rules.filter(r => r.status === 'paused').length}</div>
          </div>
          <div className='flex justify-between items-center'>
            <div>Disabled Rules</div>
            <div className="font-bold">{rules.filter(r => r.status === 'disabled').length}</div>
          </div>
          <div className="flex justify-between items-center">
            <div>Total Triggers (30 days)</div>
            <div className="font-bold">
              {loading ? 'Loading...' : totalTriggers.toLocaleString()}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>Most Active Rule</div>
            <div className="font-bold">
              {loading ? 'Loading...' : mostActiveRule}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RuleStatistics;