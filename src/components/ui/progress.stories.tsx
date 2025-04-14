import type { Meta, StoryObj } from '@storybook/react';
import { progress } from './progress';

const meta: Meta<typeof progress> = {
  title: 'Components/Ui/progress',
  component: progress,
};

export default meta;
type Story = StoryObj<typeof progress>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
