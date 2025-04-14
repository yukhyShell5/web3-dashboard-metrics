import type { Meta, StoryObj } from '@storybook/react';
import { AddressesTab } from './AddressesTab';

const meta: Meta<typeof AddressesTab> = {
  title: 'Components/Settings/AddressesTab',
  component: AddressesTab,
};

export default meta;
type Story = StoryObj<typeof AddressesTab>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
