import Dexie, { type Table } from 'dexie';
import { Habit, TodoItem, MealLog, Recipe } from '@/types';
import initialRecipes from '@/data/recipes.json';

export class SproutMindDB extends Dexie {
  habits!: Table<Habit>;
  todos!: Table<TodoItem>;
  mealLogs!: Table<MealLog>;
  recipes!: Table<Recipe>;

  constructor() {
    super('SproutMindDB');
    this.version(1).stores({
      habits: 'id',
      todos: 'id, category',
      mealLogs: '++id, date, mealType',
      recipes: 'id, category'
    });
  }
}

export const db = new SproutMindDB();

// Carga inicial de datos si la base de datos está vacía
db.on('populate', () => {
  db.habits.bulkAdd([
    { id: '1', title: 'Proyecto Personal', target: '2h', completed: false, streak: 0 },
    { id: '2', title: 'Ejercicio y Trote', target: '1h', completed: false, streak: 0 },
    { id: '3', title: 'Meditación', target: '15-30m', completed: false, streak: 0 },
    { id: '4', title: 'Lectura', target: '30m', completed: false, streak: 0 }
  ]);

  db.recipes.bulkAdd(initialRecipes as Recipe[]);
});