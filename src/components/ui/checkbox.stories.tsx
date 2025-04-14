import type { Meta, StoryObj } from '@storybook/react';
import { checkbox } from './checkbox';

const meta: Meta<typeof checkbox> = {
  title: 'Components/Ui/checkbox',
  component: checkbox,
};

export default meta;
type Story = StoryObj<typeof checkbox>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
