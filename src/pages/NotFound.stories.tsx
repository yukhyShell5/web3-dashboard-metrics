import type { Meta, StoryObj } from '@storybook/react';
import NotFound from './NotFound';

const meta: Meta<typeof NotFound> = {
  title: 'Pages/NotFound',
  component: NotFound,
};

export default meta;
type Story = StoryObj<typeof NotFound>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
