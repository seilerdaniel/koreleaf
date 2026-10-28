'use client';

import React from 'react';

export function PraxisHeader() {
  return (
    <header className="bg-praxis-surface/60 border border-praxis-surface p-4 rounded-2xl space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Isotipo P Geométrica */}
          <div className="w-10 h-10 bg-praxis-lime rounded-xl flex items-center justify-center font-bold text-praxis-graphite text-xl font-mono tracking-tighter shadow-md shadow-praxis-lime/10">
            P
          </div>
          <div>
            <h1 className="text-base font-bold tracking-wider text-praxis-text font-mono">PRAXIS</h1>
            <p className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">Personal Operating System</p>
          </div>
        </div>
      </div>

      <div className="pt-1 border-t border-zinc-800/60">
        <p className="text-xs text-praxis-lime font-medium font-mono">
          Less intention. <span className="text-praxis-text">More action.</span>
        </p>
      </div>
    </header>
  );
}