
import type { Meta, StoryObj } from '@storybook/react';
import { useIsMobile } from './use-mobile';

// Create a component that uses the hook for demonstration purposes
const MobileDemo = () => {
  const isMobile = useIsMobile();
  return <div>Is Mobile: {String(isMobile)}</div>;
};

const meta: Meta<typeof MobileDemo> = {
  title: 'Hooks/UseIsMobile',
  component: MobileDemo,
};

export default meta;
type Story = StoryObj<typeof MobileDemo>;

export const Default: Story = {
  args: {},
};
