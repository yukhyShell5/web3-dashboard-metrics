
import React from 'react';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import {
  ResponsiveContainer,
  Sankey,
  Tooltip,
  Rectangle,
} from 'recharts';

interface TransactionFlowGraphProps {
  data: {
    nodes: Array<{ name: string }>;
    links: Array<{
      source: number;
      target: number;
      value: number;
    }>;
  };
}

const TransactionFlowGraph: React.FC<TransactionFlowGraphProps> = ({ data }) => {
  const config = {
    flow: {
      theme: {
        light: '#9b87f5',
        dark: '#6E59A5'
      }
    },
    node: {
      theme: {
        light: '#D6BCFA',
        dark: '#7E69AB'
      }
    }
  };

  return (
    <div className="w-full h-[300px]">
      <ChartContainer config={config}>
        <Sankey
          data={data}
          node={
            <Rectangle 
              fill="var(--color-node)"
              radius={[4, 4, 4, 4]}
            />
          }
          link={{ fill: 'var(--color-flow)' }}
          nodePadding={50}
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Tooltip
            content={({ payload }) => {
              if (!payload?.[0]) return null;
              return (
                <ChartTooltipContent
                  className="flex flex-col gap-2"
                  payload={payload}
                />
              );
            }}
          />
        </Sankey>
      </ChartContainer>
    </div>
  );
};

export default TransactionFlowGraph;
