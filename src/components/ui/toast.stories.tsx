
import type { Meta, StoryObj } from '@storybook/react';
import { toast } from 'sonner';
import { Button } from './button';

const meta: Meta = {
  title: 'Components/Ui/Toast',
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    onClick: () => toast('Hello, world!'),
    children: 'Show Toast',
  },
};
