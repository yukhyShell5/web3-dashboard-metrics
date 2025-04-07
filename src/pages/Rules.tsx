import React, { useState, useEffect } from 'react';
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
import { PlusIcon, RefreshCwIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { rulesApi } from '@/services/apiService';

// Import our components
import RuleList from '@/components/rules/RuleList';
import RuleCreateForm from '@/components/rules/RuleCreateForm';
import RuleStatistics from '@/components/rules/RuleStatistics';
import RecentRuleActivity from '@/components/rules/RecentRuleActivity';
import RuleFilters from '@/components/rules/RuleFilters';

// Define the accepted severity types
type RuleSeverity = 'critical' | 'high' | 'medium' | 'low';

// Extended UI Rule type that includes all required properties
type UIRule = {
  id: string;
  name: string;
  description: string;
  severity: RuleSeverity;
  category: string;
  status: 'active' | 'paused' | 'disabled';
  triggers: number;
  created: string;
};

const Rules = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all-status');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rules, setRules] = useState<UIRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Convert API Rule to UI Rule with all required fields
  const convertToUIRule = (apiRule: any): UIRule => {
    // Validate the severity value to ensure it's one of the allowed values
    let severity: RuleSeverity = 'medium'; // Default value
    if (['critical', 'high', 'medium', 'low'].includes(apiRule.severity)) {
      severity = apiRule.severity as RuleSeverity;
    }
    
    // Conversion du statut de l'API au format de l'UI
    // Dans l'API: 'active', 'inactive', 'error'
    // Dans l'UI: 'active', 'paused', 'disabled'
    let uiStatus: 'active' | 'paused' | 'disabled' = 'disabled';
    if (apiRule.status === 'active') {
      uiStatus = 'active';
    } else if (apiRule.status === 'error') {
      uiStatus = 'paused';
    } else {
      uiStatus = 'disabled';
    }
    
    return {
      id: apiRule.name || 'unknown-id', // Use name as id if no id is provided
      name: apiRule.name || 'Unnamed Rule',
      description: apiRule.description || 'No description available',
      severity: severity,
      category: apiRule.category || 'other',
      status: uiStatus,
      triggers: apiRule.triggers || 0, // Default to 0 if not provided
      created: apiRule.created || new Date().toISOString(), // Default to now if not provided
    };
  };

  // Load rules from API
  const loadRules = async () => {
    try {
      setIsLoading(true);
      const response = await rulesApi.getRules();
      console.log("Rules from API:", response.rules);
      const uiRules = response.rules?.map(convertToUIRule) || [];
      console.log("UI Rules after conversion:", uiRules);
      setRules(uiRules);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les règles",
        variant: "destructive",
      });
      console.error("Error loading rules:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh rules
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await loadRules();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadRules();
  }, []);

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

  const handleCreateRule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const ruleData = Object.fromEntries(formData);
    
    try {
      await rulesApi.createRule({
        name: ruleData.name as string,
        description: ruleData.description as string,
        severity: ruleData.severity as string,
        category: ruleData.category as string,
        code: ruleData.code as string
      });
      
      toast({
        title: "Succès",
        description: "La règle a été créée avec succès",
        variant: "default",
      });
      
      setDialogOpen(false);
      await loadRules();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de la création de la règle",
        variant: "destructive",
      });
      console.error("Error creating rule:", error);
    }
  };

  // Toggle rule status (active/inactive)
  const handleToggleRule = async (ruleName: string, active: boolean) => {
    try {
      setIsLoading(true);
      
      console.log(`Basculement de la règle ${ruleName} vers ${active ? 'active' : 'inactive'}`);
      
      await rulesApi.toggleRule(ruleName, active);
      
      toast({
        title: active ? "Règle activée" : "Règle désactivée",
        description: `La règle "${ruleName}" a été ${active ? 'activée' : 'désactivée'} avec succès.`,
        variant: "default",
      });
      
      // Recharger les règles pour obtenir l'état mis à jour du backend
      await loadRules();
    } catch (error) {
      toast({
        title: "Erreur",
        description: `Échec de ${active ? 'l\'activation' : 'la désactivation'} de la règle "${ruleName}".`,
        variant: "destructive",
      });
      console.error("Error toggling rule:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Règles d'Alerte</h1>
          <p className="text-muted-foreground">Configurez les règles de détection pour l'activité blockchain</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCwIcon className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                Créer une Règle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Créer une Nouvelle Règle d'Alerte</DialogTitle>
                <DialogDescription>
                  Configurez quand et comment les alertes sont déclenchées pour les adresses surveillées
                </DialogDescription>
              </DialogHeader>
              <RuleCreateForm onSubmit={handleCreateRule} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <RuleFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        severityFilter={severityFilter}
        setSeverityFilter={setSeverityFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Règles d'Alerte</CardTitle>
              <CardDescription>
                Règles qui déclenchent des alertes basées sur l'activité blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RuleList 
                rules={filteredRules} 
                onToggleRule={handleToggleRule} 
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RuleStatistics rules={filteredRules} />
            <RecentRuleActivity />
          </div>
        </>
      )}
    </div>
  );
};

export default Rules;
