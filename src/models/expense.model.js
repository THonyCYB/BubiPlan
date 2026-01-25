// src/models/expense.model.js
import { supabase } from './supabaseClient.js';

const TABLE_NAME = 'expenses'; // nome tabella in Supabase

// Categorie predefinite per le spese
export const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Cibo', icon: '🍽️' },
  { id: 'transport', name: 'Trasporti', icon: '🚗' },
  { id: 'entertainment', name: 'Intrattenimento', icon: '🎮' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'health', name: 'Salute', icon: '🏥' },
  { id: 'utilities', name: 'Bollette', icon: '💡' },
  { id: 'other', name: 'Altro', icon: '📦' }
];

export async function createExpense(expense) {
  console.log('Tentativo di creare spesa con dati:', expense);
  
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([expense]);

  if (error) {
    console.error('Errore creando spesa:', error);
    console.error('Dati inviati:', expense);
    return null;
  }

  console.log('Risposta dal database:', data);
  
  // Se non ci sono dati restituiti, l'inserimento è comunque riuscito
  // Restituiamo l'oggetto originale con un ID fittizio
  if (!data || data.length === 0) {
    console.log('Inserimento riuscito, nessun dato restituito');
    return { ...expense, id: 'temp-' + Date.now() };
  }

  return data[0];
}

export async function getExpenses() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*');

  if (error) {
    console.error('Errore caricando spese:', error);
    return [];
  }

  return data;
}
