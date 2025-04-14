import type { Meta, StoryObj } from '@storybook/react';
import { MonitoringHeader } from './MonitoringHeader';

const meta: Meta<typeof MonitoringHeader> = {
  title: 'Components/Settings/MonitoringHeader',
  component: MonitoringHeader,
};

export default meta;
type Story = StoryObj<typeof MonitoringHeader>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
