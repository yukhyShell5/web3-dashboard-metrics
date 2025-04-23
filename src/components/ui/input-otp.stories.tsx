
import type { Meta, StoryObj } from '@storybook/react';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './input-otp';

const meta: Meta<typeof InputOTP> = {
  title: 'Components/Ui/InputOTP',
  component: InputOTP,
};

export default meta;
type Story = StoryObj<typeof InputOTP>;

export const Default: Story = {
  args: {
    maxLength: 6,
    children: (
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSeparator />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
    ),
  },
};
