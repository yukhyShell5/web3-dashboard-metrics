
import type { Meta, StoryObj } from '@storybook/react';
import NotificationsTab from './NotificationsTab';

const meta: Meta<typeof NotificationsTab> = {
  title: 'Components/Settings/NotificationsTab',
  component: NotificationsTab,
};

export default meta;
type Story = StoryObj<typeof NotificationsTab>;

export const Default: Story = {
  args: {
    // Add any necessary props here
  },
};
