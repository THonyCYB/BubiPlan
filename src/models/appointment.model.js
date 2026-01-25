// src/models/appointment.model.js
import { supabase } from './supabaseClient.js';

const TABLE_NAME = 'appointments'; // nome tabella in Supabase

// Durate comuni in minuti
export const APPOINTMENT_DURATIONS = [
  { value: 15, label: '15 minuti' },
  { value: 30, label: '30 minuti' },
  { value: 45, label: '45 minuti' },
  { value: 60, label: '1 ora' },
  { value: 90, label: '1 ora 30 min' },
  { value: 120, label: '2 ore' }
];

// Promemoria in minuti
export const REMINDER_OPTIONS = [
  { value: 0, label: 'Nessun promemoria' },
  { value: 5, label: '5 minuti prima' },
  { value: 15, label: '15 minuti prima' },
  { value: 30, label: '30 minuti prima' },
  { value: 60, label: '1 ora prima' },
  { value: 1440, label: '1 giorno prima' }
];

export async function createAppointment(appointment) {
  // Valori di default
  const appointmentData = {
    title: appointment.title,
    date: appointment.date,
    duration: appointment.duration || 30,
    location: appointment.location || '',
    description: appointment.description || '',
    reminder: appointment.reminder || 0,
    status: 'scheduled'
  };
  
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([appointmentData]);

  if (error) {
    console.error('Errore creando appuntamento:', error);
    return null;
  }

  // Se non ci sono dati restituiti, l'inserimento è comunque riuscito
  if (!data || data.length === 0) {
    return { ...appointmentData, id: 'temp-' + Date.now() };
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
