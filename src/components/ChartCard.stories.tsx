import type { Meta, StoryObj } from '@storybook/react';
import { ChartCard } from './ChartCard';

const meta: Meta<typeof ChartCard> = {
  title: 'Components/ChartCard',
  component: ChartCard,
};

export default meta;
type Story = StoryObj<typeof ChartCard>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
