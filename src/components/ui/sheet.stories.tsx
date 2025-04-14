import type { Meta, StoryObj } from '@storybook/react';
import { sheet } from './sheet';

const meta: Meta<typeof sheet> = {
  title: 'Components/Ui/sheet',
  component: sheet,
};

export default meta;
type Story = StoryObj<typeof sheet>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
