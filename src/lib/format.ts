import type { Dictionary } from './dictionaries';

export function mkT(dict: Dictionary) {
  return {
    ...dict,
    confirmedBy: (n: number) =>
      n === 1 ? dict.confirmedBy_one : dict.confirmedBy_many.replace('{n}', String(n)),
    votesShort: (n: number) =>
      n === 1 ? dict.votesShort_one : dict.votesShort_many.replace('{n}', String(n)),
  };
}

export type T = ReturnType<typeof mkT>;
