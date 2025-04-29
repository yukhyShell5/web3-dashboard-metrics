
import type { Meta, StoryObj } from '@storybook/react';
import RuleList from './RuleList';

const meta: Meta<typeof RuleList> = {
  title: 'Components/Rules/RuleList',
  component: RuleList,
};

export default meta;
type Story = StoryObj<typeof RuleList>;

const sampleRules = [
  {
    id: '1',
    name: 'High Value Transaction',
    description: 'Alert on transactions above 100 ETH',
    severity: 'high' as const,
    category: 'transaction',
    status: 'active' as const,
    created: '2023-04-15T10:30:00Z',
    triggers: 5,
    lastTriggered: '2023-05-01T14:22:00Z',
    code: 'function checkTransaction(tx) {\n  return tx.value > 100000000000000000000; // 100 ETH\n}'
  },
  {
    id: '2',
    name: 'Contract Interaction',
    description: 'Alert on specific contract calls',
    severity: 'medium' as const,
    category: 'smart-contract',
    status: 'paused' as const,
    created: '2023-03-10T08:15:00Z',
    triggers: 12,
    lastTriggered: '2023-04-28T19:45:00Z',
    code: 'function checkContractCall(tx) {\n  return tx.to === "0x1234..."; // Target contract\n}'
  }
];

export const Default: Story = {
  args: {
    rules: sampleRules,
  },
};

export const Empty: Story = {
  args: {
    rules: [],
  },
};
