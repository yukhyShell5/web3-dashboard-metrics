
import type { Meta, StoryObj } from '@storybook/react';
import RuleFilters from './RuleFilters';

const meta: Meta<typeof RuleFilters> = {
  title: 'Components/Rules/RuleFilters',
  component: RuleFilters,
};

export default meta;
type Story = StoryObj<typeof RuleFilters>;

export const Default: Story = {
  args: {
    // Add any necessary props here
  },
};
