'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Utensils, Calendar, BarChart3 } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Hoy', icon: Home },
    { href: '/food', label: 'Comidas', icon: Utensils },
    { href: '/planner', label: 'Menú', icon: Calendar },
    { href: '/metrics', label: 'Métricas', icon: BarChart3 }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800/80 z-40">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
                isActive ? 'text-zinc-100 font-medium' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon size={18} />
              <span className="text-[10px] font-mono">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}