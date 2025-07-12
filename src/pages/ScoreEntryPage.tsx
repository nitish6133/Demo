import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Header from '../components/Header';
import ScorePad from '../components/ScorePad';
import { useMatch } from '../contexts/MatchContext';
import { saveMatch } from '../services/matchService';

const ScoreEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useMatch();
  const { currentMatch } = state;

  useEffect(() => {
    if (!currentMatch) {
      navigate('/new-match');
      return;
    }

    // Save match to localStorage whenever it updates
    if (currentMatch) {
      saveMatch(currentMatch);
    }
  }, [currentMatch, navigate]);

  if (!currentMatch) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No active match found</p>
            <button
              onClick={() => navigate('/new-match')}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Start New Match
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleScore = (runs: number) => {
    dispatch({ type: 'ADD_RUNS', payload: runs });
    dispatch({ type: 'NEXT_BALL' });
  };

  const handleWicket = () => {
    dispatch({ type: 'ADD_WICKET' });
    dispatch({ type: 'NEXT_BALL' });
  };

  const handleExtra = (type: string, runs: number) => {
    dispatch({ type: 'ADD_EXTRA', payload: { type, runs } });
    // Don't advance ball for extras (they're re-bowled)
  };

  const handleUndo = () => {
    dispatch({ type: 'UNDO_LAST_BALL' });
  };

  const handleSwap = () => {
    // Swap striker and non-striker
    const { striker, nonStriker } = currentMatch.score.batsmen;
    dispatch({
      type: 'UPDATE_SCORE',
      payload: {
        batsmen: {
          striker: nonStriker,
          nonStriker: striker,
        },
      },
    });
  };

  const { score } = currentMatch;
  const currentRunRate = score.overs > 0 ? (score.totalRuns / score.overs).toFixed(2) : '0.00';

  return (
    <Layout>
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md">
          <Header 
            title={`${currentMatch.hostTeam.name} vs ${currentMatch.visitorTeam.name}`}
            showBack
            backTo="/new-match"
            actions={
              <button
                onClick={() => navigate('/scoreboard')}
                className="px-4 py-2 bg-white bg-opacity-20 text-white rounded hover:bg-opacity-30 transition-colors"
              >
                Scoreboard
              </button>
            }
          />
          
          <div className="p-4 border-b">
            <div className="text-sm text-gray-600 mb-2">
              {currentMatch.battingTeam}, 1st Inning
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold">{score.totalRuns}-{score.wickets}</span>
                <span className="text-xl ml-2">({score.overs}.{score.balls})</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">CRR</div>
                <div className="text-lg font-semibold">{currentRunRate}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Batsmen Stats */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 p-3">
            <h3 className="font-semibold text-gray-700">Batsmen</h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-700 uppercase">Batsman</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">R</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">B</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">4s</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">6s</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">SR</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 bg-green-50">
                <td className="py-2 px-3 text-sm">
                  <div className="flex items-center">
                    <span className="mr-1">*</span>
                    {score.batsmen.striker.name}
                  </div>
                </td>
                <td className="py-2 px-3 text-sm text-center">{score.batsmen.striker.runs}</td>
                <td className="py-2 px-3 text-sm text-center">{score.batsmen.striker.balls}</td>
                <td className="py-2 px-3 text-sm text-center">{score.batsmen.striker.fours}</td>
                <td className="py-2 px-3 text-sm text-center">{score.batsmen.striker.sixes}</td>
                <td className="py-2 px-3 text-sm text-center">{score.batsmen.striker.strikeRate.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-3 text-sm">{score.batsmen.nonStriker.name}</td>
                <td className="py-2 px-3 text-sm text-center">{score.batsmen.nonStriker.runs}</td>
                <td className="py-2 px-3 text-sm text-center">{score.batsmen.nonStriker.balls}</td>
                <td className="py-2 px-3 text-sm text-center">{score.batsmen.nonStriker.fours}</td>
                <td className="py-2 px-3 text-sm text-center">{score.batsmen.nonStriker.sixes}</td>
                <td className="py-2 px-3 text-sm text-center">{score.batsmen.nonStriker.strikeRate.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Current Over */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-700 mb-2">This over:</h3>
          <div className="flex space-x-2">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center text-sm font-medium"
              >
                {score.currentOver[index] || ''}
              </div>
            ))}
          </div>
        </div>

        {/* Bowler Stats */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 p-3">
            <h3 className="font-semibold text-gray-700">Bowler</h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">O</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">M</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">R</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">W</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">ER</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-3 text-sm font-medium">{score.bowler.name}</td>
                <td className="py-2 px-3 text-sm text-center">{score.bowler.overs}</td>
                <td className="py-2 px-3 text-sm text-center">{score.bowler.maidens}</td>
                <td className="py-2 px-3 text-sm text-center">{score.bowler.runs}</td>
                <td className="py-2 px-3 text-sm text-center">{score.bowler.wickets}</td>
                <td className="py-2 px-3 text-sm text-center">{score.bowler.economy.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Score Pad */}
        <ScorePad
          onScore={handleScore}
          onWicket={handleWicket}
          onExtra={handleExtra}
          onUndo={handleUndo}
          onSwap={handleSwap}
        />
      </div>
    </Layout>
  );
};

export default ScoreEntryPage;