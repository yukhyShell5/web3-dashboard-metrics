import type { Meta, StoryObj } from '@storybook/react';
import { separator } from './separator';

const meta: Meta<typeof separator> = {
  title: 'Components/Ui/separator',
  component: separator,
};

export default meta;
type Story = StoryObj<typeof separator>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
