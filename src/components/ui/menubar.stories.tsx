import type { Meta, StoryObj } from '@storybook/react';
import { menubar } from './menubar';

const meta: Meta<typeof menubar> = {
  title: 'Components/Ui/menubar',
  component: menubar,
};

export default meta;
type Story = StoryObj<typeof menubar>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
