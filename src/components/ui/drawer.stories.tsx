
import type { Meta, StoryObj } from '@storybook/react';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from './drawer';
import { Button } from './button';

const meta: Meta<typeof Drawer> = {
  title: 'Components/Ui/Drawer',
  component: Drawer,
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  args: {
    children: (
      <>
        <DrawerTrigger asChild>
          <Button variant="outline">Open Drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <DrawerDescription>
              Drawer description goes here.
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </>
    ),
  },
};
