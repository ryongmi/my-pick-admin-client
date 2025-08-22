'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export function Layout({ children, showSidebar = true }: LayoutProps): JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}