import type { Meta, StoryObj } from '@storybook/react';
import Widget from './Widget';

const meta: Meta<typeof Widget> = {
  title: 'Components/Dashboard/Widget',
  component: Widget,
};

export default meta;
type Story = StoryObj<typeof Widget>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
