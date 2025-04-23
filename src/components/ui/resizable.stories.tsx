
import type { Meta, StoryObj } from '@storybook/react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable';

// Create a component that demonstrates the resizable components
const ResizableDemo = () => {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>Left panel</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>Right panel</ResizablePanel>
    </ResizablePanelGroup>
  );
};

const meta: Meta<typeof ResizableDemo> = {
  title: 'Components/Ui/Resizable',
  component: ResizableDemo,
};

export default meta;
type Story = StoryObj<typeof ResizableDemo>;

export const Default: Story = {
  args: {},
};
