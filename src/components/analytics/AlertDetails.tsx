
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertItemProps } from './RecentAlerts';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription } from "@/components/ui/card";

interface AlertDetailsProps {
  alert: AlertItemProps | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AlertDetails({ alert, isOpen, onClose }: AlertDetailsProps) {
  if (!alert) return null;

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: 'bg-red-500/20 text-red-500',
      high: 'bg-orange-500/20 text-orange-500',
      medium: 'bg-yellow-500/20 text-yellow-500',
      low: 'bg-blue-500/20 text-blue-500',
      info: 'bg-green-500/20 text-green-500'
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-500/20 text-gray-500';
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl" side="right">
        <SheetHeader className="space-y-4 pb-4">
          <SheetTitle className="flex items-center justify-between">
            <span>{alert.title}</span>
            <Badge className={getSeverityColor(alert.severity)}>
              {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
            </Badge>
          </SheetTitle>
          <div className="text-sm text-muted-foreground">
            {new Date(alert.timestamp).toLocaleString()}
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="flow">Flow</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-12rem)] mt-4">
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Source</h4>
                      <Badge variant="outline">{alert.source}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Données Techniques</h4>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-muted-foreground">Transaction Hash</span>
                          <span className="font-mono">0x123...abc</span>
                          <span className="text-muted-foreground">Block Number</span>
                          <span>14120450</span>
                          <span className="text-muted-foreground">Protocol</span>
                          <span>Ethereum</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="flow" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Flux des Transactions</h4>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <p className="mb-2">Chemin des fonds:</p>
                          <div className="pl-4 border-l-2 border-muted space-y-2">
                            <p>1. Wallet A → Contract B</p>
                            <p>2. Contract B → DEX</p>
                            <p>3. DEX → Unknown Wallet</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="impact" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Impact Financier</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">$45,000</div>
                            <CardDescription>Montant Total</CardDescription>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">3</div>
                            <CardDescription>Wallets Affectés</CardDescription>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
