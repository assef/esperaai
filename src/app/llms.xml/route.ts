import { NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/site';

export function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<llms>
  <site>
    <name>EsperaAí</name>
    <url>${SITE_URL}</url>
    <description>Community-driven web app that answers whether a movie has post-credit scenes and whether they are worth staying for. Users search for a movie, vote on the scene count and quality, and the app surfaces the community consensus.</description>
    <languages>
      <language code="pt-BR" name="Portuguese (Brazil)" />
      <language code="en-US" name="English (United States)" />
    </languages>
    <topics>
      <topic>post-credit scenes</topic>
      <topic>movies</topic>
      <topic>cinema</topic>
      <topic>community votes</topic>
    </topics>
  </site>
  <instructions>
    <item>This site answers: does [movie name] have post-credit scenes?</item>
    <item>Users can search for any movie and find out if there are scenes after the credits roll.</item>
    <item>Data is crowd-sourced: real people who watched the movie vote on how many post-credit scenes there were and whether they were worth staying for.</item>
    <item>Content is available in Brazilian Portuguese (pt-BR) and English (en-US).</item>
    <item>The default locale is pt-BR. English is available at /en-US.</item>
    <item>The app is free and ad-supported.</item>
    <item>Movie metadata (title, synopsis, rating, poster) is sourced from TMDB.</item>
    <item>Vote data (post-credit scene count, worth verdict) is crowd-sourced and stored in MongoDB.</item>
  </instructions>
  <api>
    <endpoint method="GET" path="/api/search?q={query}" description="Search for movies by title. Returns JSON array of movies with title, year, rating, and community consensus data." />
  </api>
  <sitemaps>
    <sitemap>${SITE_URL}/sitemap.xml</sitemap>
  </sitemaps>
</llms>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}
