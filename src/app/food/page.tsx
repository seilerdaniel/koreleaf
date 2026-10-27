'use client';

import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { BottomNav } from '@/components/ui/BottomNav';
import { MealLog, Recipe, EnergyLevel } from '@/types';
import { Utensils, Search, Plus, Clock, Zap, ChevronDown, ChevronUp } from 'lucide-react';

export default function FoodPage() {
  const [activeTab, setActiveTab] = useState<'log' | 'recipes'>('log');
  const [todayStr, setTodayStr] = useState<string>('');

  // Estados del Formulario de Registro
  const [mealType, setMealType] = useState<'Desayuno' | 'Almuerzo' | 'Merienda' | 'Cena'>('Desayuno');
  const [description, setDescription] = useState('');
  const [digestion, setDigestion] = useState<'Liviano' | 'Pesado'>('Liviano');
  const [energyPost, setEnergyPost] = useState<EnergyLevel>(4);

  // Filtros del Recetario
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);

  // Inicializar fecha exclusivamente en el navegador al montar
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setTodayStr(today);
  }, []);

  // Consultas a Dexie / IndexedDB (solo se ejecutan si todayStr tiene valor)
  const todayLogs = useLiveQuery(
    () => (todayStr ? db.mealLogs.where('date').equals(todayStr).toArray() : []),
    [todayStr]
  ) || [];

  const recipes = useLiveQuery(() => db.recipes.toArray(), []) || [];

  // Guardar nuevo registro de comida
  const handleAddMealLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !todayStr) return;

    const newLog: MealLog = {
      date: todayStr,
      mealType,
      description: description.trim(),
      digestion,
      energyPost
    };

    await db.mealLogs.add(newLog);
    setDescription('');
  };

  // Filtrado de Recetas
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory = selectedCategory === 'Todas' || recipe.category === selectedCategory;
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20 pt-6 px-4 antialiased">
      <main className="max-w-md mx-auto space-y-5">
        {/* HEADER Y SELECTOR DE PESTAÑA */}
        <header className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-medium text-zinc-100">Alimentación & Energía</h1>
              <p className="text-xs text-zinc-500 font-mono">Registro diario y recetas express</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-zinc-400">
              <Utensils size={18} />
            </div>
          </div>

          <div className="flex bg-zinc-900/80 p-1 rounded-xl border border-zinc-800/80">
            <button
              onClick={() => setActiveTab('log')}
              className={`flex-1 py-1.5 text-xs font-mono rounded-lg transition-colors ${
                activeTab === 'log' ? 'bg-zinc-100 text-zinc-950 font-medium' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Registro de Hoy
            </button>
            <button
              onClick={() => setActiveTab('recipes')}
              className={`flex-1 py-1.5 text-xs font-mono rounded-lg transition-colors ${
                activeTab === 'recipes' ? 'bg-zinc-100 text-zinc-950 font-medium' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Recetario ({recipes.length})
            </button>
          </div>
        </header>

        {/* CONTENIDO DE PESTAÑA 1: REGISTRO DE HOY */}
        {activeTab === 'log' && (
          <div className="space-y-5">
            {/* Formulario rápido */}
            <form onSubmit={handleAddMealLog} className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 space-y-3">
              <span className="text-xs font-medium tracking-wider text-zinc-400 uppercase block">
                Registrar Comida
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-500 font-mono block mb-1">Momento</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none"
                  >
                    <option value="Desayuno">Desayuno (04:45)</option>
                    <option value="Almuerzo">Almuerzo (12:30)</option>
                    <option value="Merienda">Merienda (17:00)</option>
                    <option value="Cena">Cena (21:30)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 font-mono block mb-1">Digestión</label>
                  <select
                    value={digestion}
                    onChange={(e) => setDigestion(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none"
                  >
                    <option value="Liviano">😊 Liviano</option>
                    <option value="Pesado">🥱 Pesado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 font-mono block mb-1">¿Qué comiste?</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej: Pancakes de avena con té / Bowl de pollo..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 font-mono">Energía post:</span>
                  <select
                    value={energyPost}
                    onChange={(e) => setEnergyPost(Number(e.target.value) as EnergyLevel)}
                    className="bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-zinc-200 font-mono focus:outline-none"
                  >
                    <option value={1}>1⚡ Muy baja</option>
                    <option value={2}>2⚡ Baja</option>
                    <option value={3}>3⚡ Normal</option>
                    <option value={4}>4⚡ Buena</option>
                    <option value={5}>5⚡ Máxima</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-medium px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1"
                >
                  <Plus size={14} />
                  <span>Guardar</span>
                </button>
              </div>
            </form>

            {/* Listado de Comidas de Hoy */}
            <div className="space-y-3">
              <span className="text-xs font-medium tracking-wider text-zinc-400 uppercase block">
                Comidas Registradas Hoy
              </span>

              {todayLogs.length === 0 ? (
                <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 text-center">
                  <p className="text-xs text-zinc-600 font-mono">No has registrado comidas el día de hoy.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {todayLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400">
                            {log.mealType}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {log.digestion === 'Liviano' ? '😊 Liviano' : '🥱 Pesado'}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-200 font-medium">{log.description}</p>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-mono text-amber-400 bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800">
                        <Zap size={12} className="fill-amber-400/20" />
                        <span>{log.energyPost}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONTENIDO DE PESTAÑA 2: RECETARIO */}
        {activeTab === 'recipes' && (
          <div className="space-y-4">
            {/* Buscador */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-3 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar receta o ingrediente..."
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
              />
            </div>

            {/* Categorías */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {['Todas', 'Desayuno', 'Almuerzo', 'Merienda', 'Cena'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap border transition-colors ${
                    selectedCategory === cat
                      ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-medium'
                      : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Lista de Recetas */}
            <div className="space-y-2.5">
              {filteredRecipes.map((recipe) => {
                const isExpanded = expandedRecipeId === recipe.id;
                return (
                  <div
                    key={recipe.id}
                    className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl overflow-hidden transition-all"
                  >
                    <div
                      onClick={() => setExpandedRecipeId(isExpanded ? null : recipe.id)}
                      className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-800/20 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 uppercase">
                            {recipe.category}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                            <Clock size={10} />
                            {recipe.prepTime}
                          </span>
                        </div>
                        <h3 className="text-xs font-medium text-zinc-100">{recipe.title}</h3>
                      </div>

                      <div className="text-zinc-500">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    {/* Detalle Desplegable */}
                    {isExpanded && (
                      <div className="px-3.5 pb-3.5 pt-1 border-t border-zinc-800/50 space-y-3 bg-zinc-950/40">
                        <div>
                          <span className="text-[10px] text-zinc-500 font-mono block mb-1">Ingredientes:</span>
                          <ul className="text-xs text-zinc-300 space-y-1">
                            {recipe.ingredients.map((ing, idx) => (
                              <li key={idx} className="flex items-center gap-1.5">
                                <span className="w-1 h-1 bg-zinc-500 rounded-full" />
                                <span>{ing}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <span className="text-[10px] text-zinc-500 font-mono block mb-1">Pasos:</span>
                          <ol className="text-xs text-zinc-400 space-y-1 list-decimal list-inside font-sans">
                            {recipe.steps.map((step, idx) => (
                              <li key={idx} className="text-zinc-300">{step}</li>
                            ))}
                          </ol>
                        </div>

                        <div className="pt-1">
                          <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 inline-block">
                            Impacto: {recipe.energyImpact}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}