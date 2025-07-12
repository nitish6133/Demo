import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MatchProvider } from './contexts/MatchContext';
import { SettingsProvider } from './contexts/SettingsContext';
import NewMatchPage from './pages/NewMatchPage';
import AdvancedMatchSettingsPage from './pages/AdvancedMatchSettingsPage';
import ScoreEntryPage from './pages/ScoreEntryPage';
import ScoreboardPage from './pages/ScoreboardPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <SettingsProvider>
      <MatchProvider>
        <Router>
          <div className="min-h-screen bg-secondary">
            <Routes>
              <Route path="/" element={<Navigate to="/history" replace />} />
              <Route path="/new-match" element={<NewMatchPage />} />
              <Route path="/settings" element={<AdvancedMatchSettingsPage />} />
              <Route path="/score" element={<ScoreEntryPage />} />
              <Route path="/scoreboard" element={<ScoreboardPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </div>
        </Router>
      </MatchProvider>
    </SettingsProvider>
  );
}

export default App;