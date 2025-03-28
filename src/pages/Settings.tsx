
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
import { PlusIcon, TrashIcon, CheckIcon, BellIcon, WrenchIcon, KeyIcon, ShieldIcon, GlobeIcon, SaveIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Mock data for monitored addresses
const mockAddresses = [
  { id: '1', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', label: 'Primary Wallet', chain: 'ethereum', monitored: true },
  { id: '2', address: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30', label: 'DeFi Operations', chain: 'polygon', monitored: true },
  { id: '3', address: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E', label: 'Treasury', chain: 'ethereum', monitored: true },
  { id: '4', address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', label: 'Cold Storage', chain: 'all', monitored: false },
  { id: '5', address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', label: 'Trading Bot', chain: 'arbitrum', monitored: true },
];

// Mock data for webhooks
const mockWebhooks = [
  { id: '1', name: 'Slack Alerts', url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX', type: 'slack', active: true },
  { id: '2', name: 'Discord Notifications', url: 'https://discord.com/api/webhooks/0000000000000000/XXXXXXXXXXXXXXXXXXXX', type: 'discord', active: true },
  { id: '3', name: 'Email Alerts', url: 'mailto:alerts@example.com', type: 'email', active: false },
];

const Settings = () => {
  const [addresses, setAddresses] = useState(mockAddresses);
  const [webhooks, setWebhooks] = useState(mockWebhooks);
  const [newAddress, setNewAddress] = useState({ address: '', label: '', chain: 'ethereum' });
  const [newWebhook, setNewWebhook] = useState({ name: '', url: '', type: 'slack' });

  const handleAddAddress = () => {
    if (!newAddress.address || !newAddress.label) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setAddresses([
      ...addresses,
      {
        id: Date.now().toString(),
        address: newAddress.address,
        label: newAddress.label,
        chain: newAddress.chain,
        monitored: true,
      },
    ]);

    setNewAddress({ address: '', label: '', chain: 'ethereum' });

    toast({
      title: "Address Added",
      description: "The blockchain address has been added to monitoring.",
    });
  };

  const handleRemoveAddress = (id: string) => {
    setAddresses(addresses.filter((address) => address.id !== id));
    toast({
      title: "Address Removed",
      description: "The blockchain address has been removed from monitoring.",
    });
  };

  const handleToggleAddressMonitoring = (id: string) => {
    setAddresses(
      addresses.map((address) =>
        address.id === id ? { ...address, monitored: !address.monitored } : address
      )
    );
  };

  const handleAddWebhook = () => {
    if (!newWebhook.name || !newWebhook.url) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setWebhooks([
      ...webhooks,
      {
        id: Date.now().toString(),
        name: newWebhook.name,
        url: newWebhook.url,
        type: newWebhook.type,
        active: true,
      },
    ]);

    setNewWebhook({ name: '', url: '', type: 'slack' });

    toast({
      title: "Webhook Added",
      description: "The webhook has been added for alert notifications.",
    });
  };

  const handleRemoveWebhook = (id: string) => {
    setWebhooks(webhooks.filter((webhook) => webhook.id !== id));
    toast({
      title: "Webhook Removed",
      description: "The webhook has been removed from notifications.",
    });
  };

  const handleToggleWebhookActive = (id: string) => {
    setWebhooks(
      webhooks.map((webhook) =>
        webhook.id === id ? { ...webhook, active: !webhook.active } : webhook
      )
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure your Web3 SOC monitoring</p>
        </div>
        <Button className="flex items-center gap-2" variant="outline" onClick={() => {
          toast({
            title: "Settings Saved",
            description: "Your configuration has been updated successfully.",
          });
        }}>
          <SaveIcon className="h-4 w-4" />
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="addresses" className="w-full">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="addresses" className="flex gap-2 items-center">
            <ShieldIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Monitored Addresses</span>
            <span className="inline sm:hidden">Addresses</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-2 items-center">
            <BellIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
            <span className="inline sm:hidden">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex gap-2 items-center">
            <KeyIcon className="h-4 w-4" />
            <span className="hidden sm:inline">API & Integrations</span>
            <span className="inline sm:hidden">API</span>
          </TabsTrigger>
          <TabsTrigger value="general" className="flex gap-2 items-center">
            <WrenchIcon className="h-4 w-4" />
            <span className="hidden sm:inline">General Settings</span>
            <span className="inline sm:hidden">General</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="addresses" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitored Blockchain Addresses</CardTitle>
              <CardDescription>
                Add, edit, and manage addresses for security monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add New Address
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Blockchain Address</DialogTitle>
                    <DialogDescription>
                      Add a new address to monitor for security events
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="address" className="text-right">
                        Address
                      </Label>
                      <Input
                        id="address"
                        placeholder="0x..."
                        className="col-span-3"
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="label" className="text-right">
                        Label
                      </Label>
                      <Input
                        id="label"
                        placeholder="My Wallet"
                        className="col-span-3"
                        value={newAddress.label}
                        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="chain" className="text-right">
                        Blockchain
                      </Label>
                      <Select 
                        value={newAddress.chain}
                        onValueChange={(value) => setNewAddress({ ...newAddress, chain: value })}
                      >
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
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddAddress}>Add Address</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="space-y-4 mt-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-card"
                  >
                    <div className="space-y-1 mb-2 sm:mb-0">
                      <div className="font-medium flex flex-wrap gap-2 items-center">
                        {address.label}
                        <Badge
                          variant="outline"
                          className={address.monitored ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}
                        >
                          {address.monitored ? "Monitoring" : "Paused"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground font-mono">{address.address}</div>
                      <div className="text-xs">
                        <Badge variant="outline" className="mr-1">
                          {address.chain === 'all' ? 'All Chains' : address.chain}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`address-toggle-${address.id}`}
                          checked={address.monitored}
                          onCheckedChange={() => handleToggleAddressMonitoring(address.id)}
                        />
                        <Label htmlFor={`address-toggle-${address.id}`} className="text-sm">
                          {address.monitored ? "On" : "Off"}
                        </Label>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAddress(address.id)}
                      >
                        <TrashIcon className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Webhooks & Notifications</CardTitle>
              <CardDescription>
                Configure integration endpoints to receive security alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add New Webhook
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Notification Webhook</DialogTitle>
                    <DialogDescription>
                      Add a webhook to receive alert notifications
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="webhook-name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="webhook-name"
                        placeholder="Slack Alerts"
                        className="col-span-3"
                        value={newWebhook.name}
                        onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="webhook-url" className="text-right">
                        URL
                      </Label>
                      <Input
                        id="webhook-url"
                        placeholder="https://..."
                        className="col-span-3"
                        value={newWebhook.url}
                        onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="webhook-type" className="text-right">
                        Type
                      </Label>
                      <Select 
                        value={newWebhook.type}
                        onValueChange={(value) => setNewWebhook({ ...newWebhook, type: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select webhook type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slack">Slack</SelectItem>
                          <SelectItem value="discord">Discord</SelectItem>
                          <SelectItem value="telegram">Telegram</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="custom">Custom HTTP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddWebhook}>Add Webhook</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="space-y-4 mt-4">
                {webhooks.map((webhook) => (
                  <div
                    key={webhook.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-card"
                  >
                    <div className="space-y-1 mb-2 sm:mb-0">
                      <div className="font-medium flex flex-wrap gap-2 items-center">
                        {webhook.name}
                        <Badge
                          variant="outline"
                          className={webhook.active ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}
                        >
                          {webhook.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground truncate max-w-md">{webhook.url}</div>
                      <div className="text-xs">
                        <Badge variant="outline" className="capitalize">
                          {webhook.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`webhook-toggle-${webhook.id}`}
                          checked={webhook.active}
                          onCheckedChange={() => handleToggleWebhookActive(webhook.id)}
                        />
                        <Label htmlFor={`webhook-toggle-${webhook.id}`} className="text-sm">
                          {webhook.active ? "On" : "Off"}
                        </Label>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => {
                        toast({
                          title: "Test Sent",
                          description: "A test notification has been sent to the webhook.",
                        });
                      }}>
                        Test
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveWebhook(webhook.id)}
                      >
                        <TrashIcon className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Rules & Notifications</CardTitle>
              <CardDescription>
                Configure which types of alerts trigger notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-500/20 text-red-500">critical</Badge>
                    <span>Critical Alerts</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-500/20 text-orange-500">high</Badge>
                    <span>High Severity Alerts</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-500/20 text-yellow-500">medium</Badge>
                    <span>Medium Severity Alerts</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500/20 text-blue-500">low</Badge>
                    <span>Low Severity Alerts</span>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-500">info</Badge>
                    <span>Informational Alerts</span>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4 mt-4">
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general system settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="timezone" className="text-right">
                    Timezone
                  </Label>
                  <Select defaultValue="utc">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time (ET)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                      <SelectItem value="cet">Central European Time (CET)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date-format" className="text-right">
                    Date Format
                  </Label>
                  <Select defaultValue="iso">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iso">ISO (YYYY-MM-DD)</SelectItem>
                      <SelectItem value="us">US (MM/DD/YYYY)</SelectItem>
                      <SelectItem value="eu">EU (DD/MM/YYYY)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Always use dark theme</p>
                  </div>
                  <Switch id="dark-mode" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-refresh" className="text-base">Auto-refresh Data</Label>
                    <p className="text-sm text-muted-foreground">Automatically refresh dashboard data</p>
                  </div>
                  <Switch id="auto-refresh" defaultChecked />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="refresh-interval" className="text-right">
                    Refresh Interval
                  </Label>
                  <Select defaultValue="30">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">1 minute</SelectItem>
                      <SelectItem value="300">5 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => {
                toast({
                  title: "Settings Saved",
                  description: "Your general settings have been updated.",
                });
              }}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
              <CardDescription>
                Configure how long data is stored in the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="alert-retention" className="text-right">
                  Alert History
                </Label>
                <Select defaultValue="90">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select retention period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tx-retention" className="text-right">
                  Transaction Data
                </Label>
                <Select defaultValue="30">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select retention period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="logs-retention" className="text-right">
                  System Logs
                </Label>
                <Select defaultValue="14">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select retention period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
