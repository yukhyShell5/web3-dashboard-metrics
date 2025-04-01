
import React from 'react';
import Sidebar from './Sidebar';
import { ScrollArea } from './ui/scroll-area';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background bg-gradient-to-b from-background to-background/80">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-screen">
          <div className="p-6">
            {children}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
};

export default Layout;
