import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://techinidica.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [catsRes, prodRes, postsRes] = await Promise.all([
    supabase.from('categorias').select('slug'),
    supabase.from('produtos').select('id, updated_at').eq('publicado', true),
    supabase.from('posts').select('slug, updated_at').eq('publicado', true),
  ]);

  const categorias: MetadataRoute.Sitemap = (catsRes.data ?? []).map((c) => ({
    url: `${siteUrl}/categoria/${c.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const produtos: MetadataRoute.Sitemap = (prodRes.data ?? []).map((p) => ({
    url: `${siteUrl}/produto/${p.id}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const posts: MetadataRoute.Sitemap = (postsRes.data ?? []).map((p) => ({
    url: `${siteUrl}/post/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    {
      url: siteUrl,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...categorias,
    ...produtos,
    ...posts,
  ];
}
