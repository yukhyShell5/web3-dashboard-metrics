
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogDescription,
  DialogPortal,
  DialogOverlay,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { PlusIcon } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Import our components
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Reset processing state when dialogs close
  useEffect(() => {
    if (!dialogOpen && !editDialogOpen && !deleteDialogOpen) {
      setTimeout(() => {
        setIsProcessing(false);
      }, 100);
    }
  }, [dialogOpen, editDialogOpen, deleteDialogOpen]);
  
  // Mock rules data with properly typed severity values
  const [rules, setRules] = useState<Rule[]>([
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
  ]);

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
    if (isProcessing) return;
    setIsProcessing(true);
    
    const formData = new FormData(e.currentTarget);
    
    // Check if a rule with the same name already exists
    const ruleName = formData.get('name') as string;
    const ruleExists = rules.some(rule => rule.name.toLowerCase() === ruleName.toLowerCase());
    
    if (ruleExists) {
      toast({
        title: "Règle déjà existante",
        description: "Une règle avec ce nom existe déjà. Veuillez choisir un nom différent.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }
    
    // Create a new rule
    const newRule: Rule = {
      id: (rules.length + 1).toString(),
      name: ruleName,
      description: formData.get('description') as string || '',
      severity: formData.get('severity') as 'critical' | 'high' | 'medium' | 'low',
      category: formData.get('category') as string,
      status: 'active',
      created: new Date().toISOString(),
      triggers: 0,
    };
    
    setRules([...rules, newRule]);
    
    // Close dialog with a slight delay
    setTimeout(() => {
      setDialogOpen(false);
      
      toast({
        title: "Règle créée",
        description: `La règle "${newRule.name}" a été créée avec succès.`,
      });
    }, 100);
  };

  const handleEditRule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);
    
    if (!selectedRule) {
      setIsProcessing(false);
      return;
    }
    
    const formData = new FormData(e.currentTarget);
    const ruleName = formData.get('name') as string;
    
    // Check if another rule (not the one being edited) has the same name
    const ruleExists = rules.some(rule => 
      rule.id !== selectedRule.id && 
      rule.name.toLowerCase() === ruleName.toLowerCase()
    );
    
    if (ruleExists) {
      toast({
        title: "Règle déjà existante",
        description: "Une règle avec ce nom existe déjà. Veuillez choisir un nom différent.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }
    
    // Update the rule
    const updatedRules = rules.map(rule => {
      if (rule.id === selectedRule.id) {
        return {
          ...rule,
          name: ruleName,
          description: formData.get('description') as string || '',
          severity: formData.get('severity') as 'critical' | 'high' | 'medium' | 'low',
          category: formData.get('category') as string,
        };
      }
      return rule;
    });
    
    setRules(updatedRules);
    
    // Close dialog with a slight delay
    setTimeout(() => {
      setEditDialogOpen(false);
      
      toast({
        title: "Règle modifiée",
        description: `La règle "${ruleName}" a été modifiée avec succès.`,
      });
      
      // Reset selected rule after a delay
      setTimeout(() => {
        setSelectedRule(null);
      }, 100);
    }, 100);
  };

  const handleDuplicateRule = (rule: Rule) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    const newRule: Rule = {
      ...rule,
      id: (rules.length + 1).toString(),
      name: `${rule.name} (copie)`,
      created: new Date().toISOString(),
      triggers: 0,
    };
    
    setRules([...rules, newRule]);
    
    toast({
      title: "Règle dupliquée",
      description: `La règle "${rule.name}" a été dupliquée avec succès.`,
    });
    
    setTimeout(() => {
      setIsProcessing(false);
    }, 100);
  };

  const handleToggleRuleStatus = (rule: Rule) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    const updatedRules = rules.map(r => {
      if (r.id === rule.id) {
        const newStatus = r.status === 'active' ? 'paused' : 'active';
        return { ...r, status: newStatus as 'active' | 'paused' | 'disabled' };
      }
      return r;
    });
    
    setRules(updatedRules);
    
    const statusAction = rule.status === 'active' ? 'mise en pause' : 'activée';
    toast({
      title: `Règle ${statusAction}`,
      description: `La règle "${rule.name}" a été ${statusAction} avec succès.`,
    });
    
    setTimeout(() => {
      setIsProcessing(false);
    }, 100);
  };

  const handleDeleteRule = () => {
    if (isProcessing || !selectedRule) return;
    setIsProcessing(true);
    
    const updatedRules = rules.filter(rule => rule.id !== selectedRule.id);
    setRules(updatedRules);
    
    const ruleName = selectedRule.name;
    
    // Close dialog with a slight delay
    setTimeout(() => {
      setDeleteDialogOpen(false);
      
      toast({
        title: "Règle supprimée",
        description: `La règle "${ruleName}" a été supprimée avec succès.`,
      });
      
      // Reset selected rule after a delay
      setTimeout(() => {
        setSelectedRule(null);
      }, 100);
    }, 100);
  };

  const openEditDialog = (rule: Rule) => {
    if (isProcessing) return;
    setSelectedRule(rule);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (rule: Rule) => {
    if (isProcessing) return;
    setSelectedRule(rule);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alert Rules</h1>
          <p className="text-muted-foreground">Configure detection rules for blockchain activity</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          if (isProcessing && !open) return;
          setDialogOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" disabled={isProcessing}>
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
          <RuleList 
            rules={filteredRules} 
            onEdit={openEditDialog}
            onToggleStatus={handleToggleRuleStatus}
            onDuplicate={handleDuplicateRule}
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RuleStatistics rules={rules} />
        <RecentRuleActivity />
      </div>

      {/* Edit Rule Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(open) => {
        if (isProcessing && !open) return;
        setEditDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Alert Rule</DialogTitle>
            <DialogDescription>
              Make changes to your alert rule
            </DialogDescription>
          </DialogHeader>
          {selectedRule && (
            <RuleCreateForm 
              onSubmit={handleEditRule} 
              initialValues={selectedRule}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => {
        if (isProcessing && !open) return;
        setDeleteDialogOpen(open);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cette règle d'alerte sera définitivement supprimée de votre compte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteRule} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isProcessing}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Rules;
