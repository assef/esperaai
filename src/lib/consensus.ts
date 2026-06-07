import type { Consensus, UserVote } from './types';

export function mergeReports(
  base: Record<string, number>,
  extra?: Record<string, number>,
): Record<string, number> {
  const r = { ...base };
  for (const [k, v] of Object.entries(extra ?? {})) {
    r[k] = (r[k] ?? 0) + v;
  }
  return r;
}

/** Mathematical mode of the reports frequency map. Tie breaks toward more scenes. */
export function computeConsensus(reports: Record<string, number>): Consensus {
  const entries = Object.entries(reports ?? {});
  const totalVotes = entries.reduce((s, [, n]) => s + n, 0);

  if (totalVotes === 0) {
    return { hasData: false, total: 0, totalVotes: 0, confirmations: 0, mid: 0, post: 0, agreement: 0 };
  }

  let best: { sig: string; n: number; mid: number; post: number; scenes: number } | null = null;

  for (const [sig, n] of entries) {
    const [mid, post] = sig.split('-').map(Number);
    const scenes = mid + post;
    if (!best || n > best.n || (n === best.n && scenes > best.scenes)) {
      best = { sig, n, mid, post, scenes };
    }
  }

  if (!best) {
    return { hasData: false, total: 0, totalVotes: 0, confirmations: 0, mid: 0, post: 0, agreement: 0 };
  }

  return {
    hasData: true,
    confirmations: best.n,
    totalVotes,
    mid: best.mid,
    post: best.post,
    total: best.mid + best.post,
    agreement: Math.round((best.n / totalVotes) * 100),
  };
}

/** Returns true if worth waiting, false if not, null if not enough votes. */
export function worthVerdict(worth: { yes: number; no: number }): boolean | null {
  const total = (worth?.yes ?? 0) + (worth?.no ?? 0);
  if (total < 5) return null;
  return worth.yes >= worth.no;
}

export function mergeWorth(
  base: { yes: number; no: number },
  extra?: { yes: number; no: number },
): { yes: number; no: number } {
  return {
    yes: base.yes + (extra?.yes ?? 0),
    no: base.no + (extra?.no ?? 0),
  };
}
