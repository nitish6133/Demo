import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Layout from '../components/Layout';
import Header from '../components/Header';
import { useMatch } from '../contexts/MatchContext';
import { useSettings } from '../contexts/SettingsContext';
import { generatePlayers } from '../data/mockData';
import { Match } from '../types';

const NewMatchPage: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useMatch();
  const { settings } = useSettings();
  
  const [formData, setFormData] = useState({
    hostTeam: '',
    visitorTeam: '',
    overs: 20,
    tossWinner: '',
    electedTo: 'bat' as 'bat' | 'bowl'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const match: Match = {
      id: uuidv4(),
      hostTeam: {
        name: formData.hostTeam,
        players: generatePlayers(formData.hostTeam, settings.playersPerTeam)
      },
      visitorTeam: {
        name: formData.visitorTeam,
        players: generatePlayers(formData.visitorTeam, settings.playersPerTeam)
      },
      tossWinner: formData.tossWinner,
      electedTo: formData.electedTo,
      overs: formData.overs,
      settings,
      status: 'not_started',
      createdAt: new Date().toISOString(),
      currentInning: 1,
      battingTeam: formData.electedTo === 'bat' ? formData.tossWinner : 
        (formData.tossWinner === formData.hostTeam ? formData.visitorTeam : formData.hostTeam),
      bowlingTeam: formData.electedTo === 'bowl' ? formData.tossWinner :
        (formData.tossWinner === formData.hostTeam ? formData.visitorTeam : formData.hostTeam),
      score: {
        totalRuns: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        currentOver: [],
        extras: {
          wides: 0,
          noBalls: 0,
          byes: 0,
          legByes: 0,
          total: 0
        },
        batsmen: {
          striker: {
            name: `${formData.electedTo === 'bat' ? formData.tossWinner : 
              (formData.tossWinner === formData.hostTeam ? formData.visitorTeam : formData.hostTeam)} Player 1`,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            strikeRate: 0,
            isOut: false
          },
          nonStriker: {
            name: `${formData.electedTo === 'bat' ? formData.tossWinner : 
              (formData.tossWinner === formData.hostTeam ? formData.visitorTeam : formData.hostTeam)} Player 2`,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            strikeRate: 0,
            isOut: false
          }
        },
        bowler: {
          name: `${formData.electedTo === 'bowl' ? formData.tossWinner : 
            (formData.tossWinner === formData.hostTeam ? formData.visitorTeam : formData.hostTeam)} Player 1`,
          overs: 0,
          maidens: 0,
          runs: 0,
          wickets: 0,
          economy: 0
        },
        fallOfWickets: []
      }
    };

    dispatch({ type: 'SET_MATCH', payload: match });
    navigate('/score');
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-md">
        <Header title="Score Mate - New Match" />
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Host Team
              </label>
              <input
                type="text"
                value={formData.hostTeam}
                onChange={(e) => setFormData(prev => ({ ...prev, hostTeam: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter host team name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visitor Team
              </label>
              <input
                type="text"
                value={formData.visitorTeam}
                onChange={(e) => setFormData(prev => ({ ...prev, visitorTeam: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter visitor team name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overs
              </label>
              <select
                value={formData.overs}
                onChange={(e) => setFormData(prev => ({ ...prev, overs: parseInt(e.target.value) }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value={5}>5 Overs</option>
                <option value={10}>10 Overs</option>
                <option value={20}>20 Overs</option>
                <option value={50}>50 Overs</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Toss Winner
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value={formData.hostTeam}
                    checked={formData.tossWinner === formData.hostTeam}
                    onChange={(e) => setFormData(prev => ({ ...prev, tossWinner: e.target.value }))}
                    className="mr-3 text-primary focus:ring-primary"
                    disabled={!formData.hostTeam}
                  />
                  {formData.hostTeam || 'Host Team'}
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value={formData.visitorTeam}
                    checked={formData.tossWinner === formData.visitorTeam}
                    onChange={(e) => setFormData(prev => ({ ...prev, tossWinner: e.target.value }))}
                    className="mr-3 text-primary focus:ring-primary"
                    disabled={!formData.visitorTeam}
                  />
                  {formData.visitorTeam || 'Visitor Team'}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Elected To
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="bat"
                    checked={formData.electedTo === 'bat'}
                    onChange={(e) => setFormData(prev => ({ ...prev, electedTo: e.target.value as 'bat' | 'bowl' }))}
                    className="mr-3 text-primary focus:ring-primary"
                  />
                  Bat First
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="bowl"
                    checked={formData.electedTo === 'bowl'}
                    onChange={(e) => setFormData(prev => ({ ...prev, electedTo: e.target.value as 'bat' | 'bowl' }))}
                    className="mr-3 text-primary focus:ring-primary"
                  />
                  Bowl First
                </label>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/settings')}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Advanced Settings
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                disabled={!formData.hostTeam || !formData.visitorTeam || !formData.tossWinner}
              >
                Start Match
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NewMatchPage;