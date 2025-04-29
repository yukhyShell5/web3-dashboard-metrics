
import React, { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { WidgetType } from '@/types/widget';
import WidgetCreatorHeader from './widgetCreator/WidgetCreatorHeader';
import WidgetCreatorFooter from './widgetCreator/WidgetCreatorFooter';
import TabsContainer from './widgetCreator/TabsContainer';
import { createWidgetConfig } from './widgetCreator/utils';

interface WidgetCreatorProps {
  onAddWidget: (widget: {
    title: string;
    type: WidgetType;
    config: Record<string, any>;
  }) => void;
  onCancel: () => void;
}

const WidgetCreator: React.FC<WidgetCreatorProps> = ({ onAddWidget, onCancel }) => {
  // Widget configuration state
  const [title, setTitle] = useState('New Widget');
  const [type, setType] = useState<WidgetType>('bar');
  const [colorScheme, setColorScheme] = useState('blue');
  const [showLegend, setShowLegend] = useState(true);
  const [metric, setMetric] = useState('value');
  const [dimension, setDimension] = useState('name');
  const [dataSource, setDataSource] = useState('mock');
  const [refreshInterval, setRefreshInterval] = useState('60');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [visualizationType, setVisualizationType] = useState('default');

  const handleSubmit = () => {
    const widgetConfig = createWidgetConfig(
      title,
      type,
      colorScheme,
      showLegend,
      metric,
      dimension,
      dataSource,
      autoRefresh,
      refreshInterval,
      visualizationType
    );

    onAddWidget(widgetConfig);
    toast({
      title: "Widget configured",
      description: `${title} widget has been configured and ready to add`
    });
  };

  return (
    <div className="widget-creator bg-background border rounded-md shadow-md">
      <WidgetCreatorHeader title="Configure Widget" />

      <div className="p-4">
        <TabsContainer
          metric={metric}
          setMetric={setMetric}
          dimension={dimension}
          setDimension={setDimension}
          type={type}
          setType={setType}
          visualizationType={visualizationType}
          setVisualizationType={setVisualizationType}
          colorScheme={colorScheme}
          setColorScheme={setColorScheme}
          showLegend={showLegend}
          setShowLegend={setShowLegend}
          dataSource={dataSource}
          setDataSource={setDataSource}
          autoRefresh={autoRefresh}
          setAutoRefresh={setAutoRefresh}
          refreshInterval={refreshInterval}
          setRefreshInterval={setRefreshInterval}
          title={title}
          setTitle={setTitle}
        />
      </div>
      
      <WidgetCreatorFooter 
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </div>
  );
};

export default WidgetCreator;
