export type Locale = 'pt-BR' | 'en-US';
export type Theme = 'dark' | 'light';

export interface Movie {
  id: string;              // TMDB id as string — used in URLs
  tmdbId: number;
  title: Record<Locale, string>;
  originalTitle: string;
  year: number;
  runtime: number;
  rating: number;
  hue: number;             // derived: tmdbId % 360, for poster placeholder
  posterPath: string | null;
  reports: Record<string, number>;
  worth: { yes: number; no: number };
  synopsis: Record<Locale, string>;
}

export interface Consensus {
  hasData: boolean;
  total: number;
  totalVotes: number;
  confirmations: number;
  agreement: number;
}

export interface UserVote {
  reports: Record<string, number>;
  worth: { yes: number; no: number };
}

export type UserVotes = Record<string, UserVote>;
