import s from './MovieDetailSkeleton.module.css';

export default function Loading() {
  return (
    <div className="detail-layout" aria-hidden>
      {/* Back button */}
      <div className="detail-back-bar">
        <div className={`skeleton ${s.backBtn}`} />
      </div>

      {/* Desktop sticky poster — hidden on mobile via global CSS */}
      <div className="detail-poster-col">
        <div className={`skeleton ${s.posterDesktop}`} />
      </div>

      <div className="detail-main-col">
        {/* Mobile header: small poster + stacked info — hidden on desktop */}
        <div className="detail-mobile-header">
          <div className={`skeleton ${s.posterMobile}`} />
          <div className={s.mobileInfo}>
            <div className={`skeleton ${s.titleLine}`} />
            <div className={`skeleton ${s.titleLine2}`} />
            <div className={`skeleton ${s.meta}`} />
            <div className={`skeleton ${s.worthBadge}`} />
          </div>
        </div>

        {/* Desktop header: large title + meta — hidden on mobile */}
        <div className="detail-desktop-header">
          <div className={`skeleton ${s.titleDesktop}`} />
          <div className={`skeleton ${s.titleDesktop2}`} />
          <div className={`skeleton ${s.meta}`} />
          <div className={`skeleton ${s.worthBadge}`} />
        </div>

        {/* Answer block (vote panel) */}
        <div className={`skeleton ${s.answerBlock}`} />

        {/* Synopsis */}
        <div className={s.synopsis}>
          <div className={`skeleton ${s.synopsisLabel}`} />
          <div className={`skeleton ${s.synopsisLine} ${s.synopsisLineFull}`} />
          <div className={`skeleton ${s.synopsisLine} ${s.synopsisLineFull}`} />
          <div className={`skeleton ${s.synopsisLine} ${s.synopsisLineMid}`} />
        </div>
      </div>
    </div>
  );
}
