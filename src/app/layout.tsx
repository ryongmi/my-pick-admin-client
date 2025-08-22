import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { Providers } from '@/components/providers';
import { AdminAuthGuard } from '@/components/auth/AdminAuthGuard';
import { Layout } from '@/components/layout/Layout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'MyPick Admin - 관리자 포털',
  description: 'MyPick 플랫폼 관리자 전용 포털',
  keywords: ['MyPick', 'Admin', '관리자', '크리에이터', '콘텐츠'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="ko" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <AdminAuthGuard>
            <Layout>
              {children}
            </Layout>
          </AdminAuthGuard>
        </Providers>
      </body>
    </html>
  );
}