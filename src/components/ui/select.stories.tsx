import type { Meta, StoryObj } from '@storybook/react';
import { select } from './select';

const meta: Meta<typeof select> = {
  title: 'Components/Ui/select',
  component: select,
};

export default meta;
type Story = StoryObj<typeof select>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
