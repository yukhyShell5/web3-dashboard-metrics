
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontalIcon, SearchIcon, PlusIcon, EyeIcon, PencilIcon, TrashIcon, AlertTriangleIcon, FilterIcon, ArrowDown10Icon, ZapIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Mock data for rules
const mockRules = [
  {
    id: '1',
    name: 'Large Transaction Alert',
    description: 'Alerts when transactions exceed 50 ETH',
    condition: 'transaction.value > 50 ETH',
    severity: 'high',
    enabled: true,
    createdAt: '2023-07-15T10:30:00Z',
    category: 'transaction',
    chain: 'ethereum'
  },
  {
    id: '2',
    name: 'Suspicious Contract Interaction',
    description: 'Alerts when monitored addresses interact with flagged contracts',
    condition: 'contract.address IN blacklistedContracts',
    severity: 'critical',
    enabled: true,
    createdAt: '2023-07-20T11:45:00Z',
    category: 'smart-contract',
    chain: 'all'
  },
  {
    id: '3',
    name: 'Unusual Gas Price',
    description: 'Detects transactions with unusually high gas prices',
    condition: 'transaction.gasPrice > 3 * averageGasPrice',
    severity: 'medium',
    enabled: false,
    createdAt: '2023-07-25T15:20:00Z',
    category: 'gas',
    chain: 'ethereum'
  },
  {
    id: '4',
    name: 'Multiple Failed Transactions',
    description: 'Alerts when an address has multiple failed transactions in a short period',
    condition: 'count(failedTransactions) > 5 within 1 hour',
    severity: 'low',
    enabled: true,
    createdAt: '2023-08-01T09:10:00Z',
    category: 'transaction',
    chain: 'all'
  },
  {
    id: '5',
    name: 'New Address Interaction',
    description: 'Detects when monitored addresses interact with new addresses',
    condition: 'receiver NOT IN knownAddresses',
    severity: 'info',
    enabled: true,
    createdAt: '2023-08-05T14:30:00Z',
    category: 'address',
    chain: 'all'
  },
];

const Rules = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rules, setRules] = useState(mockRules);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedChain, setSelectedChain] = useState('all');

  const handleToggleRule = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || rule.category === selectedCategory;
    const matchesChain = selectedChain === 'all' || rule.chain === selectedChain || rule.chain === 'all';
    
    return matchesSearch && matchesCategory && matchesChain;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-500';
      case 'high': return 'bg-orange-500/20 text-orange-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500';
      case 'low': return 'bg-blue-500/20 text-blue-500';
      case 'info': return 'bg-green-500/20 text-green-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alert Rules</h1>
          <p className="text-muted-foreground">Create and manage detection rules</p>
        </div>
        <Dialog>
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
                Define conditions that will trigger alerts when matched.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rule-name" className="text-right">
                  Rule Name
                </Label>
                <Input id="rule-name" placeholder="Enter rule name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input id="description" placeholder="Rule description" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select defaultValue="transaction">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transaction">Transaction</SelectItem>
                    <SelectItem value="smart-contract">Smart Contract</SelectItem>
                    <SelectItem value="gas">Gas</SelectItem>
                    <SelectItem value="address">Address</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="severity" className="text-right">
                  Severity
                </Label>
                <Select defaultValue="medium">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="chain" className="text-right">
                  Blockchain
                </Label>
                <Select defaultValue="all">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select blockchain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Chains</SelectItem>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="polygon">Polygon</SelectItem>
                    <SelectItem value="arbitrum">Arbitrum</SelectItem>
                    <SelectItem value="optimism">Optimism</SelectItem>
                    <SelectItem value="base">Base</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="condition" className="text-right">
                  Condition
                </Label>
                <div className="col-span-3">
                  <textarea
                    id="condition"
                    placeholder="Enter alert condition"
                    className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Example: transaction.value > 50 ETH</p>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-4 flex items-center justify-end space-x-2">
                  <Checkbox id="enable" defaultChecked />
                  <Label htmlFor="enable">Enable rule immediately</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Rule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-4">
          <TabsList>
            <TabsTrigger value="all">All Rules</TabsTrigger>
            <TabsTrigger value="enabled">Enabled</TabsTrigger>
            <TabsTrigger value="disabled">Disabled</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search rules..." 
                className="pl-8 w-60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <FilterIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="transaction">Transaction</SelectItem>
                <SelectItem value="smart-contract">Smart Contract</SelectItem>
                <SelectItem value="gas">Gas</SelectItem>
                <SelectItem value="address">Address</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedChain} onValueChange={setSelectedChain}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Blockchain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chains</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="arbitrum">Arbitrum</SelectItem>
                <SelectItem value="optimism">Optimism</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredRules.length > 0 ? (
              filteredRules.map((rule) => (
                <Card key={rule.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {rule.name}
                          <Badge className={getSeverityColor(rule.severity)}>
                            {rule.severity}
                          </Badge>
                          {!rule.enabled && (
                            <Badge variant="outline" className="text-muted-foreground">
                              Disabled
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{rule.description}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <EyeIcon className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <PencilIcon className="mr-2 h-4 w-4" />
                            <span>Edit Rule</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ZapIcon className="mr-2 h-4 w-4" />
                            <span>Test Rule</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <TrashIcon className="mr-2 h-4 w-4" />
                            <span>Delete Rule</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="bg-muted/50 p-2 rounded-md text-sm font-mono">
                      <code>{rule.condition}</code>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{rule.category}</Badge>
                      <Badge variant="outline">{rule.chain === 'all' ? 'All Chains' : rule.chain}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between">
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(rule.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`toggle-${rule.id}`} className="text-sm">
                        {rule.enabled ? 'Enabled' : 'Disabled'}
                      </Label>
                      <Switch 
                        id={`toggle-${rule.id}`} 
                        checked={rule.enabled}
                        onCheckedChange={() => handleToggleRule(rule.id)}
                      />
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No rules match your filters
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="enabled">
          <div className="text-center py-10 text-muted-foreground">
            Showing only enabled rules
          </div>
        </TabsContent>
        
        <TabsContent value="disabled">
          <div className="text-center py-10 text-muted-foreground">
            Showing only disabled rules
          </div>
        </TabsContent>
        
        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Large Transaction</CardTitle>
                <CardDescription>Detect unusually large transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge className="bg-orange-500/20 text-orange-500 mb-2">high</Badge>
                <div className="bg-muted/50 p-2 rounded-md text-sm font-mono mb-2">
                  <code>transaction.value > X ETH</code>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Use Template</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Suspicious Contract</CardTitle>
                <CardDescription>Alert on interaction with blacklisted contracts</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge className="bg-red-500/20 text-red-500 mb-2">critical</Badge>
                <div className="bg-muted/50 p-2 rounded-md text-sm font-mono mb-2">
                  <code>contract.address IN blacklist</code>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Use Template</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Gas Price Anomaly</CardTitle>
                <CardDescription>Detect unusually high gas prices</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge className="bg-yellow-500/20 text-yellow-500 mb-2">medium</Badge>
                <div className="bg-muted/50 p-2 rounded-md text-sm font-mono mb-2">
                  <code>transaction.gasPrice > 3 * avg</code>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Use Template</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rules;
