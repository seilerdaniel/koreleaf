'use client';

import React from 'react';
import { Leaf } from 'lucide-react';

export function KoreHeader() {
  return (
    <header className="bg-[#243B2F]/40 border border-[#243B2F] p-4 rounded-2xl space-y-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Isotipo Símbolo Botánico */}
          <div className="w-10 h-10 bg-[#9EAF91] text-[#171B18] rounded-xl flex items-center justify-center shadow-md">
            <Leaf size={22} className="fill-current" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-[#E6E9D8] font-sans">kore leaf</h1>
            <p className="text-[10px] text-[#9EAF91] font-mono tracking-widest uppercase">YOUR PERSONAL GROWTH SYSTEM</p>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-[#243B2F]/60">
        <p className="text-xs text-[#E6E9D8] font-medium italic">
          "Grow at your own pace." <span className="text-[#9EAF91] font-normal">— Crece a tu propio ritmo.</span>
        </p>
      </div>
    </header>
  );
}