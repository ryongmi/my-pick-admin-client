'use client';

import { Navigation } from './Navigation';

export function Sidebar(): JSX.Element {
  return (
    <aside className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto py-6 px-4">
          <Navigation />
        </div>
        
        <div className="border-t p-4">
          <div className="text-xs text-muted-foreground">
            <p>MyPick Admin v1.0.0</p>
            <p>© 2024 MyPick Platform</p>
          </div>
        </div>
      </div>
    </aside>
  );
}