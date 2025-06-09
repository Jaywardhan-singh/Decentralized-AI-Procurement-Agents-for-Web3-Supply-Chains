import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { VendorPortal } from './pages/VendorPortal';
import { Procurement } from './pages/Procurement';
import { Contracts } from './pages/Contracts';
import { Analytics } from './pages/Analytics';
import { AIAssistant } from './pages/AIAssistant';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vendor-portal" element={<VendorPortal />} />
          <Route path="/procurement" element={<Procurement />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;