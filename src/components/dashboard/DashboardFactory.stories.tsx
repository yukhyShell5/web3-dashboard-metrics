import type { Meta, StoryObj } from '@storybook/react';
import DashboardFactory from './DashboardFactory';

const meta: Meta<typeof DashboardFactory> = {
  title: 'Components/Dashboard/DashboardFactory',
  component: DashboardFactory,
};

export default meta;
type Story = StoryObj<typeof DashboardFactory>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
