// src/models/appointment.model.js
import { supabase } from './supabaseClient.js';
import { getCurrentUser } from './auth.model.js';

const TABLE_NAME = 'appointments'; // nome tabella in Supabase

export async function createAppointment(appointment) {
  // Ottieni l'utente corrente
  const { data: { user } } = await getCurrentUser();
  
  if (!user) {
    throw new Error('Utente non autenticato');
  }
  // Aggiungi l'ID utente all'appuntamento
  const appointmentWithUser = { ...appointment, user_id: user.id };
  
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([appointmentWithUser]);

  if (error) {
    console.error('Errore creando appuntamento:', error);
    return null;
  }

  // Se non ci sono dati restituiti, l'inserimento è comunque riuscito
  if (!data || data.length === 0) {
    return { ...appointment, id: 'temp-' + Date.now() };
  }

  return data[0];
}

export async function getAppointments() {
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
    console.error('Errore caricando appuntamenti:', error);
    return [];
  }

  return data;
}

export async function deleteAppointment(id) {
  // Ottieni l'utente corrente
  const { data: { user } } = await getCurrentUser();
  
  if (!user) {
    throw new Error('Utente non autenticato');
  }
  
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Errore eliminando appuntamento:', error);
    return false;
  }

  return true;
}

export async function updateAppointment(id, appointmentData) {
  // Ottieni l'utente corrente
  const { data: { user } } = await getCurrentUser();
  
  if (!user) {
    throw new Error('Utente non autenticato');
  }
  
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      title: appointmentData.title,
      date: appointmentData.date
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Errore aggiornando appuntamento:', error);
    return null;
  }

  return true;
}
