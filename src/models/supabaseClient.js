// src/models/supabaseClient.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://xuzvaqssahiqojydldar.supabase.co'; // sostituisci con il tuo URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1enZhcXNzYWhpcW9qeWRsZGFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMzU2MzEsImV4cCI6MjA4NDkxMTYzMX0.QE6NMbIEbNay0rrW2DXQ_Mg1BZtA6cNhyOjSOP7UFvQ'; // sostituisci con la tua chiave anon

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
