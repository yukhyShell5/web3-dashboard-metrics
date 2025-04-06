
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, PieChartIcon, LayoutDashboardIcon, AlertTriangleIcon, Settings2Icon, ShieldAlertIcon, LogInIcon } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';

const Sidebar = () => {
  const navItems = [
    { name: 'Home', path: '/', icon: <HomeIcon className="w-5 h-5" /> },
    { name: 'Analytics', path: '/analytics', icon: <PieChartIcon className="w-5 h-5" /> },
    { name: 'Dashboards', path: '/dashboards', icon: <LayoutDashboardIcon className="w-5 h-5" /> },
    { name: 'Rules', path: '/rules', icon: <ShieldAlertIcon className="w-5 h-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings2Icon className="w-5 h-5" /> },
  ];

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
                    `flex items-center gap-2 p-2 rounded-md transition-colors ${
                      isActive
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
          <Button variant="outline" className="w-full flex items-center gap-2">
            <LogInIcon className="h-4 w-4" />
            <span>Connect</span>
          </Button>
        </div>
        <div className="flex items-center justify-center">
          <div className="text-xs text-sidebar-foreground/60">
            Web3 SOC v1.0.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
