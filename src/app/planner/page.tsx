'use client';

import React, { useState, useEffect } from 'react';
import { BottomNav } from '@/components/ui/BottomNav';
import { Calendar, CheckSquare, Utensils, Sparkles, ChefHat, Check } from 'lucide-react';

interface DayPlan {
  day: string;
  lunch: string;
  dinner: string;
}

interface PrepItem {
  id: string;
  title: string;
  quantity: string;
  completed: boolean;
}

export default function PlannerPage() {
  const [activeTab, setActiveTab] = useState<'weekly' | 'batch'>('weekly');
  const [mounted, setMounted] = useState(false);

  // Estado del Plan Semanal (Guardado en localStorage)
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>([
    { day: 'Lunes', lunch: 'Bowl de Quinoa, Pollo y Calabaza', dinner: 'Omelette de Espinaca y Queso' },
    { day: 'Martes', lunch: 'Ensalada Proteica de Garbanzos y Atún', dinner: 'Zapallo Anco Relleno de Atún' },
    { day: 'Miércoles', lunch: 'Salteado de Lentejas y Vegetales', dinner: 'Wok Exprés de Pollo y Vegetales' },
    { day: 'Jueves', lunch: 'Bowl de Quinoa, Pollo y Calabaza', dinner: 'Omelette de Espinaca y Queso' },
    { day: 'Viernes', lunch: 'Ensalada Proteica de Garbanzos y Atún', dinner: 'Zapallo Anco Relleno de Atún' },
    { day: 'Sábado', lunch: 'Salteado de Lentejas y Vegetales', dinner: 'Cena Libre / Social' },
    { day: 'Domingo', lunch: 'Almuerzo Familiar', dinner: 'Preparación de Menú Semanal' }
  ]);

  // Lista de Tareas para Batch Cooking del Fin de Semana
  const [prepItems, setPrepItems] = useState<PrepItem[]>([
    { id: '1', title: 'Hervir Quinoa / Arroz Integral', quantity: '2 tazas en seco', completed: false },
    { id: '2', title: 'Hornear Calabaza / Zapallo Anco', quantity: '2 unidades medianas', completed: false },
    { id: '3', title: 'Cocinar Pechugas de Pollo y desmenuzar', quantity: '1 kg', completed: false },
    { id: '4', title: 'Hervir Huevos para la semana', quantity: '6 a 8 unidades', completed: false },
    { id: '5', title: 'Lavar y secar Hojas Verdes (Espinaca/Lechuga)', quantity: '2 atados', completed: false },
    { id: '6', title: 'Porcionar Frutos Secos y Avena para meriendas', quantity: '5 frascos/tuppers', completed: false }
  ]);

  // Sincronización client-side y persistencia en localStorage
  useEffect(() => {
    setMounted(true);
    const savedPlan = localStorage.getItem('sproutmind_weekly_plan');
    if (savedPlan) setWeeklyPlan(JSON.parse(savedPlan));

    const savedPrep = localStorage.getItem('sproutmind_batch_prep');
    if (savedPrep) setPrepItems(JSON.parse(savedPrep));
  }, []);

  // Cambiar plato de la semana
  const handleUpdatePlan = (dayIndex: number, field: 'lunch' | 'dinner', value: string) => {
    const updated = [...weeklyPlan];
    updated[dayIndex][field] = value;
    setWeeklyPlan(updated);
    localStorage.setItem('sproutmind_weekly_plan', JSON.stringify(updated));
  };

  // Toggle de tarea de Batch Cooking
  const handleTogglePrep = (id: string) => {
    const updated = prepItems.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setPrepItems(updated);
    localStorage.setItem('sproutmind_batch_prep', JSON.stringify(updated));
  };

  const completedPrepCount = prepItems.filter((i) => i.completed).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20 pt-6 px-4 antialiased">
      <main className="max-w-md mx-auto space-y-5">
        {/* HEADER Y SELECTOR DE PESTAÑA */}
        <header className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-medium text-zinc-100">Planificación Semanal</h1>
              <p className="text-xs text-zinc-500 font-mono">Menú organizado y Batch Cooking</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-zinc-400">
              <Calendar size={18} />
            </div>
          </div>

          <div className="flex bg-zinc-900/80 p-1 rounded-xl border border-zinc-800/80">
            <button
              onClick={() => setActiveTab('weekly')}
              className={`flex-1 py-1.5 text-xs font-mono rounded-lg transition-colors ${
                activeTab === 'weekly' ? 'bg-zinc-100 text-zinc-950 font-medium' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Menú Lunes a Dom
            </button>
            <button
              onClick={() => setActiveTab('batch')}
              className={`flex-1 py-1.5 text-xs font-mono rounded-lg transition-colors ${
                activeTab === 'batch' ? 'bg-zinc-100 text-zinc-950 font-medium' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Batch Cooking ({completedPrepCount}/{prepItems.length})
            </button>
          </div>
        </header>

        {/* PESTAÑA 1: MENÚ SEMANAL */}
        {activeTab === 'weekly' && (
          <div className="space-y-3">
            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-3 flex items-center gap-2.5 text-zinc-400 text-xs">
              <Sparkles size={16} className="text-amber-400 flex-shrink-0" />
              <span>Un menú planificado evita improvisar decisiones cuando vuelves cansado a las 17:00.</span>
            </div>

            <div className="space-y-2.5">
              {weeklyPlan.map((item, idx) => (
                <div
                  key={item.day}
                  className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3.5 space-y-2.5"
                >
                  <span className="text-xs font-mono font-medium text-zinc-100 px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 inline-block">
                    {item.day}
                  </span>

                  <div className="grid grid-cols-1 gap-2 pl-1">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-mono block">Almuerzo (Tupper fábrica)</span>
                      <input
                        type="text"
                        value={mounted ? item.lunch : ''}
                        onChange={(e) => handleUpdatePlan(idx, 'lunch', e.target.value)}
                        className="w-full bg-zinc-950/80 border border-zinc-800/80 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 mt-1"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-500 font-mono block">Cena (Rápida en casa)</span>
                      <input
                        type="text"
                        value={mounted ? item.dinner : ''}
                        onChange={(e) => handleUpdatePlan(idx, 'dinner', e.target.value)}
                        className="w-full bg-zinc-950/80 border border-zinc-800/80 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PESTAÑA 2: BATCH COOKING DE FIN DE SEMANA */}
        {activeTab === 'batch' && (
          <div className="space-y-4">
            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <ChefHat size={18} className="text-zinc-200" />
                <h3 className="text-xs font-medium text-zinc-100">Sesión del Fin de Semana</h3>
              </div>
              <p className="text-xs text-zinc-400">
                Dedica 1.5 horas los sábados o domingos para dejar las bases cocidas. Durante la semana laboral solo tendrás que ensamblar tus tuppers en 3 minutos.
              </p>
            </div>

            <div className="space-y-2">
              {prepItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleTogglePrep(item.id)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                    item.completed
                      ? 'bg-zinc-950/40 border-zinc-800/40 text-zinc-500'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-100 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                        item.completed
                          ? 'bg-zinc-100 border-zinc-100 text-zinc-950'
                          : 'border-zinc-700 bg-zinc-950'
                      }`}
                    >
                      {item.completed && <Check size={13} strokeWidth={3} />}
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${item.completed ? 'line-through decoration-zinc-600' : ''}`}>
                        {item.title}
                      </p>
                      <span className="text-[10px] text-zinc-500 font-mono">{item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}