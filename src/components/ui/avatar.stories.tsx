import type { Meta, StoryObj } from '@storybook/react';
import { avatar } from './avatar';

const meta: Meta<typeof avatar> = {
  title: 'Components/Ui/avatar',
  component: avatar,
};

export default meta;
type Story = StoryObj<typeof avatar>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
