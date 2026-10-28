'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';

interface TodayProgressProps {
  habitsProgress: number;   // ej: 75
  tasksProgress: number;    // ej: 60
  nutritionProgress: number;// ej: 80
  workoutProgress: number;  // ej: 50
}

export function TodayProgress({
  habitsProgress = 75,
  tasksProgress = 60,
  nutritionProgress = 80,
  workoutProgress = 50,
}: TodayProgressProps) {
  const categories = [
    { label: 'Hábitos', val: habitsProgress },
    { label: 'Tareas', val: tasksProgress },
    { label: 'Nutrición', val: nutritionProgress },
    { label: 'Entrenamiento', val: workoutProgress },
  ];

  return (
    <div className="bg-[#101112] border border-[#282B30] rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-mono font-semibold tracking-wider text-[#C5F078] uppercase">
            TU PROGRESO DE HOY
          </span>
          <h2 className="text-lg font-bold text-[#F7F7F2] mt-0.5">Vas por buen camino.</h2>
        </div>
        <div className="bg-[#282B30] p-2.5 rounded-full text-[#C5F078] border border-[#282B30]">
          <TrendingUp size={18} />
        </div>
      </div>

      <div className="space-y-3.5 pt-1">
        {categories.map((item) => (
          <div key={item.label} className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-[#F7F7F2]">{item.label}</span>
              <span className="font-mono text-[#F7F7F2]">{item.val}%</span>
            </div>
            <div className="w-full bg-[#282B30] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#C5F078] h-full transition-all duration-500 rounded-full"
                style={{ width: `${item.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}