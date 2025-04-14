import type { Meta, StoryObj } from '@storybook/react';
import { command } from './command';

const meta: Meta<typeof command> = {
  title: 'Components/Ui/command',
  component: command,
};

export default meta;
type Story = StoryObj<typeof command>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
