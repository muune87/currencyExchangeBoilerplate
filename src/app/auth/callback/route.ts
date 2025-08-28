import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/';

  if (!code) {
    // code 없으면 그냥 로그인 페이지로
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  const supabase = await createClient();

  // 🔑 여기서 세션 교환 + 쿠키 설정 (서버에서 자동으로 쿠키 저장됨)
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    // 실패 시 로그인으로
    return NextResponse.redirect(new URL('/auth/login?error=oauth', req.url));
  }

  // 성공 시 원하는 경로로
  return NextResponse.redirect(new URL(next, req.url));
}
