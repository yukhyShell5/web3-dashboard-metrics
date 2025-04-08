
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

interface RuleStatsProps {
  rules: Array<{
    id: string;
    status: string;
    triggers: number;
    name: string;
    severity?: 'critical' | 'high' | 'medium' | 'low';
  }>;
}

const RuleStatistics: React.FC<RuleStatsProps> = ({ rules }) => {
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
            <div className="font-bold">{rules.reduce((acc, rule) => acc + rule.triggers, 0)}</div>
          </div>
          <div className="flex justify-between items-center">
            <div>Most Active Rule</div>
            <div className="font-bold">
              {rules.length > 0 ? rules.sort((a, b) => b.triggers - a.triggers)[0].name : 'N/A'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RuleStatistics;
