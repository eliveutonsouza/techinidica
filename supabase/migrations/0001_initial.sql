-- TechIndica MVP — Schema inicial
-- Aplique via Supabase Dashboard > SQL Editor ou: supabase db push

-- =============================================================================
-- categorias
-- =============================================================================
create table if not exists public.categorias (
  id bigserial primary key,
  slug text unique not null,
  nome text not null,
  icone text,
  ordem int default 0
);

-- =============================================================================
-- produtos
-- =============================================================================
create table if not exists public.produtos (
  id bigserial primary key,
  plataforma text not null check (plataforma in ('shopee','mercadolivre')),
  platform_id text unique not null,
  nome text not null,
  descricao_curta text,
  preco_atual numeric(10,2) not null,
  preco_original numeric(10,2),
  desconto_pct int default 0,
  link_shopee text,
  link_mercadolivre text,
  imagem_url text,
  categoria text references public.categorias(slug) on delete set null,
  specs jsonb default '{}'::jsonb,
  copy_gerada text,
  pros jsonb default '[]'::jsonb,
  contras jsonb default '[]'::jsonb,
  nota numeric(3,1),
  badge text,
  publicado boolean default false,
  destaque boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists produtos_categoria_idx on public.produtos(categoria);
create index if not exists produtos_publicado_idx on public.produtos(publicado);
create index if not exists produtos_destaque_idx on public.produtos(destaque);

-- =============================================================================
-- affiliate_config
-- =============================================================================
create table if not exists public.affiliate_config (
  id bigserial primary key,
  plataforma text unique not null,
  config jsonb not null default '{}'::jsonb,
  ativo boolean default true,
  updated_at timestamptz default now()
);

-- =============================================================================
-- execucoes_log
-- =============================================================================
create table if not exists public.execucoes_log (
  id bigserial primary key,
  plataforma text not null,
  status text not null check (status in ('success','error','partial')),
  produtos_encontrados int default 0,
  produtos_publicados int default 0,
  erro text,
  created_at timestamptz default now()
);

create index if not exists execucoes_log_created_idx on public.execucoes_log(created_at desc);

-- =============================================================================
-- updated_at trigger
-- =============================================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists produtos_set_updated_at on public.produtos;
create trigger produtos_set_updated_at
  before update on public.produtos
  for each row execute function public.set_updated_at();

drop trigger if exists affiliate_config_set_updated_at on public.affiliate_config;
create trigger affiliate_config_set_updated_at
  before update on public.affiliate_config
  for each row execute function public.set_updated_at();

-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table public.produtos enable row level security;
alter table public.categorias enable row level security;
alter table public.affiliate_config enable row level security;
alter table public.execucoes_log enable row level security;

-- Publico: SELECT em produtos publicados
drop policy if exists "public_read_produtos_publicados" on public.produtos;
create policy "public_read_produtos_publicados" on public.produtos
  for select using (publicado = true);

-- Publico: SELECT em todas as categorias
drop policy if exists "public_read_categorias" on public.categorias;
create policy "public_read_categorias" on public.categorias
  for select using (true);

-- affiliate_config e execucoes_log nao tem policy publica — apenas service_role.
-- service_role bypassa RLS automaticamente, entao mutacoes admin funcionam
-- via SUPABASE_SERVICE_ROLE_KEY no server (lib/supabase/admin.ts).

-- =============================================================================
-- Seed: categorias
-- =============================================================================
insert into public.categorias (slug, nome, icone, ordem) values
  ('smartwatches','Smartwatches','watch',1),
  ('fones','Fones de Ouvido','headphones',2),
  ('notebooks','Notebooks','laptop',3),
  ('monitores','Monitores','monitor',4),
  ('tablets','Tablets','tablet',5),
  ('smartphones','Smartphones','smartphone',6)
on conflict (slug) do nothing;
