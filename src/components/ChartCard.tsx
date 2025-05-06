
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, className }) => {
  return (
    <Card className={`shadow-none border-0 bg-transparent ${className}`}>
      <CardContent className="p-0">
        <div className="text-sm font-medium mb-2 text-muted-foreground">{title}</div>
        <div className="w-full h-full">
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
