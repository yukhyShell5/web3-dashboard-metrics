
import type { Meta, StoryObj } from '@storybook/react';
import RecentAlerts from './RecentAlerts';

const meta: Meta<typeof RecentAlerts> = {
  title: 'Components/Analytics/RecentAlerts',
  component: RecentAlerts,
};

export default meta;
type Story = StoryObj<typeof RecentAlerts>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
