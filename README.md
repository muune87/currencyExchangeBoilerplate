This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# JPY Journal (Next.js + Supabase)


## 1) Supabase 프로젝트 생성
- https://supabase.com 에서 새 프로젝트 생성
- Project Settings → API에서
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Authentication → Providers에서 원하는 소셜 로그인(Google/GitHub) 활성화
- Redirect URL: `http://localhost:3000` (로컬), 배포 후에는 해당 도메인


## 2) 스키마 적용
- Supabase SQL Editor에서 `supabase/schema.sql` 전체 실행


## 3) .env.local
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```


## 4) 개발/배포
```bash
pnpm i # or npm i / yarn
pnpm dev
```
- Vercel 배포 시, 위 두 env를 Vercel Project → Settings → Environment Variables에 등록


## 5) 메모
- RLS가 켜져 있어, 로그인하지 않으면 데이터를 읽거나 쓸 수 없습니다.
- 게시판(posts, comments)은 기본으로 전체 읽기 가능(정책에서 `true` → `auth.uid()=user_id`로 바꾸면 비공개 게시판이 됩니다).
- 차트는 월별 순현금흐름(KRW 기준: BUY=+ / SELL=-)을 단순 집계해 보여줍니다.