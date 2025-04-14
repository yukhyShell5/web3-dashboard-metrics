import type { Meta, StoryObj } from '@storybook/react';
import { accordion } from './accordion';

const meta: Meta<typeof accordion> = {
  title: 'Components/Ui/accordion',
  component: accordion,
};

export default meta;
type Story = StoryObj<typeof accordion>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
