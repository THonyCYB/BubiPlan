import { createExpense, EXPENSE_CATEGORIES } from '../models/expense.model.js';
import { createAppointment, APPOINTMENT_DURATIONS, REMINDER_OPTIONS } from '../models/appointment.model.js';
import { addEventToCalendar } from './calendarHelper.js';

let selectedDate = null;

export function showActionModal(dateStr) {
  console.log('showActionModal chiamata con data:', dateStr);
  selectedDate = dateStr;
  const modal = document.getElementById('actionModal');
  
  if (!modal) {
    console.error('Modale non trovata nel DOM!');
    return;
  }
  
  console.log('Modale trovata, rimuovo classe hidden');
  modal.classList.remove('hidden');
  showActionChoice();
  document.getElementById('closeModal').onclick = closeModal;
}

// Mostra i pulsanti iniziali "Spesa" / "Appuntamento"
function showActionChoice() {
  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = `
    <div class="modal-buttons">
      <button id="createExpense">Spesa</button>
      <button id="createAppointment">Appuntamento</button>
    </div>
  `;

  document.getElementById('createExpense').onclick = showExpenseForm;
  document.getElementById('createAppointment').onclick = showAppointmentForm;
}

// Form per creare spesa
function showExpenseForm() {
  const modalBody = document.getElementById('modalBody');
  
  // Genera le opzioni delle categorie
  const categoryOptions = EXPENSE_CATEGORIES.map(cat => 
    `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`
  ).join('');
  
  modalBody.innerHTML = `
    <div class="modal-form">
      <input type="text" id="eventTitle" placeholder="Titolo della spesa" />
      <input type="number" id="eventAmount" placeholder="Importo (€)" step="0.01" min="0" />
      
      <select id="eventCategory">
        <option value="">Seleziona categoria</option>
        ${categoryOptions}
      </select>
      
      <div class="modal-buttons">
        <button id="submitExpense">Salva Spesa</button>
        <button id="cancelForm">Indietro</button>
      </div>
    </div>
  `;

  document.getElementById('submitExpense').onclick = async () => {
    const title = document.getElementById('eventTitle').value.trim();
    const amount = parseFloat(document.getElementById('eventAmount').value);
    const category = document.getElementById('eventCategory').value;

    if (!title) return alert('Inserisci un titolo valido');
    if (isNaN(amount) || amount <= 0) return alert('Inserisci un importo valido');
    if (!category) return alert('Seleziona una categoria');

    const expense = { title, amount, date: selectedDate, category };
    const saved = await createExpense(expense);
    if (saved) {
      // Aggiungi l'icona della categoria al titolo dell'evento
      const categoryObj = EXPENSE_CATEGORIES.find(c => c.id === category);
      const displayTitle = categoryObj ? `${categoryObj.icon} ${title}` : title;
      addEventToCalendar({ title: displayTitle, start: selectedDate, color: '#66c2b0' });
    }
    closeModal();
  };

  document.getElementById('cancelForm').onclick = showActionChoice;
}

// Form per creare appuntamento
function showAppointmentForm() {
  const modalBody = document.getElementById('modalBody');
  
  // Genera le opzioni per durata e promemoria
  const durationOptions = APPOINTMENT_DURATIONS.map(dur => 
    `<option value="${dur.value}">${dur.label}</option>`
  ).join('');
  
  const reminderOptions = REMINDER_OPTIONS.map(rem => 
    `<option value="${rem.value}">${rem.label}</option>`
  ).join('');
  
  modalBody.innerHTML = `
    <div class="modal-form">
      <input type="text" id="eventTitle" placeholder="Titolo dell'appuntamento" />
      
      <input type="datetime-local" id="eventDateTime" />
      
      <select id="eventDuration">
        <option value="30">Durata (default 30 min)</option>
        ${durationOptions}
      </select>
      
      <input type="text" id="eventLocation" placeholder="Luogo (opzionale)" />
      
      <textarea id="eventDescription" placeholder="Descrizione (opzionale)" rows="3"></textarea>
      
      <select id="eventReminder">
        <option value="0">Promemoria (opzionale)</option>
        ${reminderOptions}
      </select>
      
      <div class="modal-buttons">
        <button id="submitAppointment">Salva Appuntamento</button>
        <button id="cancelForm">Indietro</button>
      </div>
    </div>
  `;
  
  // Imposta la data selezionata di default
  const dateTimeInput = document.getElementById('eventDateTime');
  const selectedDateTime = new Date(selectedDate);
  selectedDateTime.setHours(9, 0, 0, 0); // 09:00 di default
  dateTimeInput.value = selectedDateTime.toISOString().slice(0, 16);

  document.getElementById('submitAppointment').onclick = async () => {
    const title = document.getElementById('eventTitle').value.trim();
    const dateTime = document.getElementById('eventDateTime').value;
    const duration = parseInt(document.getElementById('eventDuration').value) || 30;
    const location = document.getElementById('eventLocation').value.trim();
    const description = document.getElementById('eventDescription').value.trim();
    const reminder = parseInt(document.getElementById('eventReminder').value) || 0;

    if (!title) return alert('Inserisci un titolo valido');
    if (!dateTime) return alert('Seleziona data e ora');

    const appointment = { 
      title, 
      date: dateTime, 
      duration, 
      location, 
      description, 
      reminder
    };
    
    const saved = await createAppointment(appointment);
    if (saved) {
      addEventToCalendar({ 
        title, 
        start: dateTime, 
        color: '#4caf9e',
        duration: duration
      });
    }
    closeModal();
  };

  document.getElementById('cancelForm').onclick = showActionChoice;
}

export function closeModal() {
  const modal = document.getElementById('actionModal');
  modal.classList.add('hidden');
}
