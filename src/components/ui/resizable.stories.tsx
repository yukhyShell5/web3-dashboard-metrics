import type { Meta, StoryObj } from '@storybook/react';
import { resizable } from './resizable';

const meta: Meta<typeof resizable> = {
  title: 'Components/Ui/resizable',
  component: resizable,
};

export default meta;
type Story = StoryObj<typeof resizable>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
