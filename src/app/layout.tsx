import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Currency Exchange',
  description: 'Currency Exchange with Supabase',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ maxWidth: 960, margin: '0 auto', padding: 16 }}>
        {children}
      </body>
    </html>
  );
}
