"use server";

import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert } from "@/types/supabase";

/** 클라이언트 폼/요청에서 쓰는 페이로드 타입 (UI 용) */
export type EntryPayload = {
    tradeDate: string; // YYYY-MM-DD
    pair: string;      // 스키마상 enum 아님 → string
    action: string;    // "
    amount: number;
    price: number;
    fee?: number | null;
    memo?: string | null;
    tags?: string[] | null;
};

export async function addEntry(payload: EntryPayload) {
    const supabase = await createClient();

    const { data: { user }, error: uerr } = await supabase.auth.getUser();
    if (uerr) throw uerr;
    if (!user) throw new Error("Not authenticated");

    // 스키마 Insert 타입으로 정확히 맞춤
    const row: TablesInsert<"entries"> = {
        user_id: user.id,
        trade_date: payload.tradeDate,
        pair: payload.pair,
        action: payload.action,
        amount: payload.amount,
        price: payload.price,
        fee: payload.fee ?? null,
        memo: payload.memo ?? null,
        tags: payload.tags ?? null,
    };

    const { error } = await supabase.from("entries").insert([row]);
    if (error) throw error;
}

/** 차트/대시보드 용으로 필요한 필드만 */
type EntryLite = Pick<Tables<"entries">, "trade_date" | "action" | "amount" | "price">;

export async function listEntries(): Promise<EntryLite[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("entries")
        .select("trade_date, action, amount, price")
        .returns<EntryLite[]>(); // 결과 타입 고정

    if (error) throw error;
    return data ?? [];
}
