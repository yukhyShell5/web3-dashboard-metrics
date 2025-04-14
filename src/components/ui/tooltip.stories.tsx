import type { Meta, StoryObj } from '@storybook/react';
import { tooltip } from './tooltip';

const meta: Meta<typeof tooltip> = {
  title: 'Components/Ui/tooltip',
  component: tooltip,
};

export default meta;
type Story = StoryObj<typeof tooltip>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
