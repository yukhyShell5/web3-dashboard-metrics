
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MetricsTab from './MetricsTab';
import VisualizationTab from './VisualizationTab';
import DataSourceTab from './DataSourceTab';
import GeneralTab from './GeneralTab';
import { widgetTypes, colorSchemes } from './constants';
import { WidgetType } from '@/types/widget';

interface TabsContainerProps {
  metric: string;
  setMetric: (value: string) => void;
  dimension: string;
  setDimension: (value: string) => void;
  type: WidgetType;
  setType: (type: WidgetType) => void;
  visualizationType: string;
  setVisualizationType: (type: string) => void;
  colorScheme: string;
  setColorScheme: (scheme: string) => void;
  showLegend: boolean;
  setShowLegend: (show: boolean) => void;
  dataSource: string;
  setDataSource: (source: string) => void;
  autoRefresh: boolean;
  setAutoRefresh: (refresh: boolean) => void;
  refreshInterval: string;
  setRefreshInterval: (interval: string) => void;
  title: string;
  setTitle: (title: string) => void;
}

const TabsContainer: React.FC<TabsContainerProps> = (props) => {
  return (
    <Tabs defaultValue="metrics" className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="metrics">Metrics</TabsTrigger>
        <TabsTrigger value="visualization">Visualization</TabsTrigger>
        <TabsTrigger value="data">Data Source</TabsTrigger>
        <TabsTrigger value="general">General</TabsTrigger>
      </TabsList>

      <TabsContent value="metrics">
        <MetricsTab
          metric={props.metric}
          setMetric={props.setMetric}
          dimension={props.dimension}
          setDimension={props.setDimension}
        />
      </TabsContent>

      <TabsContent value="visualization">
        <VisualizationTab
          type={props.type}
          setType={props.setType}
          widgetTypes={widgetTypes}
          visualizationType={props.visualizationType}
          setVisualizationType={props.setVisualizationType}
          colorScheme={props.colorScheme}
          setColorScheme={props.setColorScheme}
          colorSchemes={colorSchemes}
          showLegend={props.showLegend}
          setShowLegend={props.setShowLegend}
        />
      </TabsContent>

      <TabsContent value="data">
        <DataSourceTab
          dataSource={props.dataSource}
          setDataSource={props.setDataSource}
          autoRefresh={props.autoRefresh}
          setAutoRefresh={props.setAutoRefresh}
          refreshInterval={props.refreshInterval}
          setRefreshInterval={props.setRefreshInterval}
        />
      </TabsContent>

      <TabsContent value="general">
        <GeneralTab
          title={props.title}
          setTitle={props.setTitle}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TabsContainer;
