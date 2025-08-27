import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EntryForm from "./dashboard/components/EntryForm";
import MonthlyFlowChart from "./dashboard/components/MonthlyFlowChart";
import PostsPanel from "./dashboard/components/PostsPanel";
import type { Tables } from "@/types/db-helpers";



function monthKey(d: string) {
    const dt = new Date(d);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
}

type EntryLite = Pick<Tables<"entries">, "trade_date" | "action" | "amount" | "price">;

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    const { data } = await supabase
        .from("entries")
        .select("trade_date, action, amount, price")
        .returns<EntryLite[]>();

    const entries = data ?? [];

    const monthMap = new Map<string, number>();
    for (const e of entries) {
        const key = monthKey(e.trade_date as unknown as string);
        const sign = e.action === "BUY" ? 1 : -1;
        const net = (e.amount as number) * (e.price as number) * sign;
        monthMap.set(key, (monthMap.get(key) ?? 0) + net);
    }

    const chartData = Array.from(monthMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, net]) => ({ month, net }));

// Posts for board
    const { data: posts } = await supabase
        .from("posts")
        .select("id, title, body, created_at")
        .order("created_at", { ascending: false })
        .limit(20);


    return (
        <div className="container">
            <h1>JPY Journal</h1>
            <EntryForm />
            <MonthlyFlowChart data={chartData} />
            <PostsPanel posts={posts ?? []} />
        </div>
    );
}