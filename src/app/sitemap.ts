import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://techinidica.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [catsRaw, prodRaw, postsRaw] = await prisma.$transaction([
    prisma.categoria.findMany({ select: { slug: true } }),
    prisma.produto.findMany({ where: { publicado: true }, select: { id: true, updated_at: true } }),
    prisma.post.findMany({ where: { publicado: true }, select: { slug: true, updated_at: true } }),
  ]);

  const categorias: MetadataRoute.Sitemap = catsRaw.map((c) => ({
    url: `${siteUrl}/categoria/${c.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const produtos: MetadataRoute.Sitemap = prodRaw.map((p) => ({
    url: `${siteUrl}/produto/${p.id}`,
    lastModified: p.updated_at,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const posts: MetadataRoute.Sitemap = postsRaw.map((p) => ({
    url: `${siteUrl}/post/${p.slug}`,
    lastModified: p.updated_at,
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
