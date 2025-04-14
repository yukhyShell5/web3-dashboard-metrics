import type { Meta, StoryObj } from '@storybook/react';
import Dashboards from './Dashboards';

const meta: Meta<typeof Dashboards> = {
  title: 'Pages/Dashboards',
  component: Dashboards,
};

export default meta;
type Story = StoryObj<typeof Dashboards>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
