
import type { Meta, StoryObj } from '@storybook/react';
import LineChart from './LineChart';

const meta: Meta<typeof LineChart> = {
  title: 'Components/Charts/LineChart',
  component: LineChart,
};

export default meta;
type Story = StoryObj<typeof LineChart>;

export const Default: Story = {
  args: {
    data: [
      { name: 'Jan', value: 400 },
      { name: 'Feb', value: 300 },
      { name: 'Mar', value: 200 },
      { name: 'Apr', value: 278 },
      { name: 'May', value: 189 },
    ],
    xDataKey: 'name',
    lines: [
      { dataKey: 'value', stroke: '#8884d8', name: 'Value' }
    ]
  },
};
