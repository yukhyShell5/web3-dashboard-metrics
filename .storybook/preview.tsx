import React from 'react';
import type { Preview } from '@storybook/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '../src/index.css';

import Dashboards from '../src/pages/Dashboards';
import Analytics from '../src/pages/Analytics';
import Settings from '../src/pages/Settings';
import Rules from '../src/pages/Rules';
import Home from '../src/pages/Home';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/Home']}>
        <Routes>
          <Route path="/dashboard" element={<Dashboards />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export default preview;
