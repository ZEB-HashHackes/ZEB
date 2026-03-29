import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminLayout } from './components/Layout/AdminLayout';
import { Dashboard } from './pages/Dashboard';
import { RevenueView } from './pages/RevenueView';
import { ArtworkFlags } from './pages/ArtworkFlags';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="revenue/:type" element={<RevenueView />} />
          <Route path="moderation/flags" element={<ArtworkFlags />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
