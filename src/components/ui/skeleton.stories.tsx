import type { Meta, StoryObj } from '@storybook/react';
import { skeleton } from './skeleton';

const meta: Meta<typeof skeleton> = {
  title: 'Components/Ui/skeleton',
  component: skeleton,
};

export default meta;
type Story = StoryObj<typeof skeleton>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
