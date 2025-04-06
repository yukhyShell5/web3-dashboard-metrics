
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardTemplates } from './templates';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onSelectTemplate
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      {dashboardTemplates.map((template) => (
        <Card 
          key={template.id}
          className={`cursor-pointer transition-all hover:border-primary ${
            selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSelectTemplate(template.id)}
        >
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-2">{template.icon}</div>
            <CardTitle>{template.title}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            {template.widgets.length} widgets included
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TemplateSelector;
