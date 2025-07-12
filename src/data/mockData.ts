import { MatchSettings, Match, MatchSummary } from '../types';

export const mockMatchSettings: MatchSettings = {
  playersPerTeam: 11,
  noBallReball: true,
  noBallRun: 1,
  wideBallReball: true,
  wideBallRun: 1,
};

export const mockMatches: MatchSummary[] = [
  {
    id: '1',
    hostTeam: 'Mumbai Indians',
    visitorTeam: 'Chennai Super Kings',
    status: 'completed',
    totalRuns: 185,
    wickets: 6,
    overs: 20,
    createdAt: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    hostTeam: 'Royal Challengers',
    visitorTeam: 'Delhi Capitals',
    status: 'in_progress',
    totalRuns: 89,
    wickets: 3,
    overs: 12,
    createdAt: '2024-01-14T16:00:00Z'
  }
];

export const generatePlayers = (teamName: string, count: number): string[] => {
  return Array.from({ length: count }, (_, i) => `${teamName} Player ${i + 1}`);
};