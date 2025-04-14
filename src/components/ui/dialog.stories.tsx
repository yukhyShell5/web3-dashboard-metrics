import type { Meta, StoryObj } from '@storybook/react';
import { dialog } from './dialog';

const meta: Meta<typeof dialog> = {
  title: 'Components/Ui/dialog',
  component: dialog,
};

export default meta;
type Story = StoryObj<typeof dialog>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
