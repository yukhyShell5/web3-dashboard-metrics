import type { Meta, StoryObj } from '@storybook/react';
import { toast } from './toast';

const meta: Meta<typeof toast> = {
  title: 'Components/Ui/toast',
  component: toast,
};

export default meta;
type Story = StoryObj<typeof toast>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
