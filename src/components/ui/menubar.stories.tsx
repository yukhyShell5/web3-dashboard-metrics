
import type { Meta, StoryObj } from '@storybook/react';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from './menubar';

const meta: Meta<typeof Menubar> = {
  title: 'Components/Ui/Menubar',
  component: Menubar,
};

export default meta;
type Story = StoryObj<typeof Menubar>;

export const Default: Story = {
  args: {
    children: (
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Tab</MenubarItem>
          <MenubarItem>New Window</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    ),
  },
};
