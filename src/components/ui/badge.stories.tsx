
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';  // Named import with correct capitalization

const meta: Meta<typeof Badge> = {
  title: 'Components/Ui/Badge',
  component: Badge,
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    // Add any necessary props
  },
};
