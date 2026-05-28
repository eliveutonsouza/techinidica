-- Agendamento diario do post curado via pg_cron + pg_net.
--
-- Pre-requisitos no projeto Supabase:
--   1. Extensoes ativadas (Dashboard > Database > Extensions):
--      - pg_cron
--      - pg_net
--   2. Variaveis de Vault (Dashboard > Project Settings > Vault) ou substitua
--      os tokens placeholder abaixo antes de aplicar:
--      - app.cron_secret  = mesmo valor do CRON_SECRET no .env do Next
--      - app.site_url     = URL publica do site (ex https://techindica.vercel.app)
--
-- Aplique editando os dois valores nas linhas marcadas com -- EDITAR.

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Remove agendamento anterior (idempotente)
do $$
declare
  job_id bigint;
begin
  select jobid into job_id from cron.job where jobname = 'techindica_generate_post_daily';
  if job_id is not null then
    perform cron.unschedule(job_id);
  end if;
end;
$$;

-- Agenda: todo dia as 08:00 UTC (05:00 horario de Brasilia)
select cron.schedule(
  'techindica_generate_post_daily',
  '0 8 * * *',
  $$
  select net.http_post(
    url     := 'https://EDITAR-SITE-URL/api/cron/generate-post',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer EDITAR-CRON-SECRET'
    ),
    body    := '{}'::jsonb
  ) as request_id;
  $$
);
