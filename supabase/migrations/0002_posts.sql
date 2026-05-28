-- Posts curados (gerados pela IA combinando coleta Shopee + GPT-4o)
create table if not exists public.posts (
  id bigserial primary key,
  slug text unique not null,
  titulo text not null,
  subtitulo text,
  intro text not null,
  conclusao text,
  angulo text not null,
  categoria text references public.categorias(slug) on delete set null,
  produto_ids jsonb not null default '[]'::jsonb,
  itens jsonb not null default '[]'::jsonb,
  fonte text not null default 'cron' check (fonte in ('cron','manual')),
  publicado boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists posts_publicado_idx on public.posts(publicado);
create index if not exists posts_created_idx on public.posts(created_at desc);
create index if not exists posts_categoria_idx on public.posts(categoria);

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

alter table public.posts enable row level security;

drop policy if exists "public_read_posts_publicados" on public.posts;
create policy "public_read_posts_publicados" on public.posts
  for select using (publicado = true);
