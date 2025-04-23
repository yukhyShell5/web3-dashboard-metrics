
import type { Meta, StoryObj } from '@storybook/react';
import RuleCreateForm from './RuleCreateForm';

const meta: Meta<typeof RuleCreateForm> = {
  title: 'Components/Rules/RuleCreateForm',
  component: RuleCreateForm,
};

export default meta;
type Story = StoryObj<typeof RuleCreateForm>;

export const Default: Story = {
  args: {
    // Add any necessary props here
  },
};
