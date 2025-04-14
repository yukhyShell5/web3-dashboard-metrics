import type { Meta, StoryObj } from '@storybook/react';
import { card } from './card';

const meta: Meta<typeof card> = {
  title: 'Components/Ui/card',
  component: card,
};

export default meta;
type Story = StoryObj<typeof card>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
