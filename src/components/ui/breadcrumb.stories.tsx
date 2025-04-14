import type { Meta, StoryObj } from '@storybook/react';
import { breadcrumb } from './breadcrumb';

const meta: Meta<typeof breadcrumb> = {
  title: 'Components/Ui/breadcrumb',
  component: breadcrumb,
};

export default meta;
type Story = StoryObj<typeof breadcrumb>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
