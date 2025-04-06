import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Copy, Edit, Trash } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { useToast } from "@/components/ui/use-toast"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRule as createRuleAPI,
  getRules as getRulesAPI,
  updateRule as updateRuleAPI,
  deleteRule as deleteRuleAPI,
} from "@/services/api-rules";
import { format } from 'date-fns';

interface UIRule {
  id: string;
  name: string;
  description: string;
  status: "disabled" | "active" | "paused"; // Remove "inactive" and "error" status options
  severity: "high" | "low" | "critical" | "medium";
  lastTriggered: string;
  triggers: number;
  type: string;
  condition: string;
  actions: string[];
  createdAt: string;
  updatedAt: string;
}

const Rules = () => {
  const [rules, setRules] = useState<UIRule[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    status: 'disabled',
    severity: 'medium',
    type: '',
    condition: '',
    actions: [] as string[],
  });
  const queryClient = useQueryClient();
  const { toast } = useToast()

  // Fetch rules using react-query
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['rules'],
    queryFn: getRulesAPI,
  });

  useEffect(() => {
    if (data) {
      // Map the API response to the UIRule interface
      const uiRules = data.map(rule => ({
        id: rule.id,
        name: rule.name,
        description: rule.description,
        status: rule.status,
        severity: rule.severity,
        lastTriggered: rule.lastTriggered || 'N/A',
        triggers: rule.triggers,
        type: rule.type,
        condition: rule.condition,
        actions: rule.actions,
        createdAt: rule.createdAt,
        updatedAt: rule.updatedAt,
      }));
      setRules(uiRules);
    }
  }, [data]);

  // Mutation for creating a new rule
  const createRuleMutation = useMutation(createRuleAPI, {
    onSuccess: () => {
      // Invalidate the query to refetch rules
      queryClient.invalidateQueries({ queryKey: ['rules'] });
      setIsCreateModalOpen(false);
      setNewRule({
        name: '',
        description: '',
        status: 'disabled',
        severity: 'medium',
        type: '',
        condition: '',
        actions: [],
      });
      toast({
        title: "Rule created",
        description: "Your new rule has been created successfully"
      })
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      })
    },
  });

  // Mutation for updating a rule
  const updateRuleMutation = useMutation(updateRuleAPI, {
    onSuccess: () => {
      // Invalidate the query to refetch rules
      queryClient.invalidateQueries({ queryKey: ['rules'] });
      toast({
        title: "Rule updated",
        description: "The rule has been updated successfully"
      })
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      })
    },
  });

  // Mutation for deleting a rule
  const deleteRuleMutation = useMutation(deleteRuleAPI, {
    onSuccess: () => {
      // Invalidate the query to refetch rules
      queryClient.invalidateQueries({ queryKey: ['rules'] });
      toast({
        title: "Rule deleted",
        description: "The rule has been deleted successfully"
      })
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      })
    },
  });

  const handleCreateRule = async () => {
    try {
      await createRuleMutation.mutateAsync(newRule);
    } catch (error) {
      console.error("Failed to create rule:", error);
    }
  };

  const handleUpdateRule = async (id: string, updatedFields: Partial<UIRule>) => {
    try {
      // Optimistically update the UI
      setRules(prevRules =>
        prevRules.map(rule =>
          rule.id === id ? { ...rule, ...updatedFields } : rule
        )
      );

      // Make the API call to update the rule
      await updateRuleMutation.mutateAsync({ id, ...updatedFields });
    } catch (error) {
      console.error("Failed to update rule:", error);
      // If the API call fails, revert the UI to the previous state
      refetch()
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to update rule.",
      })
    }
  };

  const handleDeleteRule = async (id: string) => {
    try {
      await deleteRuleMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete rule:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to delete rule.",
      })
    }
  };

  const filteredRules = rules.filter(rule =>
    rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div>Loading rules...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Rules</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>Create Rule</Button>
      </div>

      <Input
        type="text"
        placeholder="Search rules..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <ScrollArea>
        <Table>
          <TableCaption>A list of your rules.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Last Triggered</TableHead>
              <TableHead>Triggers</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="font-medium">{rule.name}</TableCell>
                <TableCell>{rule.description}</TableCell>
                <TableCell>
                  <Badge variant={rule.status === 'active' ? 'success' : 'secondary'}>
                    {rule.status}
                  </Badge>
                </TableCell>
                <TableCell>{rule.severity}</TableCell>
                <TableCell>{rule.lastTriggered}</TableCell>
                <TableCell>{rule.triggers}</TableCell>
                <TableCell>{format(new Date(rule.createdAt), 'MMM d, yyyy')}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(rule.id)}
                      >
                        <Copy className="mr-2 h-4 w-4" /> Copy ID
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => console.log('Edit', rule.id)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDeleteRule(rule.id)}>
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Create Rule Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Rule</h3>
              <div className="mt-2">
                <Input
                  type="text"
                  placeholder="Name"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                />
              </div>
              <div className="mt-2">
                <Input
                  type="text"
                  placeholder="Description"
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                />
              </div>
              <div className="mt-2">
                <Label htmlFor="status">Status</Label>
                <Switch
                  id="status"
                  checked={newRule.status === 'active'}
                  onCheckedChange={(checked) =>
                    setNewRule({ ...newRule, status: checked ? 'active' : 'disabled' })
                  }
                />
              </div>
              <div className="mt-2">
                <Input
                  type="text"
                  placeholder="Severity"
                  value={newRule.severity}
                  onChange={(e) => setNewRule({ ...newRule, severity: e.target.value as "high" | "low" | "critical" | "medium" })}
                />
              </div>
              <div className="mt-2">
                <Input
                  type="text"
                  placeholder="Type"
                  value={newRule.type}
                  onChange={(e) => setNewRule({ ...newRule, type: e.target.value })}
                />
              </div>
              <div className="mt-2">
                <Input
                  type="text"
                  placeholder="Condition"
                  value={newRule.condition}
                  onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                />
              </div>
              <div className="items-center px-4 py-3">
                <Button className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300" onClick={handleCreateRule}>
                  Create
                </Button>
                <Button className="mt-2 px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rules;
