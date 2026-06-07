import type { Movie } from './types';

/**
 * Mock movie data — TMDB-style shape.
 * When API integration lands, replace this with a fetch to /api/movies.
 * posterPath is null here; real implementation will use TMDB image URL.
 */
const MOVIES: Movie[] = [
  {
    id: 'thunderbolts',
    title: { 'pt-BR': 'Thunderbolts*', 'en-US': 'Thunderbolts*' },
    year: 2025, runtime: 126, rating: 7.6, hue: 12, posterPath: null,
    reports: { '1-1': 184, '0-2': 11, '0-1': 6 },
    worth: { yes: 142, no: 9 },
    synopsis: {
      'pt-BR': 'Um grupo de anti-heróis e vilões é recrutado para uma missão de alto risco que pode redefinir o destino de todos eles.',
      'en-US': 'A group of antiheroes and villains is drafted for a high-stakes mission that could reshape all of their fates.',
    },
  },
  {
    id: 'dune2',
    title: { 'pt-BR': 'Duna: Parte Dois', 'en-US': 'Dune: Part Two' },
    year: 2024, runtime: 166, rating: 8.2, hue: 38, posterPath: null,
    reports: { '0-0': 263, '0-1': 4 },
    worth: { yes: 2, no: 38 },
    synopsis: {
      'pt-BR': 'Paul Atreides se une aos Fremen em uma jornada de vingança contra os que destruíram sua família.',
      'en-US': 'Paul Atreides unites with the Fremen on a path of revenge against those who destroyed his family.',
    },
  },
  {
    id: 'sonic3',
    title: { 'pt-BR': 'Sonic 3: O Filme', 'en-US': 'Sonic the Hedgehog 3' },
    year: 2024, runtime: 110, rating: 7.0, hue: 235, posterPath: null,
    reports: { '1-1': 96, '2-0': 7 },
    worth: { yes: 71, no: 12 },
    synopsis: {
      'pt-BR': 'Sonic, Tails e Knuckles enfrentam um novo e poderoso adversário com motivações pessoais.',
      'en-US': 'Sonic, Tails and Knuckles face a powerful new adversary with personal motives.',
    },
  },
  {
    id: 'deadpool-wolverine',
    title: { 'pt-BR': 'Deadpool & Wolverine', 'en-US': 'Deadpool & Wolverine' },
    year: 2024, runtime: 128, rating: 7.7, hue: 4, posterPath: null,
    reports: { '0-1': 158, '1-0': 5 },
    worth: { yes: 121, no: 7 },
    synopsis: {
      'pt-BR': 'Um Deadpool relutante junta forças com um Wolverine ainda mais relutante para salvar seu universo.',
      'en-US': 'A reluctant Deadpool teams up with an even more reluctant Wolverine to save his universe.',
    },
  },
  {
    id: 'wicked',
    title: { 'pt-BR': 'Wicked', 'en-US': 'Wicked' },
    year: 2024, runtime: 160, rating: 7.4, hue: 150, posterPath: null,
    reports: {},
    worth: { yes: 0, no: 0 },
    synopsis: {
      'pt-BR': 'A improvável amizade entre duas jovens em Oz, antes de uma se tornar a Bruxa Boa e a outra a Bruxa Má.',
      'en-US': 'The unlikely friendship between two young women in Oz, before one becomes Glinda and the other the Wicked Witch.',
    },
  },
  {
    id: 'inside-out-2',
    title: { 'pt-BR': 'Divertida Mente 2', 'en-US': 'Inside Out 2' },
    year: 2024, runtime: 96, rating: 7.6, hue: 280, posterPath: null,
    reports: { '0-0': 88, '0-1': 21 },
    worth: { yes: 9, no: 34 },
    synopsis: {
      'pt-BR': 'A mente da adolescente Riley ganha novas e caóticas emoções, lideradas pela Ansiedade.',
      'en-US': "Teenage Riley's mind gains chaotic new emotions, led by Anxiety.",
    },
  },
  {
    id: 'moana-2',
    title: { 'pt-BR': 'Moana 2', 'en-US': 'Moana 2' },
    year: 2024, runtime: 100, rating: 6.9, hue: 195, posterPath: null,
    reports: { '0-1': 73 },
    worth: { yes: 44, no: 11 },
    synopsis: {
      'pt-BR': 'Moana parte em uma nova viagem pelos mares distantes da Oceania ao lado de Maui e uma nova tripulação.',
      'en-US': 'Moana sets out on a new voyage across the far seas of Oceania alongside Maui and a fresh crew.',
    },
  },
  {
    id: 'gladiator-2',
    title: { 'pt-BR': 'Gladiador II', 'en-US': 'Gladiator II' },
    year: 2024, runtime: 148, rating: 6.7, hue: 30, posterPath: null,
    reports: { '0-0': 134 },
    worth: { yes: 1, no: 19 },
    synopsis: {
      'pt-BR': 'Anos após a queda de Maximus, Lucius é forçado a entrar no Coliseu e lutar por sua liberdade e por Roma.',
      'en-US': 'Years after Maximus, Lucius is forced into the Colosseum to fight for his freedom and for Rome.',
    },
  },
];

/** All movies — replace with API call when integrated. */
export async function getMovies(): Promise<Movie[]> {
  return MOVIES;
}

/** Single movie by id — replace with API call when integrated. */
export async function getMovie(id: string): Promise<Movie | null> {
  return MOVIES.find((m) => m.id === id) ?? null;
}

/** Search movies by title — replace with TMDB search when integrated. */
export async function searchMovies(query: string): Promise<Movie[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return MOVIES.filter((m) =>
    Object.values(m.title).some((t) => t.toLowerCase().includes(q)),
  );
}

/** Poster gradient for placeholder — remove when TMDB images are integrated. */
export function posterGradient(hue: number): string {
  return `linear-gradient(150deg, oklch(0.42 0.11 ${hue}) 0%, oklch(0.22 0.07 ${(hue + 28) % 360}) 100%)`;
}

export { MOVIES };
