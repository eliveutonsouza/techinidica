-- Newsletter subscribers table
-- Aplique no SQL Editor do Supabase Dashboard.

create table if not exists newsletter_subscribers (
  id           bigserial primary key,
  email        text unique not null,
  ativo        boolean not null default true,
  created_at   timestamptz not null default now()
);

-- RLS: somente service_role pode ler/escrever
alter table newsletter_subscribers enable row level security;

create policy "service_role_full" on newsletter_subscribers
  for all using (auth.role() = 'service_role');

-- Index para lookup por email
create index if not exists idx_newsletter_email on newsletter_subscribers(email);
