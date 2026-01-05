
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import ReferenceDetail from './pages/ReferenceDetail';
import AdminForm from './pages/AdminForm';
import Standards from './pages/Standards';
import { getReferences } from './lib/storage';
import { ReferenceImage } from './types';

const App: React.FC = () => {
  const [references, setReferences] = useState<ReferenceImage[]>([]);

  useEffect(() => {
    setReferences(getReferences());
  }, []);

  const refreshData = () => {
    setReferences(getReferences());
  };

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard references={references} />} />
          <Route path="/library" element={<Library references={references} />} />
          <Route path="/reference/:id" element={<ReferenceDetail references={references} />} />
          <Route path="/admin/new" element={<AdminForm onSave={refreshData} />} />
          <Route path="/admin/edit/:id" element={<AdminForm references={references} onSave={refreshData} />} />
          <Route path="/standards" element={<Standards />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
