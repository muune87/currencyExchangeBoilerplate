"use client";
import { useState, FormEvent } from "react";
import { addEntry } from "@/app/actions/entries";


export default function EntryForm() {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        tradeDate: new Date().toISOString().slice(0, 10),
        pair: "JPY/KRW" as const,
        action: "BUY" as const,
        amount: 10000,
        price: 9.5,
        fee: 0,
        memo: ""
    });


    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await addEntry(form);
            alert("Saved");
        } catch (e: any) {
            alert(e.message ?? "Error");
        } finally {
            setLoading(false);
        }
    }


    return (
        <form onSubmit={onSubmit} className="card">
            <h3>Add Entry</h3>
            <label>Date</label>
            <input type="date" value={form.tradeDate} onChange={e => setForm({ ...form, tradeDate: e.target.value })} required />


            <label>Pair</label>
            <select value={form.pair} onChange={e => setForm({ ...form, pair: e.target.value as any })}>
                <option>JPY/KRW</option>
                <option>JPY/USD</option>
                <option>USD/KRW</option>
            </select>


            <div className="row">
                <div style={{ flex: 1 }}>
                    <label>Action</label>
                    <select value={form.action} onChange={e => setForm({ ...form, action: e.target.value as any })}>
                        <option>BUY</option>
                        <option>SELL</option>
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label>Amount</label>
                    <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} />
                </div>
                <div style={{ flex: 1 }}>
                    <label>Price</label>
                    <input type="number" step="0.0001" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
                </div>
            </div>


            <label>Fee</label>
            <input type="number" step="0.01" value={form.fee} onChange={e => setForm({ ...form, fee: Number(e.target.value) })} />


            <label>Memo</label>
            <textarea value={form.memo} onChange={e => setForm({ ...form, memo: e.target.value })} />


            <button className="btn" type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
        </form>
    );
}