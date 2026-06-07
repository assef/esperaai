'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { UserVote, UserVotes } from '@/lib/types';

interface VotePayload {
  mid: number;
  post: number;
  worth: boolean | null;
}

interface VotesContextValue {
  userVotes: UserVotes;
  submitVote: (movieId: string, payload: VotePayload) => void;
}

const VotesContext = createContext<VotesContextValue | null>(null);

export function VotesProvider({ children }: { children: React.ReactNode }) {
  const [userVotes, setUserVotes] = useState<UserVotes>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem('esperaai.votes');
      if (stored) setUserVotes(JSON.parse(stored));
    } catch {}
  }, []);

  const submitVote = (movieId: string, { mid, post, worth }: VotePayload) => {
    setUserVotes((prev) => {
      const cur: UserVote = prev[movieId] ?? { reports: {}, worth: { yes: 0, no: 0 } };
      const sig = `${mid}-${post}`;
      const reports = { ...cur.reports, [sig]: (cur.reports[sig] ?? 0) + 1 };
      const w = { ...cur.worth };
      if (worth === true) w.yes += 1;
      else if (worth === false) w.no += 1;
      const next = { ...prev, [movieId]: { reports, worth: w } };
      try { localStorage.setItem('esperaai.votes', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  return (
    <VotesContext.Provider value={{ userVotes, submitVote }}>
      {children}
    </VotesContext.Provider>
  );
}

export function useVotes() {
  const ctx = useContext(VotesContext);
  if (!ctx) throw new Error('useVotes must be used within VotesProvider');
  return ctx;
}
