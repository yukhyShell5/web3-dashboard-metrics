
import React, { useEffect, useState } from 'react';
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
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

interface Rule {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  status: 'active' | 'paused' | 'disabled';
  created: string;
  triggers: number;
}

interface RuleCreateFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  initialValues?: Rule;
}

const RuleCreateForm: React.FC<RuleCreateFormProps> = ({ onSubmit, initialValues }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<string>('medium');
  const [category, setCategory] = useState<string>('transaction');
  const [valueCondition, setValueCondition] = useState(false);
  const [contractCondition, setContractCondition] = useState(false);
  const [gasCondition, setGasCondition] = useState(false);
  const [valueThreshold, setValueThreshold] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [gasThreshold, setGasThreshold] = useState('');
  
  // Set initial values when editing an existing rule
  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name);
      setDescription(initialValues.description);
      setSeverity(initialValues.severity);
      setCategory(initialValues.category);
      
      // For demo purposes, we'll assume these values are extracted from the description
      // In a real app, you would have these as separate fields in your rule object
      setValueCondition(initialValues.description.includes('over'));
      setContractCondition(initialValues.description.includes('contract'));
      setGasCondition(initialValues.description.includes('gas'));
      
      if (valueCondition) setValueThreshold('100');
      if (contractCondition) setContractAddress('0x123...');
      if (gasCondition) setGasThreshold('1000');
    }
  }, [initialValues]);

  return (
    <form onSubmit={onSubmit} className="space-y-6 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Rule Name
        </Label>
        <Input 
          id="name" 
          name="name" 
          placeholder="Descriptive name" 
          className="col-span-3" 
          required 
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="severity" className="text-right">
          Severity
        </Label>
        <Select name="severity" value={severity} onValueChange={setSeverity}>
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
        <Select name="category" value={category} onValueChange={setCategory}>
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
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="text-right pt-2">
          Trigger conditions
        </Label>
        <div className="col-span-3">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="condition1" 
                name="conditions" 
                value="value" 
                checked={valueCondition}
                onCheckedChange={(checked) => setValueCondition(checked as boolean)}
              />
              <Label htmlFor="condition1">Transaction value exceeds threshold</Label>
            </div>
            
            {valueCondition && (
              <div className="grid grid-cols-2 pl-6 items-center gap-2">
                <Label htmlFor="value-threshold">Threshold (ETH)</Label>
                <Input 
                  id="value-threshold" 
                  name="value_threshold" 
                  type="number"
                  placeholder="100" 
                  min="0"
                  value={valueThreshold}
                  onChange={e => setValueThreshold(e.target.value)}
                />
              </div>
            )}
            
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox 
                id="condition2" 
                name="conditions" 
                value="contract"
                checked={contractCondition}
                onCheckedChange={(checked) => setContractCondition(checked as boolean)}
              />
              <Label htmlFor="condition2">Contract interaction</Label>
            </div>
            
            {contractCondition && (
              <div className="grid grid-cols-2 pl-6 items-center gap-2">
                <Label htmlFor="contract-address">Contract Address</Label>
                <Input 
                  id="contract-address" 
                  name="contract_address" 
                  placeholder="0x..." 
                  value={contractAddress}
                  onChange={e => setContractAddress(e.target.value)}
                />
              </div>
            )}
            
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox 
                id="condition3" 
                name="conditions" 
                value="gas"
                checked={gasCondition}
                onCheckedChange={(checked) => setGasCondition(checked as boolean)}
              />
              <Label htmlFor="condition3">Gas price anomaly</Label>
            </div>
            
            {gasCondition && (
              <div className="grid grid-cols-2 pl-6 items-center gap-2">
                <Label htmlFor="gas-threshold">Threshold (Gwei)</Label>
                <Input 
                  id="gas-threshold" 
                  name="gas_threshold" 
                  type="number"
                  placeholder="1000" 
                  min="0"
                  value={gasThreshold}
                  onChange={e => setGasThreshold(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button type="submit">
          {initialValues ? 'Mettre à jour' : 'Créer'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default RuleCreateForm;
