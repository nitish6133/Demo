export interface Team {
  name: string;
  players: string[];
}

export interface MatchSettings {
  playersPerTeam: number;
  noBallReball: boolean;
  noBallRun: number;
  wideBallReball: boolean;
  wideBallRun: number;
}

export interface Match {
  id: string;
  hostTeam: Team;
  visitorTeam: Team;
  tossWinner: string;
  electedTo: 'bat' | 'bowl';
  overs: number;
  settings: MatchSettings;
  score: MatchScore;
  status: 'not_started' | 'in_progress' | 'completed';
  createdAt: string;
  currentInning: 1 | 2;
  battingTeam: string;
  bowlingTeam: string;
}

export interface MatchScore {
  totalRuns: number;
  wickets: number;
  overs: number;
  balls: number;
  currentOver: string[];
  extras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
    total: number;
  };
  batsmen: {
    striker: BatsmanScore;
    nonStriker: BatsmanScore;
  };
  bowler: BowlerScore;
  fallOfWickets: FallOfWicket[];
}

export interface BatsmanScore {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  dismissalType?: string;
}

export interface BowlerScore {
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

export interface FallOfWicket {
  wicketNumber: number;
  runs: number;
  overs: number;
  balls: number;
  batsman: string;
}

export interface MatchSummary {
  id: string;
  hostTeam: string;
  visitorTeam: string;
  status: string;
  totalRuns: number;
  wickets: number;
  overs: number;
  createdAt: string;
}