'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { sendGAEvent } from '@next/third-parties/google';
import Link from 'next/link';
import { Poster } from '@/components/ui/Poster';
import { AdSlot } from '@/components/ui/AdSlot';
import { Button } from '@/components/ui/Button';
import { AnswerBlock } from '@/components/AnswerBlock';
import { WorthBadge } from '@/components/WorthBadge';
import { VoteSheet } from '@/components/VoteSheet';
import { BackIcon, StarIcon, ClockIcon, UsersIcon, EditIcon } from '@/components/ui/Icon';
import { Dot } from '@/components/ui/Dot';
import { computeConsensus, worthVerdict } from '@/lib/consensus';
import { submitVote } from '@/lib/actions';
import { mkT } from '@/lib/format';
import styles from './MovieDetailScreen.module.css';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale, Movie } from '@/lib/types';

interface MovieDetailScreenProps {
  dict: Dictionary;
  lang: Locale;
  movie: Movie;
}

export function MovieDetailScreen({ dict, lang, movie }: MovieDetailScreenProps) {
  const t = mkT(dict);
  const searchParams = useSearchParams();
  const backQuery = searchParams.get('s');
  const backHref = backQuery ? `/${lang}?s=${encodeURIComponent(backQuery)}` : `/${lang}`;
  const [voteOpen, setVoteOpen] = useState(false);
  const [reports, setReports] = useState(() => movie.reports);
  const [worth, setWorth] = useState(() => movie.worth);

  const consensus = useMemo(() => computeConsensus(reports), [reports]);
  const verdict = useMemo(() => worthVerdict(worth), [worth]);

  const openVoteSheet = () => {
    sendGAEvent('event', 'vote_open', {
      movie_id: movie.id,
      movie_title: movie.title[lang],
    });
    setVoteOpen(true);
  };

  const handleVote = async (payload: { total: number; worth: boolean | null }) => {
    sendGAEvent('event', 'vote', {
      movie_id: movie.id,
      movie_title: movie.title[lang],
      scenes: payload.total,
      worth: payload.worth,
    });

    const sig = String(payload.total);
    setReports((prev) => ({ ...prev, [sig]: (prev[sig] ?? 0) + 1 }));
    if (payload.worth === true) setWorth((prev) => ({ ...prev, yes: prev.yes + 1 }));
    else if (payload.worth === false) setWorth((prev) => ({ ...prev, no: prev.no + 1 }));

    try {
      const result = await submitVote(movie.id, payload);
      setReports(result.reports);
      setWorth(result.worth);
    } catch {
      // Keep optimistic state — vote likely still saved
    }
  };

  const metaInfo = (
    <div className={styles.meta}>
      <span>{movie.year}</span>
      <Dot />
      <span className={styles.metaRuntime}>
        <ClockIcon size={14} />
        {movie.runtime} {t.minutes}
      </span>
      <Dot />
      <span className={styles.metaRating}>
        <span className={styles.metaRatingIcon}><StarIcon size={14} /></span>
        <span aria-label={`Nota ${movie.rating.toFixed(1)}`}>{movie.rating.toFixed(1)}</span>
      </span>
    </div>
  );

  return (
    <div className="detail-layout">
      <div className="detail-back-bar">
        <Link href={backHref} className={styles.backLink}>
          <BackIcon size={19} />
          {t.back}
        </Link>
      </div>

      <aside className="detail-poster-col" aria-hidden="true">
        <Poster movie={movie} lang={lang} width={320} height={464} radius={18} showLabel />
      </aside>

      <div className="detail-main-col">
        <div className="detail-mobile-header">
          <Poster movie={movie} lang={lang} width={92} height={134} radius={14} showLabel />
          <div className={styles.mobileHeaderInfo}>
            <h1 className="detail-title">{movie.title[lang]}</h1>
            {metaInfo}
            {verdict !== null && <WorthBadge verdict={verdict} t={t} />}
          </div>
        </div>

        <div className="detail-desktop-header">
          <h1 className="detail-title">{movie.title[lang]}</h1>
          {metaInfo}
          {verdict !== null && <WorthBadge verdict={verdict} t={t} />}
        </div>

        <AnswerBlock consensus={consensus} t={t} onContribute={() => openVoteSheet()} />

        {consensus.hasData && (
          <div className={styles.contributeRow}>
            <div className={styles.contributeMeta}>
              <UsersIcon size={17} />
              <span>{t.confirmedBy(consensus.totalVotes)} · {consensus.agreement}%</span>
            </div>
            <Button
              variant="ghost"
              onClick={() => openVoteSheet()}
              style={{ height: 40, padding: '0 14px', fontSize: 13.5, gap: 7, borderRadius: 12 }}
            >
              <EditIcon size={16} />
              {t.contribute}
            </Button>
          </div>
        )}

        <section className="detail-synopsis">
          <h2 className={styles.synopsisHeading}>{t.synopsis}</h2>
          <p className={styles.synopsisText}>{movie.synopsis[lang]}</p>
        </section>

        <div className="detail-ad">
          <AdSlot t={t} height={100} />
        </div>
      </div>

      {voteOpen && (
        <VoteSheet
          t={t}
          movieTitle={movie.title[lang]}
          onClose={() => setVoteOpen(false)}
          onSubmit={handleVote}
        />
      )}
    </div>
  );
}
