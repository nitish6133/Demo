import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Header from '../components/Header';
import { getMatches, getMatchById } from '../services/matchService';
import { useMatch } from '../contexts/MatchContext';
import { MatchSummary } from '../types';

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useMatch();
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const matchData = await getMatches();
        setMatches(matchData);
      } catch (error) {
        console.error('Error loading matches:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  const handleResume = async (matchId: string) => {
    try {
      const match = await getMatchById(matchId);
      if (match) {
        dispatch({ type: 'SET_MATCH', payload: match });
        navigate('/score');
      }
    } catch (error) {
      console.error('Error resuming match:', error);
    }
  };

  const handleViewScoreboard = async (matchId: string) => {
    try {
      const match = await getMatchById(matchId);
      if (match) {
        dispatch({ type: 'SET_MATCH', payload: match });
        navigate('/scoreboard');
      }
    } catch (error) {
      console.error('Error viewing scoreboard:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-md">
          <Header title="Score Mate - Match History" />
        </div>

        {matches.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">No matches found</p>
            <button
              onClick={() => navigate('/new-match')}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Start New Match
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {match.hostTeam.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium">{match.hostTeam}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {match.totalRuns}/{match.wickets}
                    </div>
                    <div className="text-sm text-gray-500">({match.overs})</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {match.visitorTeam.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium">{match.visitorTeam}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">0/0</div>
                    <div className="text-sm text-gray-500">(0.0)</div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  {new Date(match.createdAt).toLocaleDateString()} - {new Date(match.createdAt).toLocaleTimeString()}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleResume(match.id)}
                    className="flex-1 py-2 px-4 bg-primary text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Resume
                  </button>
                  <button
                    onClick={() => handleViewScoreboard(match.id)}
                    className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                  >
                    Scoreboard
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Match Button */}
        <div className="pt-4">
          <button
            onClick={() => navigate('/new-match')}
            className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Start New Match
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default HistoryPage;