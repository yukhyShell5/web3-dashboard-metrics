
import type { Meta, StoryObj } from '@storybook/react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';

const meta: Meta<typeof Popover> = {
  title: 'Components/Ui/Popover',
  component: Popover,
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  args: {
    children: (
      <>
        <PopoverTrigger asChild>
          <Button variant="outline">Open Popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          Popover content goes here
        </PopoverContent>
      </>
    ),
  },
};
