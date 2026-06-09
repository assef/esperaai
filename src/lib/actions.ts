'use server';

import { getDb } from './db';
import { computeConsensus } from './consensus';
import type { Consensus } from './types';

interface VotePayload {
  total: number;
  worth: boolean | null;
}

export interface VoteResult {
  reports: Record<string, number>;
  worth: { yes: number; no: number };
  consensus: Consensus;
}

export async function submitVote(movieId: string, payload: VotePayload): Promise<VoteResult> {
  const tmdbId = parseInt(movieId, 10);
  if (isNaN(tmdbId)) throw new Error('Invalid movie ID');

  const db = await getDb();
  const sig = String(payload.total);

  const inc: Record<string, number> = { [`reports.${sig}`]: 1 };
  if (payload.worth === true) inc['worth.yes'] = 1;
  else if (payload.worth === false) inc['worth.no'] = 1;

  const doc = await db.collection('movies').findOneAndUpdate(
    { tmdbId },
    { $inc: inc, $set: { updatedAt: new Date() } },
    { returnDocument: 'after' },
  );

  if (!doc) throw new Error('Movie not found');

  const reports = (doc.reports as Record<string, number>) ?? {};
  const worth = (doc.worth as { yes: number; no: number }) ?? { yes: 0, no: 0 };

  return { reports, worth, consensus: computeConsensus(reports) };
}
