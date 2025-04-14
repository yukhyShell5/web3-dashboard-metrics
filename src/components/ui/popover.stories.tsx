import type { Meta, StoryObj } from '@storybook/react';
import { popover } from './popover';

const meta: Meta<typeof popover> = {
  title: 'Components/Ui/popover',
  component: popover,
};

export default meta;
type Story = StoryObj<typeof popover>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
