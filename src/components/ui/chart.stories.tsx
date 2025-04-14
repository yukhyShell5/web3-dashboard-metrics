import type { Meta, StoryObj } from '@storybook/react';
import { chart } from './chart';

const meta: Meta<typeof chart> = {
  title: 'Components/Ui/chart',
  component: chart,
};

export default meta;
type Story = StoryObj<typeof chart>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
