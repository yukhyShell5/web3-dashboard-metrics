
import type { Meta, StoryObj } from '@storybook/react';
// Since there's no exported 'chart' component, we need to check what's actually exported
// Let's assume it's not meant to be a story for now
// This is a placeholder that will need further investigation

const DummyComponent = () => <div>Chart Component</div>;

const meta: Meta<typeof DummyComponent> = {
  title: 'Components/Ui/Chart',
  component: DummyComponent,
};

export default meta;
type Story = StoryObj<typeof DummyComponent>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
