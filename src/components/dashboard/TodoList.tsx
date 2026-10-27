'use client';

import React, { useState } from 'react';
import { Plus, Check, Trash2 } from 'lucide-react';
import { TodoItem } from '@/types';

interface TodoListProps {
  todos: TodoItem[];
  onAddTodo: (text: string, category: 'Proyecto' | 'Hogar' | 'Compras') => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

export function TodoList({ todos, onAddTodo, onToggleTodo, onDeleteTodo }: TodoListProps) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<'Proyecto' | 'Hogar' | 'Compras'>('Proyecto');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddTodo(text.trim(), category);
    setText('');
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium tracking-wider text-zinc-400 uppercase">
            Tareas del Día
          </span>
          <span className="text-xs text-zinc-500 font-mono">
            {todos.filter((t) => t.completed).length}/{todos.length}
          </span>
        </div>

        {/* Formulario de Alta Rápida */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nueva tarea rápida..."
            className="flex-1 bg-zinc-950 border border-zinc-800/80 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="bg-zinc-950 border border-zinc-800/80 rounded-lg px-2 py-2 text-xs text-zinc-400 focus:outline-none focus:border-zinc-700"
          >
            <option value="Proyecto">Proyecto</option>
            <option value="Hogar">Hogar</option>
            <option value="Compras">Compras</option>
          </select>
          <button
            type="submit"
            className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 p-2 rounded-lg transition-colors flex items-center justify-center"
          >
            <Plus size={16} />
          </button>
        </form>

        {/* Lista de Tareas */}
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {todos.length === 0 ? (
            <p className="text-xs text-zinc-600 text-center py-4">No hay tareas pendientes para hoy</p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                  todo.completed
                    ? 'bg-zinc-950/40 border-zinc-800/40 text-zinc-600'
                    : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-200'
                }`}
              >
                <div
                  onClick={() => onToggleTodo(todo.id)}
                  className="flex items-center gap-2.5 flex-1 cursor-pointer min-w-0 pr-2"
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border transition-all flex-shrink-0 ${
                      todo.completed
                        ? 'bg-zinc-100 border-zinc-100 text-zinc-950'
                        : 'border-zinc-700 bg-zinc-950'
                    }`}
                  >
                    {todo.completed && <Check size={11} strokeWidth={3} />}
                  </div>
                  <span
                    className={`text-xs truncate ${
                      todo.completed ? 'line-through decoration-zinc-600 text-zinc-500' : ''
                    }`}
                  >
                    {todo.text}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800/60 text-zinc-500 font-mono flex-shrink-0 ml-auto">
                    {todo.category}
                  </span>
                </div>

                <button
                  onClick={() => onDeleteTodo(todo.id)}
                  className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                  title="Eliminar"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}