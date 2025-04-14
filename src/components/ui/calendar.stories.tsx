import type { Meta, StoryObj } from '@storybook/react';
import { calendar } from './calendar';

const meta: Meta<typeof calendar> = {
  title: 'Components/Ui/calendar',
  component: calendar,
};

export default meta;
type Story = StoryObj<typeof calendar>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
