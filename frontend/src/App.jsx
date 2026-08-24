import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import HowToPlayPage from './pages/HowToPlayPage';
import GuestSetupPage from './pages/GuestSetupPage';
import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';
import LocalGamePage from './pages/LocalGamePage';
import AiGamePage from './pages/AiGamePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import HistoryPage from './pages/HistoryPage';
import './assets/styles/global.css';

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/local" element={<LocalGamePage />} />
          <Route path="/ai" element={<AiGamePage />} />
          <Route path="/how-to-play" element={<HowToPlayPage />} />
          <Route path="/guest" element={<GuestSetupPage />} />
          <Route path="/lobby" element={<LobbyPage />} />
          <Route path="/game/:roomCode" element={<GamePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
