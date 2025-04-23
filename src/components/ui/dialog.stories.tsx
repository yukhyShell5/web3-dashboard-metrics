
import type { Meta, StoryObj } from '@storybook/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './dialog';
import { Button } from './button';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Ui/Dialog',
  component: Dialog,
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  args: {
    children: (
      <>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>
              Dialog description goes here.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </>
    ),
  },
};
