
import type { Meta, StoryObj } from '@storybook/react';
import Widget from './widget';

const meta: Meta<typeof Widget> = {
  title: 'Components/Dashboard/Widget',
  component: Widget,
};

export default meta;
type Story = StoryObj<typeof Widget>;

export const Default: Story = {
  args: {
    // Add your props here
  },
};
