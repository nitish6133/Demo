import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Match, MatchScore, BatsmanScore, BowlerScore } from '../types';

interface MatchState {
  currentMatch: Match | null;
  isLoading: boolean;
  error: string | null;
}

type MatchAction =
  | { type: 'SET_MATCH'; payload: Match }
  | { type: 'UPDATE_SCORE'; payload: Partial<MatchScore> }
  | { type: 'ADD_RUNS'; payload: number }
  | { type: 'ADD_WICKET' }
  | { type: 'ADD_EXTRA'; payload: { type: string; runs: number } }
  | { type: 'NEXT_BALL' }
  | { type: 'UNDO_LAST_BALL' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_MATCH' };

const initialState: MatchState = {
  currentMatch: null,
  isLoading: false,
  error: null,
};

const matchReducer = (state: MatchState, action: MatchAction): MatchState => {
  switch (action.type) {
    case 'SET_MATCH':
      return {
        ...state,
        currentMatch: action.payload,
        error: null,
      };

    case 'UPDATE_SCORE':
      if (!state.currentMatch) return state;
      return {
        ...state,
        currentMatch: {
          ...state.currentMatch,
          score: {
            ...state.currentMatch.score,
            ...action.payload,
          },
        },
      };

    case 'ADD_RUNS':
      if (!state.currentMatch) return state;
      const newScore = {
        ...state.currentMatch.score,
        totalRuns: state.currentMatch.score.totalRuns + action.payload,
        currentOver: [...state.currentMatch.score.currentOver, action.payload.toString()],
      };
      
      // Update striker's score
      newScore.batsmen.striker.runs += action.payload;
      newScore.batsmen.striker.balls += 1;
      if (action.payload === 4) newScore.batsmen.striker.fours += 1;
      if (action.payload === 6) newScore.batsmen.striker.sixes += 1;
      newScore.batsmen.striker.strikeRate = 
        newScore.batsmen.striker.balls > 0 
          ? (newScore.batsmen.striker.runs / newScore.batsmen.striker.balls) * 100 
          : 0;

      // Update bowler's score
      newScore.bowler.runs += action.payload;

      return {
        ...state,
        currentMatch: {
          ...state.currentMatch,
          score: newScore,
        },
      };

    case 'ADD_WICKET':
      if (!state.currentMatch) return state;
      const wicketScore = {
        ...state.currentMatch.score,
        wickets: state.currentMatch.score.wickets + 1,
        currentOver: [...state.currentMatch.score.currentOver, 'W'],
      };
      
      // Add fall of wicket
      wicketScore.fallOfWickets.push({
        wicketNumber: wicketScore.wickets,
        runs: wicketScore.totalRuns,
        overs: wicketScore.overs,
        balls: wicketScore.balls,
        batsman: wicketScore.batsmen.striker.name,
      });

      // Mark striker as out
      wicketScore.batsmen.striker.isOut = true;
      wicketScore.bowler.wickets += 1;

      return {
        ...state,
        currentMatch: {
          ...state.currentMatch,
          score: wicketScore,
        },
      };

    case 'NEXT_BALL':
      if (!state.currentMatch) return state;
      let nextBallScore = { ...state.currentMatch.score };
      nextBallScore.balls += 1;
      
      if (nextBallScore.balls === 6) {
        nextBallScore.overs += 1;
        nextBallScore.balls = 0;
        nextBallScore.currentOver = [];
        
        // Update bowler's overs
        nextBallScore.bowler.overs = Math.floor(nextBallScore.bowler.overs) + 1;
        nextBallScore.bowler.economy = 
          nextBallScore.bowler.overs > 0 
            ? nextBallScore.bowler.runs / nextBallScore.bowler.overs 
            : 0;
      }

      return {
        ...state,
        currentMatch: {
          ...state.currentMatch,
          score: nextBallScore,
        },
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'CLEAR_MATCH':
      return {
        ...state,
        currentMatch: null,
        error: null,
      };

    default:
      return state;
  }
};

const MatchContext = createContext<{
  state: MatchState;
  dispatch: React.Dispatch<MatchAction>;
} | null>(null);

export const MatchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(matchReducer, initialState);

  return (
    <MatchContext.Provider value={{ state, dispatch }}>
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
};