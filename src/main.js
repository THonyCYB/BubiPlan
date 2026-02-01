import { initCalendarPage } from './controllers/calendar.controller.js';
import { getCurrentUser, onAuthStateChange, signIn, signUp, forgotPassword } from './models/auth.model.js';

// Riferimenti agli elementi DOM
const authPage = document.getElementById('authPage');
const calendarPage = document.getElementById('calendarPage');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const forgotPasswordBtn = document.getElementById('forgotPassword');

// Controlla lo stato di autenticazione all'avvio
async function checkAuthStatus() {
  const { data: { user } } = await getCurrentUser();
  
  if (user) {
    // Utente già autenticato, mostra la pagina del calendario
    showCalendarPage();
  } else {
    // Utente non autenticato, mostra la pagina di login
    showAuthPage();
  }
}

// Funzione per mostrare la pagina di autenticazione
function showAuthPage() {
  authPage.style.display = 'flex';
  calendarPage.style.display = 'none';
}

// Funzione per mostrare la pagina del calendario
async function showCalendarPage() {
  authPage.style.display = 'none';
  calendarPage.style.display = 'block';
  
  // Inizializza il calendario
  await initCalendarPage();
}

// Gestisci cambio tra login e registrazione
loginTab.addEventListener('click', () => {
  loginTab.classList.add('active');
  signupTab.classList.remove('active');
  loginForm.style.display = 'block';
  signupForm.style.display = 'none';
});

signupTab.addEventListener('click', () => {
  signupTab.classList.add('active');
  loginTab.classList.remove('active');
  signupForm.style.display = 'block';
  loginForm.style.display = 'none';
});

// Gestisci il login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    await signIn(email, password);
    showCalendarPage();
  } catch (error) {
    alert('Errore durante il login: ' + error.message);
  }
});

// Gestisci la registrazione
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  if (password !== confirmPassword) {
    alert('Le password non coincidono!');
    return;
  }
  
  try {
    await signUp(email, password);
    alert('Registrazione avvenuta con successo! Controlla la tua email per confermare l\'account.');
    
    // Passa automaticamente alla scheda di login
    loginTab.click();
  } catch (error) {
    alert('Errore durante la registrazione: ' + error.message);
  }
});

// Gestisci il recupero password
forgotPasswordBtn.addEventListener('click', async () => {
  const email = prompt('Inserisci la tua email per il recupero password:');
  
  if (email) {
    try {
      await forgotPassword(email);
      alert('Controlla la tua email per reimpostare la password.');
    } catch (error) {
      alert('Errore durante il recupero password: ' + error.message);
    }
  }
});

// Ascolta i cambiamenti di stato di autenticazione
onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // Utente disconnesso, torna alla pagina di login
    showAuthPage();
  }
});

// Inizializza l'applicazione
document.addEventListener('DOMContentLoaded', async () => {
  checkAuthStatus();
});
