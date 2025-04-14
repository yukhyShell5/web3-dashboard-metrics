import type { Meta, StoryObj } from '@storybook/react';
import { GeneralTab } from './GeneralTab';

const meta: Meta<typeof GeneralTab> = {
  title: 'Components/Settings/GeneralTab',
  component: GeneralTab,
};

export default meta;
type Story = StoryObj<typeof GeneralTab>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
