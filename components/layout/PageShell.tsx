'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface PageShellProps {
  children: React.ReactNode;
  currentAddress?: string;
  isDemo?: boolean;
}

export function PageShell({
  children,
  currentAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  isDemo = true,
}: PageShellProps) {
  return (
    <div className="flex min-h-screen bg-[#090a0f] text-neutral-100">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar currentAddress={currentAddress} isDemo={isDemo} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
