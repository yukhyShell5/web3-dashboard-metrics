
import type { Meta, StoryObj } from '@storybook/react';
import ApiTab from './ApiTab';

const meta: Meta<typeof ApiTab> = {
  title: 'Components/Settings/ApiTab',
  component: ApiTab,
};

export default meta;
type Story = StoryObj<typeof ApiTab>;

export const Default: Story = {
  args: {
    // Add any necessary props here
  },
};
