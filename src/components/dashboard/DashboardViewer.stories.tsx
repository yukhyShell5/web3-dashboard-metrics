import type { Meta, StoryObj } from '@storybook/react';
import DashboardViewer from './DashboardViewer';

const meta: Meta<typeof DashboardViewer> = {
  title: 'Components/Dashboard/DashboardViewer',
  component: DashboardViewer,
};

export default meta;
type Story = StoryObj<typeof DashboardViewer>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
