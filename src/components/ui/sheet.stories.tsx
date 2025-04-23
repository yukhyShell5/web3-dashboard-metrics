
import type { Meta, StoryObj } from '@storybook/react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './sheet';
import { Button } from './button';

const meta: Meta<typeof Sheet> = {
  title: 'Components/Ui/Sheet',
  component: Sheet,
};

export default meta;
type Story = StoryObj<typeof Sheet>;

export const Default: Story = {
  args: {
    children: (
      <>
        <SheetTrigger asChild>
          <Button variant="outline">Open Sheet</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>
              Sheet description goes here.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </>
    ),
  },
};
