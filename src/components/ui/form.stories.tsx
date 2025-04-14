import type { Meta, StoryObj } from '@storybook/react';
import { form } from './form';

const meta: Meta<typeof form> = {
  title: 'Components/Ui/form',
  component: form,
};

export default meta;
type Story = StoryObj<typeof form>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
