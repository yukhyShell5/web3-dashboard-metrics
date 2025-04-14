import type { Meta, StoryObj } from '@storybook/react';
import { carousel } from './carousel';

const meta: Meta<typeof carousel> = {
  title: 'Components/Ui/carousel',
  component: carousel,
};

export default meta;
type Story = StoryObj<typeof carousel>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
