
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, PieChartIcon, LayoutDashboardIcon, AlertTriangleIcon, Settings2Icon, ShieldAlertIcon } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Home', path: '/', icon: <HomeIcon className="w-5 h-5" /> },
    { name: 'Analytics', path: '/analytics', icon: <PieChartIcon className="w-5 h-5" /> },
    { name: 'Dashboards', path: '/dashboards', icon: <LayoutDashboardIcon className="w-5 h-5" /> },
    { name: 'Rules', path: '/rules', icon: <ShieldAlertIcon className="w-5 h-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings2Icon className="w-5 h-5" /> },
  ];

  return (
    <div className="h-screen w-64 bg-sidebar flex flex-col border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <ShieldAlertIcon className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-sidebar-foreground">Web3 SOC</h1>
        </div>
      </div>
      <nav className="flex-1 p-4">
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
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-xs text-sidebar-foreground/60">
            Web3 SOC v1.0.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
