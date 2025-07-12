import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MatchSettings } from '../types';
import { getMatchSettings, saveMatchSettings } from '../services/settingsService';

const AdvancedMatchSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<MatchSettings>({
    playersPerTeam: 11,
    noBallReball: true,
    noBallRun: 1,
    wideBallReball: true,
    wideBallRun: 1,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const matchSettings = await getMatchSettings();
        setSettings(matchSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await saveMatchSettings(settings);
      navigate('/new-match');
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePlayersPerTeamChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 15) {
      setSettings(prev => ({ ...prev, playersPerTeam: numValue }));
    }
  };

  const handleNoBallRunChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 6) {
      setSettings(prev => ({ ...prev, noBallRun: numValue }));
    }
  };

  const handleWideBallRunChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 6) {
      setSettings(prev => ({ ...prev, wideBallRun: numValue }));
    }
  };

  const ToggleSwitch: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
  }> = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-green-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-600 text-white p-4">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/new-match')}
            className="p-2 hover:bg-green-700 rounded mr-3"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Match Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Players per team */}
        <div>
          <label className="block text-lg font-medium text-green-700 mb-3">
            Players per team?
          </label>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <input
              type="number"
              value={settings.playersPerTeam}
              onChange={(e) => handlePlayersPerTeamChange(e.target.value)}
              min="0"
              max="15"
              className="w-full text-lg font-medium border-b-2 border-gray-300 focus:border-green-600 outline-none bg-transparent pb-2"
            />
          </div>
        </div>

        {/* No Ball Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-lg font-medium text-green-700">No Ball</label>
            <ToggleSwitch
              checked={true}
              onChange={() => {}} // Always enabled based on image
            />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-800">Re-ball</span>
              <ToggleSwitch
                checked={settings.noBallReball}
                onChange={(checked) => setSettings(prev => ({ ...prev, noBallReball: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-800">No ball run</span>
              <input
                type="number"
                value={settings.noBallRun}
                onChange={(e) => handleNoBallRunChange(e.target.value)}
                min="0"
                max="6"
                className="w-16 text-lg font-medium text-right border-b-2 border-gray-300 focus:border-green-600 outline-none bg-transparent pb-1"
              />
            </div>
          </div>
        </div>

        {/* Wide Ball Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-lg font-medium text-green-700">Wide Ball</label>
            <ToggleSwitch
              checked={true}
              onChange={() => {}} // Always enabled based on image
            />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-800">Re-ball</span>
              <ToggleSwitch
                checked={settings.wideBallReball}
                onChange={(checked) => setSettings(prev => ({ ...prev, wideBallReball: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-800">Wide ball run</span>
              <input
                type="number"
                value={settings.wideBallRun}
                onChange={(e) => handleWideBallRunChange(e.target.value)}
                min="0"
                max="6"
                className="w-16 text-lg font-medium text-right border-b-2 border-gray-300 focus:border-green-600 outline-none bg-transparent pb-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-4 left-4 right-4">
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="w-full py-4 bg-green-600 text-white text-lg font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save settings'}
        </button>
      </div>
    </div>
  );
};

export default AdvancedMatchSettingsPage;