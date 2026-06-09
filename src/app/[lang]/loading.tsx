import { MovieRowSkeleton } from '@/components/MovieRowSkeleton';

export default function Loading() {
  return (
    <main>
      <div className="home-container">
        {/* TopBar skeleton */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
          <div>
            <div className="skeleton" style={{ width: 120, height: 26, borderRadius: 6 }} />
            <div className="skeleton" style={{ width: 160, height: 14, borderRadius: 4, marginTop: 6 }} />
          </div>
          <div className="skeleton" style={{ width: 72, height: 38, borderRadius: 11 }} />
        </div>

        {/* SearchField skeleton */}
        <div className="skeleton" style={{ height: 54, borderRadius: 16 }} />

        {/* Section heading skeleton */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="skeleton" style={{ width: 180, height: 16, borderRadius: 4 }} />
          <div className="skeleton" style={{ width: 8, height: 8, borderRadius: 99 }} />
        </div>

        {/* Movie list skeletons */}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }} className="home-movie-grid">
          {Array.from({ length: 5 }, (_, i) => (
            <li key={i}><MovieRowSkeleton /></li>
          ))}
        </ul>
      </div>
    </main>
  );
}
