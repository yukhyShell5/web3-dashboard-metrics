import type { Meta, StoryObj } from '@storybook/react';
import { InputOtp } from './input-otp';

const meta: Meta<typeof InputOtp> = {
  title: 'Components/Ui/InputOtp',
  component: InputOtp,
};

export default meta;
type Story = StoryObj<typeof InputOtp>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
