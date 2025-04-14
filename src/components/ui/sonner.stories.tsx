import type { Meta, StoryObj } from '@storybook/react';
import { sonner } from './sonner';

const meta: Meta<typeof sonner> = {
  title: 'Components/Ui/sonner',
  component: sonner,
};

export default meta;
type Story = StoryObj<typeof sonner>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
