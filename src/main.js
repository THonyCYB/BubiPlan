import { initCalendarPage } from './controllers/calendar.controller.js';
import { getCurrentUser, onAuthStateChange, signIn, signUp, forgotPassword, signOut } from './models/auth.model.js';

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
  
  // Inizializza la navbar
  initNavbar();
  
  // Assicurarsi che l'immagine profilo salvata venga caricata
  setTimeout(loadSavedProfilePicture, 100); // Piccolo ritardo per garantire che il DOM sia pronto
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

// Funzione per gestire il logout
async function handleLogout() {
  try {
    await signOut();
    showAuthPage();
  } catch (error) {
    console.error('Errore durante il logout:', error);
    alert('Errore durante il logout: ' + error.message);
  }
}

// Funzione per gestire il caricamento dell'immagine profilo
function handleUploadPicture() {
  document.getElementById('profilePictureInput').click();
}

// Funzione per gestire la selezione del file
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      // In una vera applicazione, qui salveresti l'immagine nel profilo utente
      localStorage.setItem('profilePicture', e.target.result);
      updateProfileIcon(e.target.result);
      alert('Immagine profilo aggiornata!');
    };
    reader.readAsDataURL(file);
  }
}

// Funzione per simulare lo scatto della foto
function handleTakePicture() {
  // In una vera app mobile, qui utilizzeresti la fotocamera
  // Per ora simuliamo con un'icona generica
  alert('Funzionalità fotocamera: in una app mobile vera, questa aprirà la fotocamera. Per ora puoi usare "Carica Immagine" per selezionare una foto dal dispositivo.');
  handleUploadPicture(); // Come fallback, apriamo il selettore di file
}

// Funzione per aggiornare l'icona del profilo
function updateProfileIcon(imageSrc) {
  const profileBtn = document.getElementById('profileBtn');
  
  // Rimuovi la classe che indica l'icona predefinita
  profileBtn.classList.remove('default-icon');
  profileBtn.classList.add('custom-icon');
  
  // Imposta l'immagine come sfondo
  profileBtn.style.backgroundImage = `url(${imageSrc})`;
  profileBtn.style.backgroundColor = 'transparent';
  profileBtn.textContent = ''; // Rimuovi il contenuto testuale
}

// Funzione per caricare l'immagine profilo salvata
function loadSavedProfilePicture() {
  const savedImage = localStorage.getItem('profilePicture');
  const profileBtn = document.getElementById('profileBtn');
  
  if (savedImage) {
    updateProfileIcon(savedImage);
  } else {
    // Se non c'è un'immagine salvata, ripristina l'icona predefinita
    profileBtn.classList.remove('custom-icon');
    profileBtn.classList.add('default-icon');
    profileBtn.style.backgroundImage = 'none';
    profileBtn.style.backgroundColor = '';
    profileBtn.textContent = '👤';
  }
}

// Funzione per gestire il cambio di tema
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  
  const themeBtn = document.getElementById('themeToggle');
  const isDarkMode = document.body.classList.contains('dark-mode');
  
  // Salva la preferenza dell'utente
  localStorage.setItem('darkMode', isDarkMode);
  
  // Cambia l'icona in base al tema
  themeBtn.innerHTML = isDarkMode ? '<span>🌙</span>' : '<span>☀️</span>';
}

// Funzione per inizializzare la navbar
function initNavbar() {
  const profileBtn = document.getElementById('profileBtn');
  const profileMenu = document.getElementById('profileMenu');
  const logoutBtn = document.getElementById('logoutBtn');
  const uploadPictureBtn = document.getElementById('uploadPicture');
  const takePictureBtn = document.getElementById('takePicture');
  const profilePictureInput = document.getElementById('profilePictureInput');
  const themeToggle = document.getElementById('themeToggle');
  
  // Toggle menu profilo
  profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileMenu.classList.toggle('show');
  });
  
  // Chiudi menu quando si clicca fuori
  document.addEventListener('click', (e) => {
    if (!profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
      profileMenu.classList.remove('show');
    }
  });
  
  // Logout
  logoutBtn.addEventListener('click', handleLogout);
  
  // Carica immagine profilo
  uploadPictureBtn.addEventListener('click', handleUploadPicture);
  
  // Scatta foto profilo
  takePictureBtn.addEventListener('click', handleTakePicture);
  
  // Gestisci il cambio del file
  profilePictureInput.addEventListener('change', handleFileSelect);
  
  // Toggle tema
  themeToggle.addEventListener('click', toggleTheme);
  
  // Ripristina la preferenza del tema
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  if (savedDarkMode) {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<span>🌙</span>';
  }
  
  // Carica l'immagine profilo salvata
  loadSavedProfilePicture();
}

// Inizializza l'applicazione
document.addEventListener('DOMContentLoaded', async () => {
  checkAuthStatus();
});
