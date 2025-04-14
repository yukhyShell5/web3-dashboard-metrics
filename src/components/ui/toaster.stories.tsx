import type { Meta, StoryObj } from '@storybook/react';
import { toaster } from './toaster';

const meta: Meta<typeof toaster> = {
  title: 'Components/Ui/toaster',
  component: toaster,
};

export default meta;
type Story = StoryObj<typeof toaster>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
