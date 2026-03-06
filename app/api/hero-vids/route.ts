import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data, error } = await supabase.storage
    .from('HERO VIDS')
    .list(undefined, { limit: 100, sortBy: { column: 'name', order: 'asc' } });

  if (error || !data) return NextResponse.json({ urls: [] });

  const urls = data
    .filter(f => /\.(mp4|mov|webm)$/i.test(f.name))
    .map(f => supabase.storage.from('HERO VIDS').getPublicUrl(f.name).data.publicUrl);

  return NextResponse.json({ urls }, {
    headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=7200' },
  });
}
