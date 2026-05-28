import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { AdminShell } from '@/components/admin/admin-shell';
import { PostSchema, type Post } from '@/schemas';
import { PostsTable } from './posts-table';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Posts', robots: { index: false, follow: false } };

async function load(): Promise<Post[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  return (data ?? [])
    .map((p) => PostSchema.safeParse(p))
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
