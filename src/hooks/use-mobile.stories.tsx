import type { Meta, StoryObj } from '@storybook/react';
import { UseMobile } from './use-mobile';

const meta: Meta<typeof UseMobile> = {
  title: 'Hooks/UseMobile',
  component: UseMobile,
};

export default meta;
type Story = StoryObj<typeof UseMobile>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
