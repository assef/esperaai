'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Poster } from '@/components/ui/Poster';
import { AdSlot } from '@/components/ui/AdSlot';
import { Button } from '@/components/ui/Button';
import { AnswerBlock } from '@/components/AnswerBlock';
import { WorthBadge } from '@/components/WorthBadge';
import { VoteSheet } from '@/components/VoteSheet';
import { BackIcon, StarIcon, ClockIcon, UsersIcon, EditIcon } from '@/components/ui/Icon';
import { Dot } from '@/components/ui/Dot';
import { computeConsensus, mergeReports, mergeWorth, worthVerdict } from '@/lib/consensus';
import { useVotes } from '@/contexts/VotesContext';
import { mkT } from '@/lib/format';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/types';
import type { Movie } from '@/lib/types';

interface MovieDetailScreenProps {
  dict: Dictionary;
  lang: Locale;
  movie: Movie;
}

export function MovieDetailScreen({ dict, lang, movie }: MovieDetailScreenProps) {
  const t = mkT(dict);
  const { userVotes, submitVote } = useVotes();
  const [voteOpen, setVoteOpen] = useState(false);

  const userVote = userVotes[movie.id];
  const mergedReports = mergeReports(movie.reports, userVote?.reports);
  const mergedWorth = mergeWorth(movie.worth, userVote?.worth);
  const consensus = computeConsensus(mergedReports);
  const verdict = worthVerdict(mergedWorth);

  const metaInfo = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        color: 'var(--muted)',
        fontSize: 13.5,
        fontWeight: 600,
        flexWrap: 'wrap',
      }}
    >
      <span>{movie.year}</span>
      <Dot />
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
        <ClockIcon size={14} />
        {movie.runtime} {t.minutes}
      </span>
      <Dot />
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text)' }}>
        <span style={{ color: 'var(--accent)', display: 'inline-flex' }}>
          <StarIcon size={14} />
        </span>
        <span aria-label={`Nota ${movie.rating.toFixed(1)}`}>{movie.rating.toFixed(1)}</span>
      </span>
    </div>
  );

  return (
    <div className="detail-layout">
      {/* Back button — spans full grid width on desktop */}
      <div className="detail-back-bar">
        <Link
          href={`/${lang}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            height: 40,
            padding: '0 14px 0 10px',
            borderRadius: 12,
            background: 'var(--bg-elev)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            textDecoration: 'none',
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            fontSize: 14.5,
          }}
        >
          <BackIcon size={19} />
          {t.back}
        </Link>
      </div>

      {/* Desktop left column: large poster (hidden on mobile) */}
      <aside className="detail-poster-col" aria-hidden="true">
        <Poster movie={movie} lang={lang} width={320} height={464} radius={18} showLabel />
      </aside>

      {/* Main content column */}
      <div className="detail-main-col">
        {/* Mobile only: compact header with small poster + title */}
        <div className="detail-mobile-header">
          <Poster movie={movie} lang={lang} width={92} height={134} radius={14} showLabel />
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <h1 className="detail-title">{movie.title[lang]}</h1>
            {metaInfo}
            {verdict !== null && <WorthBadge verdict={verdict} t={t} />}
          </div>
        </div>

        {/* Desktop only: title + meta at top of right column */}
        <div className="detail-desktop-header">
          <h1 className="detail-title">{movie.title[lang]}</h1>
          {metaInfo}
          {verdict !== null && <WorthBadge verdict={verdict} t={t} />}
        </div>

        {/* Content: same on both breakpoints */}
        <AnswerBlock consensus={consensus} t={t} onContribute={() => setVoteOpen(true)} />

        {consensus.hasData && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: 'var(--muted)',
                fontSize: 13.5,
                fontWeight: 600,
              }}
            >
              <UsersIcon size={17} />
              <span>
                {t.confirmedBy(consensus.totalVotes)} · {consensus.agreement}%
              </span>
            </div>

            <Button
              variant="ghost"
              onClick={() => setVoteOpen(true)}
              style={{ height: 40, padding: '0 14px', fontSize: 13.5, gap: 7, borderRadius: 12 }}
            >
              <EditIcon size={16} />
              {t.contribute}
            </Button>
          </div>
        )}

        {/* Synopsis — before ad on desktop (CSS order handles swap on mobile) */}
        <section className="detail-synopsis">
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'var(--faint)',
              marginBottom: 8,
              marginTop: 0,
            }}
          >
            {t.synopsis}
          </h2>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.55,
              color: 'var(--muted)',
              margin: 0,
            }}
          >
            {movie.synopsis[lang]}
          </p>
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
          onSubmit={(payload) => submitVote(movie.id, payload)}
        />
      )}
    </div>
  );
}
