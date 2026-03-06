import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const product = searchParams.get('product');
  const colorway = searchParams.get('colorway');

  if (!product || !colorway) return NextResponse.json({ urls: [] });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const path = `${product.toUpperCase()}/${colorway.toUpperCase()}`;
  const { data, error } = await supabase.storage
    .from('PRODUCTS')
    .list(path, { limit: 100, sortBy: { column: 'name', order: 'asc' } });

  if (error || !data) return NextResponse.json({ urls: [], debug: { path, error: error?.message } });

  const urls = data
    .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f.name))
    .map(f => supabase.storage.from('PRODUCTS').getPublicUrl(`${path}/${f.name}`).data.publicUrl);

  return NextResponse.json({ urls, debug: { path, files: data.map(f => f.name) } }, {
    headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=600' },
  });
}
