
import type { Meta, StoryObj } from '@storybook/react';
import { Toaster } from './sonner';

const meta: Meta<typeof Toaster> = {
  title: 'Components/Ui/SonnerToaster',
  component: Toaster,
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  args: {
    // Add your props here
  },
};
