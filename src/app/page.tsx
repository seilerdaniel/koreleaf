'use client';

import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { PomodoroTimer } from '@/components/dashboard/PomodoroTimer';
import { HabitTracker } from '@/components/dashboard/HabitTracker';
import { TodoList } from '@/components/dashboard/TodoList';
import { BottomNav } from '@/components/ui/BottomNav';
import { EnergyLevel, TodoItem } from '@/types';
import { Zap } from 'lucide-react';

export default function Dashboard() {
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(4);
  const [currentDate, setCurrentDate] = useState<string>('');

  // Sincronizar fecha y montaje exclusivamente en el cliente dentro del efecto
  useEffect(() => {
    const formatted = new Date().toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'short'
    });
    setCurrentDate(formatted);
  }, []);

  // Consultas en tiempo real a IndexedDB
  const habits = useLiveQuery(() => db.habits.toArray(), []) || [];
  const todos = useLiveQuery(() => db.todos.toArray(), []) || [];

  // Conmutar estado de hábito
  const handleToggleHabit = async (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (habit) {
      const newCompleted = !habit.completed;
      await db.habits.update(id, {
        completed: newCompleted,
        streak: newCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1)
      });
    }
  };

  // Completar hábito de Proyecto al terminar ciclo Pomodoro
  const handlePomodoroComplete = async () => {
    const projectHabit = habits.find((h) => h.id === '1');
    if (projectHabit && !projectHabit.completed) {
      await db.habits.update('1', {
        completed: true,
        streak: projectHabit.streak + 1
      });
    }
  };

  // Operaciones To-Do List
  const handleAddTodo = async (text: string, category: 'Proyecto' | 'Hogar' | 'Compras') => {
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text,
      category,
      completed: false
    };
    await db.todos.add(newTodo);
  };

  const handleToggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      await db.todos.update(id, { completed: !todo.completed });
    }
  };

  const handleDeleteTodo = async (id: string) => {
    await db.todos.delete(id);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20 pt-6 px-4 antialiased">
      <main className="max-w-md mx-auto space-y-5">
        {/* HEADER SUPERIOR */}
        <header className="flex items-center justify-between bg-zinc-900/40 border border-zinc-800/60 p-4 rounded-xl">
          <div>
            <h1 className="text-base font-medium text-zinc-100">Buenas noches, Daniel</h1>
            <p className="text-xs text-zinc-500 font-mono capitalize h-4">
              {currentDate}
            </p>
          </div>

          {/* Selector de Energía Diaria */}
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Energía Hoy</span>
            <div className="flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800/80">
              <Zap size={13} className="text-amber-400 fill-amber-400/20" />
              <select
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value) as EnergyLevel)}
                className="bg-transparent text-xs font-mono text-zinc-200 focus:outline-none cursor-pointer"
              >
                <option value={1} className="bg-zinc-900">1 / 5 ⚡</option>
                <option value={2} className="bg-zinc-900">2 / 5 ⚡</option>
                <option value={3} className="bg-zinc-900">3 / 5 ⚡</option>
                <option value={4} className="bg-zinc-900">4 / 5 ⚡</option>
                <option value={5} className="bg-zinc-900">5 / 5 ⚡</option>
              </select>
            </div>
          </div>
        </header>

        {/* BLOQUES PRINCIPALES */}
        <PomodoroTimer onCompleteSession={handlePomodoroComplete} />
        <HabitTracker habits={habits} onToggleHabit={handleToggleHabit} />
        <TodoList
          todos={todos}
          onAddTodo={handleAddTodo}
          onToggleTodo={handleToggleTodo}
          onDeleteTodo={handleDeleteTodo}
        />
      </main>

      {/* NAVEGACIÓN INFERIOR */}
      <BottomNav />
    </div>
  );
}