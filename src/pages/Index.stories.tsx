import type { Meta, StoryObj } from '@storybook/react';
import Index  from './Index';

const meta: Meta<typeof Index> = {
  title: 'Pages/Index',
  component: Index,
};

export default meta;
type Story = StoryObj<typeof Index>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
