import type { Meta, StoryObj } from '@storybook/react';
import Settings from './Settings';

const meta: Meta<typeof Settings> = {
  title: 'Pages/Settings',
  component: Settings,
};

export default meta;
type Story = StoryObj<typeof Settings>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
