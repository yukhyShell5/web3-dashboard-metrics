
import React from 'react';

interface WidgetCreatorHeaderProps {
  title: string;
}

const WidgetCreatorHeader: React.FC<WidgetCreatorHeaderProps> = ({ title }) => {
  return (
    <div className="p-4 border-b flex justify-between items-center bg-muted/30">
      <h3 className="text-lg font-medium">{title}</h3>
    </div>
  );
};

export default WidgetCreatorHeader;
