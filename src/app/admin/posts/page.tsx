import Link from 'next/link';
import { prisma, serializeDates } from '@/lib/prisma';
import { AdminShell } from '@/components/admin/admin-shell';
import { PostSchema, type Post } from '@/schemas';
import { PostsTable } from './posts-table';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Posts', robots: { index: false, follow: false } };

async function load(): Promise<Post[]> {
  const rows = await prisma.post.findMany({ orderBy: { created_at: 'desc' } });
  return rows
    .map((p) => PostSchema.safeParse(serializeDates(p)))
    .filter((r) => r.success)
    .map((r) => r.data as Post);
}

export default async function AdminPostsPage() {
  const posts = await load();
  return (
    <AdminShell
      current="posts"
      title="Posts curados"
      subtitle={`${posts.length} post${posts.length === 1 ? '' : 's'} gerados pela IA`}
      actions={
        <Link
          href="/admin/automacao"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#0f172a',
            color: '#fff',
            padding: '8px 14px',
            borderRadius: 8,
            textDecoration: 'none',
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Gerar novo post
        </Link>
      }
    >
      <PostsTable initial={posts} />
    </AdminShell>
  );
}
