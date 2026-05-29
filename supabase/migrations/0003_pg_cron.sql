-- Agendamento diario de post curado e coleta Shopee via pg_cron + pg_net.
--
-- Pre-requisitos no projeto Supabase:
--   1. Extensoes ativadas (Dashboard > Database > Extensions):
--      - pg_cron
--      - pg_net
--   2. Substitua os tokens placeholder antes de aplicar:
--      EDITAR-SITE-URL   = URL publica do site (ex https://techindica.vercel.app)
--      EDITAR-CRON-SECRET = mesmo valor do CRON_SECRET no .env do Next
--
-- Aplique no SQL Editor do Supabase Dashboard.

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Remove agendamentos anteriores (idempotente)
do $$
declare
  job_id bigint;
begin
  for job_id in
    select jobid from cron.job
    where jobname in ('techindica_generate_post_daily', 'techindica_shopee_fetch_daily')
  loop
    perform cron.unschedule(job_id);
  end loop;
end;
$$;

-- -------------------------------------------------------
-- 1. Gerar post curado diariamente as 08:00 UTC (05h BRT)
-- -------------------------------------------------------
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

-- -------------------------------------------------------
-- 2. Coletar produtos Shopee diariamente as 12:00 UTC (09h BRT)
--    Captura ofertas matinais da Shopee antes do pico de trafego
-- -------------------------------------------------------
select cron.schedule(
  'techindica_shopee_fetch_daily',
  '0 12 * * *',
  $$
  select net.http_post(
    url     := 'https://EDITAR-SITE-URL/api/cron/shopee-fetch',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer EDITAR-CRON-SECRET'
    ),
    body    := '{}'::jsonb
  ) as request_id;
  $$
);
