import type { Meta, StoryObj } from '@storybook/react';
import DashboardEdit from './DashboardEdit';

const meta: Meta<typeof DashboardEdit> = {
  title: 'Components/Dashboard/DashboardEdit',
  component: DashboardEdit,
};

export default meta;
type Story = StoryObj<typeof DashboardEdit>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
