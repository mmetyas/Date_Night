
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';

import HomePage from './pages/HomePage';
import RestaurantsPage from './pages/RestaurantsPage';
import InvitationsPage from './pages/InvitationsPage';
import PublicInvitationPage from './pages/PublicInvitationPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/restaurants" element={<RestaurantsPage />} />

        <Route path="/invitations" element={<InvitationsPage />} />

        <Route
          path="/invite/:token"
          element={<PublicInvitationPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
