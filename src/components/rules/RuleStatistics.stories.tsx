
import type { Meta, StoryObj } from '@storybook/react';
import RuleStatistics from './RuleStatistics';

const meta: Meta<typeof RuleStatistics> = {
  title: 'Components/Rules/RuleStatistics',
  component: RuleStatistics,
};

export default meta;
type Story = StoryObj<typeof RuleStatistics>;

export const Default: Story = {
  args: {
    rules: [], // Provide an empty array as default
  },
};
