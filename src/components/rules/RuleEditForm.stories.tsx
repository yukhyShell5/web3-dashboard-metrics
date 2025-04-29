
import type { Meta, StoryObj } from '@storybook/react';
import RuleEditForm from './RuleEditForm';

const meta: Meta<typeof RuleEditForm> = {
  title: 'Components/Rules/RuleEditForm',
  component: RuleEditForm,
};

export default meta;
type Story = StoryObj<typeof RuleEditForm>;

export const Default: Story = {
  args: {
    rule: {
      id: '1',
      name: 'High Value Transaction',
      description: 'Alert on transactions above 100 ETH',
      severity: 'high',
      category: 'transaction',
      status: 'active',
      code: 'function checkTransaction(tx) {\n  return tx.value > 100000000000000000000; // 100 ETH\n}',
    },
    onSubmit: (e) => {
      e.preventDefault();
      console.log('Form submitted');
    },
  },
};
