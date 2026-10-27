'use client';

import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { BottomNav } from '@/components/ui/BottomNav';
import { BarChart3, Flame, Zap, ShieldCheck, Activity } from 'lucide-react';

export default function MetricsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Consultas en tiempo real
  const habits = useLiveQuery(() => db.habits.toArray(), []) || [];
  const mealLogs = useLiveQuery(() => db.mealLogs.toArray(), []) || [];

  // Cálculos de métricas
  const totalHabits = habits.length;
  const completedHabits = habits.filter((h) => h.completed).length;
  const habitCompletionRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  // Promedio de energía post-comida
  const lightDigestions = mealLogs.filter((l) => l.digestion === 'Liviano');
  const heavyDigestions = mealLogs.filter((l) => l.digestion === 'Pesado');

  const avgEnergyLight =
    lightDigestions.length > 0
      ? (lightDigestions.reduce((acc, curr) => acc + curr.energyPost, 0) / lightDigestions.length).toFixed(1)
      : 'N/A';

  const avgEnergyHeavy =
    heavyDigestions.length > 0
      ? (heavyDigestions.reduce((acc, curr) => acc + curr.energyPost, 0) / heavyDigestions.length).toFixed(1)
      : 'N/A';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20 pt-6 px-4 antialiased">
      <main className="max-w-md mx-auto space-y-5">
        {/* HEADER */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-medium text-zinc-100">Métricas & Balance</h1>
            <p className="text-xs text-zinc-500 font-mono">Impacto de tus hábitos en tu energía</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-zinc-400">
            <BarChart3 size={18} />
          </div>
        </header>

        {/* TARJETA 1: CUMPLIMIENTO DE HÁBITOS DE HOY */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              Consistencia de Hoy
            </span>
            <span className="text-xs font-mono text-zinc-100 font-medium">{habitCompletionRate}%</span>
          </div>

          <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800/60">
            <div
              className="bg-zinc-100 h-full transition-all duration-500"
              style={{ width: `${mounted ? habitCompletionRate : 0}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="bg-zinc-950/60 border border-zinc-800/60 p-2.5 rounded-lg flex items-center justify-between"
              >
                <div>
                  <p className="text-[11px] font-medium text-zinc-300 truncate max-w-[100px]">{habit.title}</p>
                  <span className="text-[9px] text-zinc-500 font-mono">{habit.target}</span>
                </div>
                <div className="flex items-center gap-0.5 text-xs font-mono text-zinc-400">
                  <Flame size={11} className={habit.streak > 0 ? 'text-amber-500 fill-amber-500/20' : 'text-zinc-600'} />
                  <span>{habit.streak}d</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TARJETA 2: IMPACTO DE LA ALIMENTACIÓN EN LA ENERGÍA */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 space-y-3">
          <span className="text-xs font-medium tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
            <Activity size={14} className="text-amber-400" />
            Digestión vs. Nivel de Energía
          </span>

          <p className="text-xs text-zinc-400">
            Comparativa de tu nivel de vitalidad vespertina según la calidad digestiva de tus comidas:
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-zinc-950 border border-zinc-800/80 p-3 rounded-xl space-y-1">
              <span className="text-[10px] text-zinc-500 font-mono block">😊 Comidas Livianas</span>
              <div className="flex items-center gap-1 text-base font-mono font-medium text-emerald-400">
                <Zap size={14} className="fill-emerald-400/20" />
                <span>{avgEnergyLight} / 5</span>
              </div>
              <span className="text-[9px] text-zinc-600 block">{lightDigestions.length} registros</span>
            </div>

            <div className="bg-zinc-950 border border-zinc-800/80 p-3 rounded-xl space-y-1">
              <span className="text-[10px] text-zinc-500 font-mono block">🥱 Comidas Pesadas</span>
              <div className="flex items-center gap-1 text-base font-mono font-medium text-amber-500">
                <Zap size={14} className="fill-amber-500/20" />
                <span>{avgEnergyHeavy} / 5</span>
              </div>
              <span className="text-[9px] text-zinc-600 block">{heavyDigestions.length} registros</span>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}