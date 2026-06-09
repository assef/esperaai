import { MovieRowSkeleton } from '@/components/MovieRowSkeleton';

export default function Loading() {
  return (
    <main>
      <div className="home-container">
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }} className="home-movie-grid">
          {Array.from({ length: 5 }, (_, i) => (
            <li key={i}>
              <MovieRowSkeleton />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
