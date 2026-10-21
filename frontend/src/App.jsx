
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import RestaurantsPage from './pages/RestaurantsPage';
import InvitationsPage from './pages/InvitationsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/restaurants" element={<RestaurantsPage />} />
        <Route path="/invitations" element={<InvitationsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
