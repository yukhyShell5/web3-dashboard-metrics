import type { Meta, StoryObj } from '@storybook/react';
import { pagination } from './pagination';

const meta: Meta<typeof pagination> = {
  title: 'Components/Ui/pagination',
  component: pagination,
};

export default meta;
type Story = StoryObj<typeof pagination>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
