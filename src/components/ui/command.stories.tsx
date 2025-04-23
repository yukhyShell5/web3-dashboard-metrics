
import type { Meta, StoryObj } from '@storybook/react';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from './command';

const meta: Meta<typeof Command> = {
  title: 'Components/Ui/Command',
  component: Command,
};

export default meta;
type Story = StoryObj<typeof Command>;

export const Default: Story = {
  args: {
    children: (
      <>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Item 1</CommandItem>
            <CommandItem>Item 2</CommandItem>
          </CommandGroup>
        </CommandList>
      </>
    ),
  },
};
