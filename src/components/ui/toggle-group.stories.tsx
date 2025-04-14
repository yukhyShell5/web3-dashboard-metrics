import type { Meta, StoryObj } from '@storybook/react';
import { ToggleGroup } from './toggle-group';

const meta: Meta<typeof ToggleGroup> = {
  title: 'Components/Ui/ToggleGroup',
  component: ToggleGroup,
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
