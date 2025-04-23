
import React, { useState } from 'react';
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
import { Card, CardContent } from "@/components/ui/card";
import { Maximize2Icon, Minimize2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AlertDetailsProps {
  alert: AlertItemProps | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AlertDetails({ alert, isOpen, onClose }: AlertDetailsProps) {
  const [isMaximized, setIsMaximized] = useState(false);

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

  const toggleMaximize = () => setIsMaximized(!isMaximized);

  const sheetClass = isMaximized 
    ? "w-[100vw] h-[100vh] p-0" 
    : "w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl p-0";

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className={sheetClass} side="right">
        <div className={`h-full ${isMaximized ? 'p-8' : 'p-6'}`}>
          <SheetHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-4">
                <span>{alert.title}</span>
                <Badge className={getSeverityColor(alert.severity)}>
                  {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                </Badge>
              </SheetTitle>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleMaximize}
                className="hover:bg-secondary/80"
              >
                {isMaximized ? (
                  <Minimize2Icon className="h-5 w-5" />
                ) : (
                  <Maximize2Icon className="h-5 w-5" />
                )}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {new Date(alert.timestamp).toLocaleString()}
            </div>
          </SheetHeader>

          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Aperçu</TabsTrigger>
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="flow">Flow</TabsTrigger>
              <TabsTrigger value="impact">Impact</TabsTrigger>
            </TabsList>

            <ScrollArea className={`mt-6 ${isMaximized ? 'h-[calc(100vh-12rem)]' : 'h-[calc(100vh-14rem)]'}`}>
              <TabsContent value="overview">
                <Card className="border-secondary/20">
                  <CardContent className="space-y-6 p-6">
                    <div>
                      <h4 className="font-medium mb-3">Description</h4>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Source</h4>
                      <Badge variant="outline">{alert.source}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details">
                <Card className="border-secondary/20">
                  <CardContent className="space-y-6 p-6">
                    <div>
                      <h4 className="font-medium mb-3">Données Techniques</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <span className="text-muted-foreground">Transaction Hash</span>
                        <span className="font-mono">0x123...abc</span>
                        <span className="text-muted-foreground">Block Number</span>
                        <span>14120450</span>
                        <span className="text-muted-foreground">Protocol</span>
                        <span>Ethereum</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="flow">
                <Card className="border-secondary/20">
                  <CardContent className="space-y-6 p-6">
                    <div>
                      <h4 className="font-medium mb-3">Flux des Transactions</h4>
                      <div className="text-sm space-y-4">
                        <p>Chemin des fonds:</p>
                        <div className="pl-4 border-l-2 border-muted space-y-3">
                          <p>1. Wallet A → Contract B</p>
                          <p>2. Contract B → DEX</p>
                          <p>3. DEX → Unknown Wallet</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="impact">
                <Card className="border-secondary/20">
                  <CardContent className="space-y-6 p-6">
                    <div>
                      <h4 className="font-medium mb-3">Impact Financier</h4>
                      <div className="grid grid-cols-2 gap-6">
                        <Card>
                          <CardContent className="p-6">
                            <div className="text-2xl font-bold mb-2">$45,000</div>
                            <div className="text-sm text-muted-foreground">Montant Total</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-6">
                            <div className="text-2xl font-bold mb-2">3</div>
                            <div className="text-sm text-muted-foreground">Wallets Affectés</div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
