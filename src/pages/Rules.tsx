
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { PlusIcon } from 'lucide-react';

// Import our new components
import RuleList from '@/components/rules/RuleList';
import RuleCreateForm from '@/components/rules/RuleCreateForm';
import RuleStatistics from '@/components/rules/RuleStatistics';
import RecentRuleActivity from '@/components/rules/RecentRuleActivity';
import RuleFilters from '@/components/rules/RuleFilters';

// Define the Rule type to match what RuleList expects
type Rule = {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  status: 'active' | 'paused' | 'disabled';
  created: string;
  triggers: number;
}

const Rules = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all-status');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Mock rules data with properly typed severity values
  const rules: Rule[] = [
    {
      id: '1',
      name: 'High Value Transfer',
      description: 'Alert on transfers over 100 ETH',
      severity: 'high',
      category: 'transaction',
      status: 'active',
      created: '2023-07-15T10:30:00Z',
      triggers: 24,
    },
    {
      id: '2',
      name: 'Smart Contract Interaction',
      description: 'Alert when specific addresses interact with flagged contracts',
      severity: 'medium',
      category: 'smart-contract',
      status: 'active',
      created: '2023-07-20T11:45:00Z',
      triggers: 56,
    },
    {
      id: '3',
      name: 'MEV Detection',
      description: 'Detect potential MEV activity in transactions',
      severity: 'critical',
      category: 'transaction',
      status: 'paused',
      created: '2023-07-25T15:20:00Z',
      triggers: 17,
    },
    {
      id: '4',
      name: 'Gas Anomaly',
      description: 'Alert on unusual gas price patterns',
      severity: 'low',
      category: 'gas',
      status: 'active',
      created: '2023-08-01T09:10:00Z',
      triggers: 42,
    },
    {
      id: '5',
      name: 'New Contract Deployment',
      description: 'Alert when monitored addresses deploy new contracts',
      severity: 'medium',
      category: 'smart-contract',
      status: 'active',
      created: '2023-08-05T13:25:00Z',
      triggers: 8,
    },
  ];

  // Apply filters
  const filteredRules = rules.filter(rule => {
    // Search filter
    const matchesSearch = 
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Severity filter
    const matchesSeverity = 
      severityFilter === 'all' || rule.severity === severityFilter;
    
    // Status filter
    const matchesStatus = 
      statusFilter === 'all-status' || rule.status === statusFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleCreateRule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Creating new rule:', Object.fromEntries(formData));
    setDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alert Rules</h1>
          <p className="text-muted-foreground">Configure detection rules for blockchain activity</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              Create Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Alert Rule</DialogTitle>
              <DialogDescription>
                Configure when and how alerts are triggered for monitored addresses
              </DialogDescription>
            </DialogHeader>
            <RuleCreateForm onSubmit={handleCreateRule} />
          </DialogContent>
        </Dialog>
      </div>

      <RuleFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        severityFilter={severityFilter}
        setSeverityFilter={setSeverityFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Alert Rules</CardTitle>
          <CardDescription>
            Rules that trigger alerts based on blockchain activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RuleList rules={filteredRules} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RuleStatistics rules={rules} />
        <RecentRuleActivity />
      </div>
    </div>
  );
};

export default Rules;
