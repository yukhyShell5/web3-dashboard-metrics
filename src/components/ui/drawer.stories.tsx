import type { Meta, StoryObj } from '@storybook/react';
import { drawer } from './drawer';

const meta: Meta<typeof drawer> = {
  title: 'Components/Ui/drawer',
  component: drawer,
};

export default meta;
type Story = StoryObj<typeof drawer>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
