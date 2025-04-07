
import React from 'react';
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

interface RuleCreateFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const RuleCreateForm: React.FC<RuleCreateFormProps> = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6 py-4">
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
            <SelectItem value="governance">Governance</SelectItem>
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
  );
};

export default RuleCreateForm;
