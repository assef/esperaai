export type Locale = 'pt-BR' | 'en-US';
export type Theme = 'dark' | 'light';

export interface Movie {
  id: string;
  title: Record<Locale, string>;
  year: number;
  runtime: number;
  rating: number;
  hue: number;
  /** TMDB poster_path — null until API integrated */
  posterPath: string | null;
  /** Frequency map: "mid-post" signature → vote count */
  reports: Record<string, number>;
  worth: { yes: number; no: number };
  synopsis: Record<Locale, string>;
}

export interface Consensus {
  hasData: boolean;
  total: number;
  totalVotes: number;
  confirmations: number;
  mid: number;
  post: number;
  agreement: number;
}

export interface UserVote {
  reports: Record<string, number>;
  worth: { yes: number; no: number };
}

export type UserVotes = Record<string, UserVote>;
