import type { Meta, StoryObj } from '@storybook/react';
import { toggle } from './toggle';

const meta: Meta<typeof toggle> = {
  title: 'Components/Ui/toggle',
  component: toggle,
};

export default meta;
type Story = StoryObj<typeof toggle>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
