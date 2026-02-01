// src/models/auth.model.js
import { supabase } from './supabaseClient.js';

// Funzione per registrazione utente
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Errore durante la registrazione:', error.message);
    throw new Error(error.message);
  }

  return data;
}

// Funzione per login utente
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Errore durante il login:', error.message);
    throw new Error(error.message);
  }

  return data;
}

// Funzione per logout utente
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Errore durante il logout:', error.message);
    throw new Error(error.message);
  }
}

// Funzione per recupero password
export async function forgotPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    console.error('Errore durante il recupero password:', error.message);
    throw new Error(error.message);
  }
}

// Funzione per ottenere l'utente corrente
export function getCurrentUser() {
  return supabase.auth.getUser();
}

// Funzione per controllare se l'utente è autenticato
export function isAuthenticated() {
  const user = supabase.auth.getUser();
  return user !== null;
}

// Funzione per ascoltare i cambiamenti di stato di autenticazione
export function onAuthStateChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(event, session);
    }
  );

  // Ritorna la funzione per rimuovere il listener
  return () => {
    subscription.unsubscribe();
  };
}