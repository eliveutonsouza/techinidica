-- Admin users table para suporte a múltiplos usuários via Supabase Auth.
-- Após aplicar esta migration:
--   1. Crie usuários em Authentication > Users no Supabase Dashboard.
--   2. Insira o user_id do usuário criado nesta tabela com o role desejado.
--   3. O middleware aceita tanto iron-session (password único) quanto Supabase Auth JWT.
--
-- Aplique no SQL Editor do Supabase Dashboard.

create table if not exists admin_users (
  id          bigserial primary key,
  user_id     uuid unique not null references auth.users(id) on delete cascade,
  role        text not null default 'editor' check (role in ('owner', 'editor')),
  nome        text,
  created_at  timestamptz not null default now()
);

-- RLS: somente service_role
alter table admin_users enable row level security;

create policy "service_role_full" on admin_users
  for all using (auth.role() = 'service_role');

-- Permite que o próprio usuário autenticado leia seu registro
create policy "user_read_own" on admin_users
  for select using (auth.uid() = user_id);
