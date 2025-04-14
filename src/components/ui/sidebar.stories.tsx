import type { Meta, StoryObj } from '@storybook/react';
import { sidebar } from './sidebar';

const meta: Meta<typeof sidebar> = {
  title: 'Components/Ui/sidebar',
  component: sidebar,
};

export default meta;
type Story = StoryObj<typeof sidebar>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
