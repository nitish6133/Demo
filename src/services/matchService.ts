import { Match, MatchSummary } from '../types';
import { mockMatches } from '../data/mockData';

const STORAGE_KEY = 'scoremate_matches';

export const saveMatch = async (match: Match): Promise<void> => {
  try {
    // Try to save to backend first
    // const response = await fetch('/api/matches', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(match),
    // });
    // if (!response.ok) throw new Error('Backend save failed');
    
    // Fallback to localStorage
    const existingMatches = getMatchesFromStorage();
    const updatedMatches = existingMatches.filter(m => m.id !== match.id);
    updatedMatches.push(match);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMatches));
  } catch (error) {
    console.warn('Backend unavailable, using localStorage:', error);
    const existingMatches = getMatchesFromStorage();
    const updatedMatches = existingMatches.filter(m => m.id !== match.id);
    updatedMatches.push(match);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMatches));
  }
};

export const getMatches = async (): Promise<MatchSummary[]> => {
  try {
    // Try to fetch from backend first
    // const response = await fetch('/api/matches');
    // if (response.ok) {
    //   return await response.json();
    // }
    throw new Error('Backend not available');
  } catch (error) {
    console.warn('Backend unavailable, using localStorage:', error);
    const matches = getMatchesFromStorage();
    return matches.length > 0 ? matches.map(matchToSummary) : mockMatches;
  }
};

export const getMatchById = async (id: string): Promise<Match | null> => {
  try {
    // Try to fetch from backend first
    // const response = await fetch(`/api/matches/${id}`);
    // if (response.ok) {
    //   return await response.json();
    // }
    throw new Error('Backend not available');
  } catch (error) {
    console.warn('Backend unavailable, using localStorage:', error);
    const matches = getMatchesFromStorage();
    return matches.find(m => m.id === id) || null;
  }
};

const getMatchesFromStorage = (): Match[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to parse matches from localStorage:', error);
    return [];
  }
};

const matchToSummary = (match: Match): MatchSummary => ({
  id: match.id,
  hostTeam: match.hostTeam.name,
  visitorTeam: match.visitorTeam.name,
  status: match.status,
  totalRuns: match.score.totalRuns,
  wickets: match.score.wickets,
  overs: match.score.overs + (match.score.balls / 10),
  createdAt: match.createdAt,
});