import type { Meta, StoryObj } from '@storybook/react';
import { collapsible } from './collapsible';

const meta: Meta<typeof collapsible> = {
  title: 'Components/Ui/collapsible',
  component: collapsible,
};

export default meta;
type Story = StoryObj<typeof collapsible>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
