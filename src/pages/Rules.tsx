import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter,
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  AlertCircleIcon, 
  MoreVerticalIcon, 
  PlusIcon, 
  SearchIcon, 
  CheckIcon, 
  XIcon,
  InfoIcon,
  AlertTriangleIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  ScrollTextIcon,
  BookIcon
} from 'lucide-react';

const Rules = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all-status');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Mock rules data
  const rules = [
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

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="outline" className="alert-badge-critical">Critical</Badge>;
      case 'high':
        return <Badge variant="outline" className="alert-badge-high">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="alert-badge-medium">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="alert-badge-low">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <div className="flex items-center gap-1 text-green-500">
            <CheckIcon className="h-3 w-3" />
            <span>Active</span>
          </div>
        );
      case 'paused':
        return (
          <div className="flex items-center gap-1 text-amber-500">
            <PauseCircleIcon className="h-3 w-3" />
            <span>Paused</span>
          </div>
        );
      case 'disabled':
        return (
          <div className="flex items-center gap-1 text-gray-500">
            <XIcon className="h-3 w-3" />
            <span>Disabled</span>
          </div>
        );
      default:
        return <span>Unknown</span>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transaction':
        return <ScrollTextIcon className="h-4 w-4" />;
      case 'smart-contract':
        return <BookIcon className="h-4 w-4" />;
      case 'gas':
        return <InfoIcon className="h-4 w-4" />;
      default:
        return <AlertCircleIcon className="h-4 w-4" />;
    }
  };

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
            <form onSubmit={handleCreateRule} className="space-y-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Rule Name
                </Label>
                <Input id="name" name="name" placeholder="Descriptive name" className="col-span-3" required />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="severity" className="text-right">
                  Severity
                </Label>
                <Select name="severity" defaultValue="medium">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select name="category" defaultValue="transaction">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transaction">Transaction</SelectItem>
                    <SelectItem value="smart-contract">Smart Contract</SelectItem>
                    <SelectItem value="gas">Gas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input 
                  id="description" 
                  name="description" 
                  placeholder="Rule description" 
                  className="col-span-3" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">
                  Trigger conditions
                </Label>
                <div className="col-span-3">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="condition1" name="conditions" value="value" />
                      <Label htmlFor="condition1">Transaction value exceeds threshold</Label>
                    </div>
                    
                    <div className="grid grid-cols-2 pl-6 items-center gap-2">
                      <Label htmlFor="value-threshold">Threshold (ETH)</Label>
                      <Input 
                        id="value-threshold" 
                        name="value_threshold" 
                        type="number"
                        placeholder="100" 
                        min="0"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4">
                      <Checkbox id="condition2" name="conditions" value="contract" />
                      <Label htmlFor="condition2">Contract interaction</Label>
                    </div>
                    
                    <div className="grid grid-cols-2 pl-6 items-center gap-2">
                      <Label htmlFor="contract-address">Contract Address</Label>
                      <Input 
                        id="contract-address" 
                        name="contract_address" 
                        placeholder="0x..." 
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4">
                      <Checkbox id="condition3" name="conditions" value="gas" />
                      <Label htmlFor="condition3">Gas price anomaly</Label>
                    </div>
                    
                    <div className="grid grid-cols-2 pl-6 items-center gap-2">
                      <Label htmlFor="gas-threshold">Threshold (Gwei)</Label>
                      <Input 
                        id="gas-threshold" 
                        name="gas_threshold" 
                        type="number"
                        placeholder="1000" 
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit">Create Rule</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rules..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All severities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-status">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Alert Rules</CardTitle>
          <CardDescription>
            Rules that trigger alerts based on blockchain activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Triggers</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRules.length > 0 ? (
                filteredRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{rule.name}</div>
                        <div className="text-xs text-muted-foreground">{rule.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(rule.category)}
                        <span className="capitalize">{rule.category.replace('-', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getSeverityBadge(rule.severity)}</TableCell>
                    <TableCell>{getStatusBadge(rule.status)}</TableCell>
                    <TableCell className="text-right">{rule.triggers}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVerticalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem>
                            {rule.status === 'active' ? 'Pause' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No rules found matching the filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="flex justify-between items-center">
                <div>Total Triggers (30 days)</div>
                <div className="font-bold">{rules.reduce((acc, rule) => acc + rule.triggers, 0)}</div>
              </div>
              <div className="flex justify-between items-center">
                <div>Most Active Rule</div>
                <div className="font-bold">
                  {rules.sort((a, b) => b.triggers - a.triggers)[0].name}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
      </div>
    </div>
  );
};

export default Rules;
