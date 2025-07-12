import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Header from '../components/Header';
import { useMatch } from '../contexts/MatchContext';

const ScoreboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useMatch();
  const { currentMatch } = state;

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

  const { score } = currentMatch;

  return (
    <Layout>
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-md">
          <Header 
            title="Scoreboard"
            showBack
            backTo="/score"
            actions={
              <button
                onClick={() => navigate('/score')}
                className="px-4 py-2 bg-white bg-opacity-20 text-white rounded hover:bg-opacity-30 transition-colors"
              >
                Back to Scoring
              </button>
            }
          />
          
          {/* Match Summary */}
          <div className="p-4 border-b">
            <div className="text-sm text-gray-600 mb-2">
              {currentMatch.tossWinner} won the toss and opted to {currentMatch.electedTo} first.
            </div>
            
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{currentMatch.battingTeam}</h2>
              <div className="text-right">
                <span className="text-xl font-bold">{score.totalRuns}-{score.wickets} ({score.overs}.{score.balls})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Batting Stats */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 p-3">
            <h3 className="font-semibold text-gray-700">Batsmen</h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">R</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">B</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">4s</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">6s</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">SR</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-3 text-sm">
                  <div>
                    <div className="font-medium">{score.batsmen.striker.name}</div>
                    {!score.batsmen.striker.isOut && (
                      <div className="text-xs text-gray-500">not out</div>
                    )}
                    {score.batsmen.striker.dismissalType && (
                      <div className="text-xs text-gray-500">{score.batsmen.striker.dismissalType}</div>
                    )}
                  </div>
                </td>
                <td className="py-2 px-3 text-sm text-center">{score.batsmen.striker.runs}</td>
                <td className="py-2 px-3 text-sm text-center">{score.batsmen.striker.balls}</td>
                <td className="py-2 px-3 text-sm text-center">{score.batsmen.striker.fours}</td>
                <td className="py-2 px-3 text-sm text-center">{score.batsmen.striker.sixes}</td>
                <td className="py-2 px-3 text-sm text-center">{score.batsmen.striker.strikeRate.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-3 text-sm">
                  <div>
                    <div className="font-medium">{score.batsmen.nonStriker.name}</div>
                    {!score.batsmen.nonStriker.isOut && (
                      <div className="text-xs text-gray-500">not out</div>
                    )}
                  </div>
                </td>
                <td className="py-2 px-3 text-sm text-center">{score.batsmen.nonStriker.runs}</td>
                <td className="py-2 px-3 text-sm text-center">{score.batsmen.nonStriker.balls}</td>
                <td className="py-2 px-3 text-sm text-center">{score.batsmen.nonStriker.fours}</td>
                <td className="py-2 px-3 text-sm text-center">{score.batsmen.nonStriker.sixes}</td>
                <td className="py-2 px-3 text-sm text-center">{score.batsmen.nonStriker.strikeRate.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          
          {/* Extras */}
          <div className="p-3 bg-gray-50 border-t">
            <div className="flex justify-between text-sm">
              <span>Extras</span>
              <span>{score.extras.total} ({score.extras.byes} b, {score.extras.legByes} lb, {score.extras.wides} w, {score.extras.noBalls} nb)</span>
            </div>
          </div>
          
          {/* Total */}
          <div className="p-3 bg-gray-100 border-t">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{score.totalRuns}-{score.wickets} ({score.overs}.{score.balls})</span>
            </div>
          </div>
        </div>

        {/* Bowling Stats */}
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

        {/* Fall of Wickets */}
        {score.fallOfWickets.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 p-3">
              <h3 className="font-semibold text-gray-700">Fall of Wickets</h3>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-700 uppercase">Batsman</th>
                  <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">Score</th>
                  <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">Over</th>
                </tr>
              </thead>
              <tbody>
                {score.fallOfWickets.map((wicket, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2 px-3 text-sm">{wicket.batsman}</td>
                    <td className="py-2 px-3 text-sm text-center">{wicket.runs}/{wicket.wicketNumber}</td>
                    <td className="py-2 px-3 text-sm text-center">{wicket.overs}.{wicket.balls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ScoreboardPage;