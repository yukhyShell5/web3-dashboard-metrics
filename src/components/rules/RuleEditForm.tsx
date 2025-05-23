import React, { useState, useEffect } from 'react'; // Added useEffect
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DialogFooter,
} from '@/components/ui/dialog';
import { FileText, Code } from 'lucide-react';

interface RuleEditFormProps {
  rule: {
    id: string;
    name: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    category: string;
    status: 'active' | 'paused' | 'disabled';
    code?: string; // This is the initial YAML code, if any
  };
  // Make sure your onSubmit can handle the structure you send,
  // especially if you're adding 'code' from yamlContent explicitly.
  onSubmit: (formData: any) => void; // Adjusted for clarity, ensure this matches your actual prop
}

const RuleEditForm: React.FC<RuleEditFormProps> = ({ rule, onSubmit }) => {
  const [activeTab, setActiveTab] = useState('assisted');

  // Part 1: State Variables
  const [yamlContent, setYamlContent] = useState(rule.code || '');
  const [isYamlLoading, setIsYamlLoading] = useState(false);
  const [yamlError, setYamlError] = useState<string | null>(null);
  const [fetchedYamlRuleId, setFetchedYamlRuleId] = useState<string | null>(null);

  // Part 3: useEffect for Resetting YAML on Rule Change (runs when rule.id or rule.code changes)
  useEffect(() => {
    setYamlContent(rule.code || ''); 
    setFetchedYamlRuleId(null); 
    setYamlError(null); 
  }, [rule.id, rule.code]);

  // Part 2: useEffect for Fetching YAML (runs when activeTab, rule.id, or fetchedYamlRuleId changes)
  useEffect(() => {
    if (activeTab === 'code' && rule.id && rule.id !== fetchedYamlRuleId) {
      setIsYamlLoading(true);
      setYamlError(null);
      fetch(`http://localhost:8000/api/rules/yaml/${rule.id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch YAML: ${response.status} ${response.statusText}`);
          }
          return response.text(); 
        })
        .then(data => {
          setYamlContent(data);
          setFetchedYamlRuleId(rule.id);
        })
        .catch(err => {
          console.error("Error fetching YAML:", err);
          setYamlError(err.message || 'An unknown error occurred while fetching YAML.');
          setYamlContent(rule.code || '# Failed to load YAML content.\n# You can still edit manually.');
        })
        .finally(() => {
          setIsYamlLoading(false);
        });
    }
  }, [activeTab, rule.id, fetchedYamlRuleId]); // removed rule.code from here as it's handled by the above effect

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const dataToSubmit: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      dataToSubmit[key] = value;
    });

    // Ensure the 'code' field is from yamlContent, as it's the source of truth
    // for the YAML editor.
    dataToSubmit['code'] = yamlContent;
    dataToSubmit['id'] = rule.id; // Ensure ID is included

    onSubmit(dataToSubmit); 
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 py-4"> {/* Changed to handleFormSubmit */}
      {/* Part 5: Hidden input for 'code' if needed, though explicit handling in handleFormSubmit is often better. 
          If handleFormSubmit directly uses yamlContent, this might be redundant.
          But if something else reads raw form data, it can be useful.
      */}
      {activeTab !== 'code' && (
        <input type="hidden" name="code" value={yamlContent} />
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assisted" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Édition Assistée
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Code YAML
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assisted" className="space-y-6 mt-6">
          {/* ... (Original content of "Édition Assistée" tab - no changes here) ... */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom de la Règle
            </Label>
            <Input 
              id="name" 
              name="name" 
              defaultValue={rule.name} 
              className="col-span-3" 
              required 
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input 
              id="description" 
              name="description" 
              defaultValue={rule.description} 
              className="col-span-3" 
              placeholder="Décrivez ce que fait cette règle"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="severity" className="text-right">
              Sévérité
            </Label>
            <Select name="severity" defaultValue={rule.severity}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionnez la sévérité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">🔴 Critique</SelectItem>
                <SelectItem value="high">🟠 Élevée</SelectItem>
                <SelectItem value="medium">🟡 Moyenne</SelectItem>
                <SelectItem value="low">🔵 Faible</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Catégorie
            </Label>
            <Select name="category" defaultValue={rule.category}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionnez la catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transaction">💸 Transaction</SelectItem>
                <SelectItem value="smart-contract">📋 Smart Contract</SelectItem>
                <SelectItem value="gas">⛽ Gas</SelectItem>
                <SelectItem value="governance">🏛️ Gouvernance</SelectItem>
                <SelectItem value="other">📦 Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Statut
            </Label>
            <Select name="status" defaultValue={rule.status}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionnez le statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">✅ Actif</SelectItem>
                <SelectItem value="paused">⏸️ En Pause</SelectItem>
                <SelectItem value="disabled">❌ Désactivé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Aide pour la configuration</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li><strong>Critique :</strong> Menaces immédiates nécessitant une action urgente</li>
              <li><strong>Élevée :</strong> Problèmes sérieux à traiter rapidement</li>
              <li><strong>Moyenne :</strong> Situations suspectes nécessitant surveillance</li>
              <li><strong>Faible :</strong> Informations pour référence future</li>
            </ul>
          </div>
        </TabsContent>

        {/* Part 4: Modified Textarea and loading/error states */}
        <TabsContent value="code" className="space-y-6 mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="yaml-code" className="text-sm font-medium">
                Code YAML de la Règle
              </Label>
              <div className="text-xs text-muted-foreground">
                Format YAML requis
              </div>
            </div>

            {isYamlLoading && (
              <div className="flex items-center justify-center min-h-[300px]">
                <p>Loading YAML...</p> {/* Replace with a spinner if you have one */}
              </div>
            )}

            {yamlError && !isYamlLoading && (
              <div className="min-h-[300px] space-y-2">
                <p className="text-red-600">Error: {yamlError}</p>
                <Textarea 
                  id="yaml-code-error" // Different id if main one is problematic
                  name="code" // Still provide name for form submission
                  value={yamlContent} // Show potentially fallback content or last good state
                  onChange={(e) => setYamlContent(e.target.value)}
                  className="min-h-[260px] font-mono text-sm text-red-700 border-red-300"
                  placeholder={`# YAML could not be loaded. You can attempt to edit here.`}
                />
              </div>
            )}

            {!isYamlLoading && !yamlError && (
              <Textarea 
                id="yaml-code"
                name="code" // Name attribute for form submission
                value={yamlContent} 
                onChange={(e) => setYamlContent(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
                placeholder={`# Exemple de règle YAML\nname: ${rule.name}\ndescription: "${rule.description}"`}
              />
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">⚠️ Attention</h4>
            <p className="text-sm text-yellow-800">
              Modifiez le code YAML avec précaution. Une syntaxe incorrecte peut empêcher la règle de fonctionner correctement.
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      <DialogFooter>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          💾 Sauvegarder les Modifications
        </Button>
      </DialogFooter>
    </form>
  );
};

export default RuleEditForm;