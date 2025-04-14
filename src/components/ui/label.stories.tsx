import type { Meta, StoryObj } from '@storybook/react';
import { label } from './label';

const meta: Meta<typeof label> = {
  title: 'Components/Ui/label',
  component: label,
};

export default meta;
type Story = StoryObj<typeof label>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
