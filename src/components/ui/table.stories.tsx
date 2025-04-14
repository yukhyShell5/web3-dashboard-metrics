import type { Meta, StoryObj } from '@storybook/react';
import { table } from './table';

const meta: Meta<typeof table> = {
  title: 'Components/Ui/table',
  component: table,
};

export default meta;
type Story = StoryObj<typeof table>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
