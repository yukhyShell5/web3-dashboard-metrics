
import React from 'react';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AddressInteractionMapProps {
  data: Array<{
    address: string;
    interactions: number;
    value: number;
  }>;
}

const AddressInteractionMap: React.FC<AddressInteractionMapProps> = ({ data }) => {
  const config = {
    bubble: {
      theme: {
        light: '#9b87f5',
        dark: '#6E59A5'
      }
    }
  };

  return (
    <div className="w-full h-[300px]">
      <ChartContainer config={config}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <XAxis type="number" dataKey="interactions" name="Interactions" />
          <YAxis type="number" dataKey="value" name="Value (ETH)" />
          <ZAxis type="number" range={[50, 400]} />
          <Tooltip
            content={({ payload }) => {
              if (!payload?.[0]) return null;
              const data = payload[0].payload;
              return (
                <ChartTooltipContent
                  className="flex flex-col gap-2"
                  payload={[
                    {
                      name: 'Address',
                      value: data.address,
                    },
                    {
                      name: 'Interactions',
                      value: data.interactions,
                    },
                    {
                      name: 'Value',
                      value: `${data.value} ETH`,
                    },
                  ]}
                />
              );
            }}
          />
          <Scatter
            data={data}
            fill="var(--color-bubble)"
          />
        </ScatterChart>
      </ChartContainer>
    </div>
  );
};

export default AddressInteractionMap;
