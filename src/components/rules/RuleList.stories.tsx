import type { Meta, StoryObj } from '@storybook/react';
import { RuleList } from './RuleList';

const meta: Meta<typeof RuleList> = {
  title: 'Components/Rules/RuleList',
  component: RuleList,
};

export default meta;
type Story = StoryObj<typeof RuleList>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
