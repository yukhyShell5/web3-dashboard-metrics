import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  PieChartIcon,
  LayoutDashboardIcon,
  Settings2Icon,
  ShieldAlertIcon,
  LogInIcon,
  XIcon
} from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

const Sidebar = () => {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navItems = [
    { name: 'Home', path: '/', icon: <HomeIcon className="w-5 h-5" /> },
    { name: 'Analytics', path: '/analytics', icon: <PieChartIcon className="w-5 h-5" /> },
    { name: 'Dashboards', path: '/dashboards', icon: <LayoutDashboardIcon className="w-5 h-5" /> },
    { name: 'Rules', path: '/rules', icon: <ShieldAlertIcon className="w-5 h-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings2Icon className="w-5 h-5" /> },
  ];

  const handleConnect = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Ici vous ajouterez votre logique de connexion
      console.log('Tentative de connexion avec:', email, password);
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Fermer la modal après connexion réussie
      setIsConnectModalOpen(false);
    } catch (error) {
      console.error('Erreur de connexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-64 bg-sidebar border-r border-border flex-shrink-0 fixed h-screen flex flex-col z-50">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <ShieldAlertIcon className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-sidebar-foreground">Web3 SOC</h1>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 p-2 rounded-md transition-colors ${isActive
                      ? 'bg-primary/20 text-primary'
                      : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="mb-4">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => setIsConnectModalOpen(true)}
          >
            <LogInIcon className="h-4 w-4" />
            <span>Connect</span>
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-sidebar-foreground/60 text-center w-full">
            Web3 SOC v1.0.0
          </div>
        </div>
      </div>

      {/* Modal de connexion */}
      <Dialog open={isConnectModalOpen} onOpenChange={setIsConnectModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connexion</DialogTitle>
            <DialogDescription>
              Connectez-vous à votre compte Web3 SOC
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleConnect} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </form>
          
          <div className="text-center text-sm text-muted-foreground">
            Pas encore de compte ?{' '}
            <button 
              className="text-primary underline-offset-4 hover:underline"
              onClick={() => console.log('Rediriger vers inscription')}
            >
              Créer un compte
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sidebar;