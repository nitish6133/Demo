import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Header from '../components/Header';
import ToggleSwitch from '../components/ToggleSwitch';
import { useSettings } from '../contexts/SettingsContext';
import { MatchSettings } from '../types';

const AdvancedMatchSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, isLoading } = useSettings();
  const [localSettings, setLocalSettings] = useState<MatchSettings>(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      updateSettings(localSettings);
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
      setLocalSettings(prev => ({ ...prev, playersPerTeam: numValue }));
    }
  };

  const handleNoBallRunChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 6) {
      setLocalSettings(prev => ({ ...prev, noBallRun: numValue }));
    }
  };

  const handleWideBallRunChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 6) {
      setLocalSettings(prev => ({ ...prev, wideBallRun: numValue }));
    }
  };

  if (isLoading) {
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
      <div className="bg-white rounded-lg shadow-md">
        <Header title="Match Settings" showBack backTo="/new-match" />
        
        <div className="p-6 space-y-6">
          {/* Players per team */}
          <div>
            <label className="block text-lg font-medium text-primary mb-3">
              Players per team?
            </label>
            <div className="bg-gray-50 p-4 rounded-lg">
              <input
                type="number"
                value={localSettings.playersPerTeam}
                onChange={(e) => handlePlayersPerTeamChange(e.target.value)}
                min="0"
                max="15"
                className="w-full text-lg font-medium border-b-2 border-gray-300 focus:border-primary outline-none bg-transparent pb-2"
              />
            </div>
          </div>

          {/* No Ball Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-lg font-medium text-primary">No Ball</label>
              <ToggleSwitch checked={true} onChange={() => {}} disabled />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-800">Re-ball</span>
                <ToggleSwitch
                  checked={localSettings.noBallReball}
                  onChange={(checked) => setLocalSettings(prev => ({ ...prev, noBallReball: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-800">No ball run</span>
                <input
                  type="number"
                  value={localSettings.noBallRun}
                  onChange={(e) => handleNoBallRunChange(e.target.value)}
                  min="0"
                  max="6"
                  className="w-16 text-lg font-medium text-right border-b-2 border-gray-300 focus:border-primary outline-none bg-transparent pb-1"
                />
              </div>
            </div>
          </div>

          {/* Wide Ball Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-lg font-medium text-primary">Wide Ball</label>
              <ToggleSwitch checked={true} onChange={() => {}} disabled />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-800">Re-ball</span>
                <ToggleSwitch
                  checked={localSettings.wideBallReball}
                  onChange={(checked) => setLocalSettings(prev => ({ ...prev, wideBallReball: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-800">Wide ball run</span>
                <input
                  type="number"
                  value={localSettings.wideBallRun}
                  onChange={(e) => handleWideBallRunChange(e.target.value)}
                  min="0"
                  max="6"
                  className="w-16 text-lg font-medium text-right border-b-2 border-gray-300 focus:border-primary outline-none bg-transparent pb-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="p-6 pt-0">
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="w-full py-4 bg-primary text-white text-lg font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default AdvancedMatchSettingsPage;