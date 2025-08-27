import "./globals.css";
import { ReactNode } from "react";


export const metadata = {
  title: "JPY Journal",
  description: "Yen investment journal with Supabase"
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
      <html lang="en">
      <body style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>{children}</body>
      </html>
  );
}