"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";


type Point = { month: string; net: number };


export default function MonthlyFlowChart({ data }: { data: Point[] }) {
    return (
        <div className="card" style={{ height: 320 }}>
            <h3>Monthly Net Flow (KRW)</h3>
            <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="net" stroke="#2563eb" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}