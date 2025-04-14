import type { Meta, StoryObj } from '@storybook/react';
import { slider } from './slider';

const meta: Meta<typeof slider> = {
  title: 'Components/Ui/slider',
  component: slider,
};

export default meta;
type Story = StoryObj<typeof slider>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
