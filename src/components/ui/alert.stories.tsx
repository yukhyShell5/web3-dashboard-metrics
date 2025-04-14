import type { Meta, StoryObj } from '@storybook/react';
import { alert } from './alert';

const meta: Meta<typeof alert> = {
  title: 'Components/Ui/alert',
  component: alert,
};

export default meta;
type Story = StoryObj<typeof alert>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
