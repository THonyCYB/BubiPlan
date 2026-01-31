// src/models/appointment.model.js
import { supabase } from './supabaseClient.js';

const TABLE_NAME = 'appointments'; // nome tabella in Supabase

export async function createAppointment(appointment) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([appointment]);

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
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*');

  if (error) {
    console.error('Errore caricando appuntamenti:', error);
    return [];
  }

  return data;
}

export async function deleteAppointment(id) {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Errore eliminando appuntamento:', error);
    return false;
  }

  return true;
}

export async function updateAppointment(id, appointmentData) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      title: appointmentData.title,
      date: appointmentData.date
    })
    .eq('id', id);

  if (error) {
    console.error('Errore aggiornando appuntamento:', error);
    return null;
  }

  return true;
}
