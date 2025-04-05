
import React from 'react';
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
  PauseCircleIcon 
} from 'lucide-react';

const RecentRuleActivity: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Rule Activity</CardTitle>
      </CardHeader>
      <CardContent>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentRuleActivity;
