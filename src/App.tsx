
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Rules from './pages/Rules';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';
import Dashboards from './pages/Dashboards';
import DashboardView from './pages/DashboardView';
import DashboardEdit from './pages/DashboardEdit';
import './App.css';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/dashboards" element={<Dashboards />} />
          <Route path="/dashboards/view/:id" element={<DashboardView />} />
          <Route path="/dashboards/edit/:id" element={<DashboardEdit />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
