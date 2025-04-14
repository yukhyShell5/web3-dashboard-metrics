import type { Meta, StoryObj } from '@storybook/react';
import { SwitchComponent as SwitchComponent } from './switch';

const meta: Meta<typeof SwitchComponent> = {
  title: 'Components/Ui/SwitchComponent',
  component: SwitchComponent,
};

export default meta;
type Story = StoryObj<typeof SwitchComponent>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
