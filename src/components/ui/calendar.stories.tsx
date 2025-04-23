
import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Components/Ui/Calendar',
  component: Calendar,
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  args: {
    // Add any necessary props here
  },
};
