import type { Meta, StoryObj } from '@storybook/react';
import Rules from './Rules';

const meta: Meta<typeof Rules> = {
  title: 'Pages/Rules',
  component: Rules,
};

export default meta;
type Story = StoryObj<typeof Rules>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
