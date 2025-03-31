import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, TrashIcon, InfoIcon, AlertTriangleIcon, ShieldIcon, ShieldAlertIcon, AlertCircleIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

type RuleSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

interface Rule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: RuleSeverity;
  type: string;
  conditions: Condition[];
}

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

const sampleRules: Rule[] = [
  {
    id: '1',
    name: 'Large ETH Transfer',
    description: 'Detect large ETH transfers (over 100 ETH)',
    enabled: true,
    severity: 'high',
    type: 'transaction',
    conditions: [
      { id: 'c1', field: 'value', operator: '&gt;', value: '100' },
      { id: 'c2', field: 'currency', operator: '==', value: 'ETH' }
    ]
  },
  {
    id: '2',
    name: 'Contract Creation',
    description: 'Alert when new contracts are deployed',
    enabled: true,
    severity: 'medium',
    type: 'transaction',
    conditions: [
      { id: 'c3', field: 'to', operator: '==', value: '0x0' },
      { id: 'c4', field: 'input', operator: '!=', value: '' }
    ]
  },
  {
    id: '3',
    name: 'Multiple Failed Transactions',
    description: 'Detect when an address has multiple failed transactions in a short time',
    enabled: false,
    severity: 'low',
    type: 'behavioral',
    conditions: [
      { id: 'c5', field: 'status', operator: '==', value: 'failed' },
      { id: 'c6', field: 'count', operator: '&gt;', value: '3' },
      { id: 'c7', field: 'timeframe', operator: '&lt;', value: '10m' }
    ]
  },
  {
    id: '4',
    name: 'Interaction with Sanctioned Address',
    description: 'Alert when transactions involve addresses on sanctions list',
    enabled: true,
    severity: 'critical',
    type: 'compliance',
    conditions: [
      { id: 'c8', field: 'to|from', operator: 'in', value: 'SANCTIONS_LIST' }
    ]
  },
  {
    id: '5',
    name: 'New NFT Mint',
    description: 'Information alert when NFTs are minted',
    enabled: true,
    severity: 'info',
    type: 'nft',
    conditions: [
      { id: 'c9', field: 'event', operator: '==', value: 'NFTMint' }
    ]
  }
];

const severityConfig = {
  critical: {
    icon: AlertCircleIcon,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
  },
  high: {
    icon: ShieldAlertIcon,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
  },
  medium: {
    icon: AlertTriangleIcon,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
  },
  low: {
    icon: ShieldIcon,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
  info: {
    icon: InfoIcon,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
  },
};

const fieldOptions = [
  { value: 'value', label: 'Value (ETH/Token Amount)' },
  { value: 'to', label: 'Recipient Address' },
  { value: 'from', label: 'Sender Address' },
  { value: 'gas', label: 'Gas Used' },
  { value: 'gasPrice', label: 'Gas Price' },
  { value: 'input', label: 'Input Data' },
  { value: 'blockNumber', label: 'Block Number' },
  { value: 'timestamp', label: 'Timestamp' },
  { value: 'status', label: 'Transaction Status' },
  { value: 'currency', label: 'Currency Type' },
  { value: 'count', label: 'Count' },
  { value: 'timeframe', label: 'Timeframe' },
  { value: 'event', label: 'Event Type' },
];

const operatorOptions = [
  { value: '==', label: 'Equals (==)' },
  { value: '!=', label: 'Not Equals (!=)' },
  { value: '>', label: 'Greater Than (>)' },
  { value: '<', label: 'Less Than (<)' },
  { value: '>=', label: 'Greater Than or Equal To (>=)' },
  { value: '<=', label: 'Less Than or Equal To (<=)' },
  { value: 'in', label: 'In (List)' },
  { value: 'contains', label: 'Contains' },
  { value: 'startsWith', label: 'Starts With' },
  { value: 'endsWith', label: 'Ends With' },
];

const Rules = () => {
  const [rules, setRules] = useState<Rule[]>(sampleRules);
  const [activeTab, setActiveTab] = useState('all');
  const [newRule, setNewRule] = useState<Rule>({
    id: '',
    name: '',
    description: '',
    enabled: true,
    severity: 'medium',
    type: 'transaction',
    conditions: [{ id: crypto.randomUUID(), field: '', operator: '', value: '' }]
  });

  const filteredRules = activeTab === 'all' 
    ? rules 
    : rules.filter(rule => rule.type === activeTab);

  const handleAddCondition = () => {
    setNewRule({
      ...newRule,
      conditions: [...newRule.conditions, { id: crypto.randomUUID(), field: '', operator: '', value: '' }]
    });
  };

  const handleRemoveCondition = (id: string) => {
    setNewRule({
      ...newRule,
      conditions: newRule.conditions.filter(condition => condition.id !== id)
    });
  };

  const handleConditionChange = (id: string, field: keyof Condition, value: string) => {
    setNewRule({
      ...newRule,
      conditions: newRule.conditions.map(condition => 
        condition.id === id ? { ...condition, [field]: value } : condition
      )
    });
  };

  const handleCreateRule = () => {
    const createdRule = {
      ...newRule,
      id: crypto.randomUUID()
    };
    setRules([...rules, createdRule]);
    // Reset form
    setNewRule({
      id: '',
      name: '',
      description: '',
      enabled: true,
      severity: 'medium',
      type: 'transaction',
      conditions: [{ id: crypto.randomUUID(), field: '', operator: '', value: '' }]
    });
  };

  const handleToggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Alert Rules</h1>
        <p className="text-muted-foreground">
          Create and manage rules to detect suspicious blockchain activities
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Rules</TabsTrigger>
          <TabsTrigger value="transaction">Transaction</TabsTrigger>
          <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="nft">NFT</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Alert Rules</h2>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create Rule
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Status</TableHead>
                    <TableHead className="w-[180px]">Rule</TableHead>
                    <TableHead className="w-[350px]">Description</TableHead>
                    <TableHead className="w-[100px]">Severity</TableHead>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRules.map((rule) => {
                    const SeverityIcon = severityConfig[rule.severity].icon;
                    return (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={() => handleToggleRule(rule.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{rule.name}</TableCell>
                        <TableCell>{rule.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded ${severityConfig[rule.severity].bgColor}`}>
                              <SeverityIcon className={`h-4 w-4 ${severityConfig[rule.severity].color}`} />
                            </div>
                            <span className={severityConfig[rule.severity].color}>
                              {rule.severity.charAt(0).toUpperCase() + rule.severity.slice(1)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {rule.type.charAt(0).toUpperCase() + rule.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRule(rule.id)}
                          >
                            <TrashIcon className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transaction" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-6">Create Transaction Rule</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Rule Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Large ETH Transfer"
                      value={newRule.name}
                      onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Rule Type</Label>
                    <Select
                      value={newRule.type}
                      onValueChange={(value) => setNewRule({ ...newRule, type: value })}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select rule type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="transaction">Transaction</SelectItem>
                          <SelectItem value="behavioral">Behavioral</SelectItem>
                          <SelectItem value="compliance">Compliance</SelectItem>
                          <SelectItem value="nft">NFT</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Describe what this rule detects"
                    value={newRule.description}
                    onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="severity">Severity</Label>
                  <Select
                    value={newRule.severity}
                    onValueChange={(value: RuleSeverity) => setNewRule({ ...newRule, severity: value })}
                  >
                    <SelectTrigger id="severity">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Conditions</h3>
                  <div className="space-y-4">
                    {newRule.conditions.map((condition, index) => (
                      <div key={condition.id} className="grid grid-cols-[1fr,1fr,1fr,auto] gap-4 items-end">
                        <div className="space-y-2">
                          <Label>Field</Label>
                          <Select
                            value={condition.field}
                            onValueChange={(value) => handleConditionChange(condition.id, 'field', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {fieldOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Operator</Label>
                          <Select
                            value={condition.operator}
                            onValueChange={(value) => handleConditionChange(condition.id, 'operator', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select operator" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {operatorOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Value</Label>
                          <Input 
                            placeholder="Enter value"
                            value={condition.value}
                            onChange={(e) => handleConditionChange(condition.id, 'value', e.target.value)}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveCondition(condition.id)}
                          disabled={newRule.conditions.length === 1}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline"
                    className="mt-4"
                    onClick={handleAddCondition}
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Condition
                  </Button>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleCreateRule}>Create Rule</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tab contents would be similar to the transaction tab */}
        <TabsContent value="behavioral" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold">Behavioral Rules</h2>
              <p className="text-muted-foreground mb-4">
                Create rules based on behavior patterns over time
              </p>
              {/* Form would be similar to transaction tab */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold">Compliance Rules</h2>
              <p className="text-muted-foreground mb-4">
                Create rules related to regulatory compliance
              </p>
              {/* Form would be similar to transaction tab */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nft" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold">NFT Rules</h2>
              <p className="text-muted-foreground mb-4">
                Create rules specific to NFT transactions and events
              </p>
              {/* Form would be similar to transaction tab */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rules;
