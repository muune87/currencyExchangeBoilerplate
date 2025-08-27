"use client";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function LoginPage() {
    const supabase = supabaseBrowser();
    return (
        <div className="container">
            <h1>Sign in to JPY Journal</h1>
            <div className="card">
                <Auth
                    supabaseClient={supabase as never}
                    appearance={{ theme: ThemeSupa }}
                    providers={["google"]}
                    // ✅ 로그인 후 '/auth/callback?next=/dashboard' 로 보내 세션 교환 → 대시보드로 이동
                    redirectTo={
                        typeof window !== "undefined"
                            ? `${window.location.origin}/auth/callback?next=/dashboard`
                            : undefined
                    }
                    onlyThirdPartyProviders={false}
                    magicLink
                />
            </div>
        </div>
    );
}