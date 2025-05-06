
import React from 'react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, className }) => {
  return (
    <div className={`h-full w-full ${className}`}>
      <div className="text-xs font-medium mb-1 text-muted-foreground">{title}</div>
      <div className="w-full h-[calc(100%-20px)]">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
