'use client';

import React from 'react';
import { Check, Flame } from 'lucide-react';
import { Habit } from '@/types';

interface HabitTrackerProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
}

export function HabitTracker({ habits, onToggleHabit }: HabitTrackerProps) {
  const completedCount = habits.filter((h) => h.completed).length;
  const progressPercentage = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium tracking-wider text-zinc-400 uppercase">
            Hábitos Diarios
          </span>
          <span className="text-xs text-zinc-500 font-mono">
            {completedCount}/{habits.length} ({progressPercentage}%)
          </span>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden mb-4 border border-zinc-800/50">
          <div
            className="bg-zinc-100 h-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Lista de Hábitos */}
        <div className="space-y-2.5">
          {habits.map((habit) => (
            <div
              key={habit.id}
              onClick={() => onToggleHabit(habit.id)}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                habit.completed
                  ? 'bg-zinc-950/40 border-zinc-800/50 text-zinc-500'
                  : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 text-zinc-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                    habit.completed
                      ? 'bg-zinc-100 border-zinc-100 text-zinc-950'
                      : 'border-zinc-700 bg-zinc-950'
                  }`}
                >
                  {habit.completed && <Check size={13} strokeWidth={3} />}
                </div>
                <div>
                  <p className={`text-sm font-medium ${habit.completed ? 'line-through decoration-zinc-600' : ''}`}>
                    {habit.title}
                  </p>
                  <span className="text-[10px] text-zinc-500 font-mono">{habit.target}</span>
                </div>
              </div>

              {/* Racha */}
              <div className="flex items-center gap-1 text-xs text-zinc-400 font-mono">
                <Flame size={12} className={habit.streak > 0 ? 'text-amber-500 fill-amber-500/20' : 'text-zinc-600'} />
                <span>{habit.streak}d</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}