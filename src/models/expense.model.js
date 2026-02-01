// src/models/expense.model.js
import { supabase } from './supabaseClient.js';
import { getCurrentUser } from './auth.model.js';

const TABLE_NAME = 'expenses'; // nome tabella in Supabase

export async function createExpense(expense) {
  // Ottieni l'utente corrente
  const { data: { user } } = await getCurrentUser();
  
  if (!user) {
    throw new Error('Utente non autenticato');
  }
  // Tabella semplificata: solo title, date e note opzionale
  const expenseData = {
    title: expense.title,
    date: expense.date,
    note: expense.note || '',
    user_id: user.id
  };
  
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([expenseData]);

  if (error) {
    console.error('Errore creando spesa:', error);
    return null;
  }

  // Se non ci sono dati restituiti, l'inserimento è comunque riuscito
  if (!data || data.length === 0) {
    return { ...expenseData, id: 'temp-' + Date.now() };
  }

  return data[0];
}

export async function getExpenses() {
  // Ottieni l'utente corrente
  const { data: { user } } = await getCurrentUser();
  
  if (!user) {
    console.error('Utente non autenticato');
    return [];
  }
  
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Errore caricando spese:', error);
    return [];
  }

  return data;
}

export async function deleteExpense(id) {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Errore eliminando spesa:', error);
    return false;
  }

  return true;
}

export async function updateExpense(id, expenseData) {
  // Ottieni l'utente corrente
  const { data: { user } } = await getCurrentUser();
  
  if (!user) {
    throw new Error('Utente non autenticato');
  }
  
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      title: expenseData.title,
      date: expenseData.date,
      note: expenseData.note || ''
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Errore aggiornando spesa:', error);
    return null;
  }

  return true;
}