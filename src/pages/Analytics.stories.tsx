import type { Meta, StoryObj } from '@storybook/react';
import Analytics  from './Analytics';

const meta: Meta<typeof Analytics> = {
  title: 'Pages/Analytics',
  component: Analytics,
};

export default meta;
type Story = StoryObj<typeof Analytics>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
