import type { Meta, StoryObj } from '@storybook/react';
import { badge } from './badge';

const meta: Meta<typeof badge> = {
  title: 'Components/Ui/badge',
  component: badge,
};

export default meta;
type Story = StoryObj<typeof badge>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
