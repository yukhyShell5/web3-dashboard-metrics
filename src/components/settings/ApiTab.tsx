
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { PlusIcon, GlobeIcon, ShieldAlertIcon  } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ApiTab = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>API Keys & Access</CardTitle>
          <CardDescription>
            Manage access keys for the Web3 SOC API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">Primary API Key</div>
                <Badge variant="outline" className="bg-green-500/10 text-green-500">Active</Badge>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <Input 
                  type="password" 
                  value="••••••••••••••••••••••••••••••" 
                  readOnly 
                  className="font-mono"
                />
                <Button variant="outline" size="sm" onClick={() => {
                  toast({
                    title: "API Key Copied",
                    description: "The API key has been copied to your clipboard.",
                  });
                }}>
                  Copy
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Created: August 1, 2023 • Last used: Today
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button variant="outline">
                <PlusIcon className="h-4 w-4 mr-2" />
                Generate New Key
              </Button>
              <Button variant="outline">
                View API Documentation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>External Integrations</CardTitle>
          <CardDescription>
            Connect to external services and data providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-500/10 rounded-full">
                  <GlobeIcon className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <div className="font-medium">Etherscan API</div>
                  <div className="text-sm text-muted-foreground">Connect to Etherscan for transaction data</div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-500/10 rounded-full">
                  <GlobeIcon className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <div className="font-medium">Chainalysis</div>
                  <div className="text-sm text-muted-foreground">Risk scoring and address flagging</div>
                </div>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-500/10 rounded-full">
                  <GlobeIcon className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <div className="font-medium">Infura</div>
                  <div className="text-sm text-muted-foreground">Node services for blockchain access</div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-500/10 rounded-full">
                  <ShieldAlertIcon  className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <div className="font-medium">Forta</div>
                  <div className="text-sm text-muted-foreground">Real-time threat detection for blockchain</div>
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiTab;
