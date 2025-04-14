import type { Meta, StoryObj } from '@storybook/react';
import { tabs } from './tabs';

const meta: Meta<typeof tabs> = {
  title: 'Components/Ui/tabs',
  component: tabs,
};

export default meta;
type Story = StoryObj<typeof tabs>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
