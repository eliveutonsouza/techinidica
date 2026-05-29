import { NextResponse, type NextRequest } from 'next/server';
import { runShopeeFetch } from '@/actions/shopee-fetch';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Disparado pelo pg_cron (Supabase) via pg_net.http_post.
 * Schedule: 0 12 * * * (12h UTC = 9h BRT)
 * Auth: Authorization: Bearer <CRON_SECRET>  ou  ?token=<CRON_SECRET>
 */
export async function POST(req: NextRequest) {
  return handle(req);
}

export async function GET(req: NextRequest) {
  return handle(req);
}

async function handle(req: NextRequest) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return NextResponse.json({ ok: false, error: 'CRON_SECRET nao configurado' }, { status: 500 });
  }

  const auth = req.headers.get('authorization');
  const headerOk = auth === `Bearer ${expected}`;
  const queryOk = req.nextUrl.searchParams.get('token') === expected;
  if (!headerOk && !queryOk) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const result = await runShopeeFetch();
  if (!result.ok) {
    return NextResponse.json(result, { status: 500 });
  }
  return NextResponse.json(result, { status: 200 });
}
