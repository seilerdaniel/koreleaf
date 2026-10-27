export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export interface Habit {
  id: string;
  title: string;
  target: string;
  completed: boolean;
  streak: number;
}

export interface TodoItem {
  id: string;
  text: string;
  category: 'Proyecto' | 'Hogar' | 'Compras';
  completed: boolean;
}

export interface MealLog {
  id?: number;
  date: string; // YYYY-MM-DD
  mealType: 'Desayuno' | 'Almuerzo' | 'Merienda' | 'Cena';
  description: string;
  digestion: 'Liviano' | 'Pesado';
  energyPost: EnergyLevel;
}

export interface Recipe {
  id: string;
  title: string;
  category: 'Desayuno' | 'Almuerzo' | 'Merienda' | 'Cena';
  prepTime: string;
  energyImpact: string;
  ingredients: string[];
  steps: string[];
}