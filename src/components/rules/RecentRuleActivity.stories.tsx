import type { Meta, StoryObj } from '@storybook/react';
import { RecentRuleActivity } from './RecentRuleActivity';

const meta: Meta<typeof RecentRuleActivity> = {
  title: 'Components/Rules/RecentRuleActivity',
  component: RecentRuleActivity,
};

export default meta;
type Story = StoryObj<typeof RecentRuleActivity>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
