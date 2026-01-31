import { createExpense } from '../models/expense.model.js';
import { createAppointment } from '../models/appointment.model.js';
import { addEventToCalendar } from './calendarHelper.js';
import { refreshCalendar } from '../controllers/calendar.controller.js';

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
  
  modalBody.innerHTML = `
    <div class="modal-form">
      <input type="text" id="eventTitle" placeholder="Descrizione della spesa" />
      
      <div class="modal-buttons">
        <button id="submitExpense">Salva Spesa</button>
        <button id="cancelForm">Indietro</button>
      </div>
    </div>
  `;

  document.getElementById('submitExpense').onclick = async () => {
    const title = document.getElementById('eventTitle').value.trim();

    if (!title) return alert('Inserisci una descrizione valida');

    const expense = { title, date: selectedDate };
    const saved = await createExpense(expense);
    if (saved) {
      addEventToCalendar({ title, start: selectedDate, color: '#66c2b0' });
      await refreshCalendar();
    }
    closeModal();
  };

  document.getElementById('cancelForm').onclick = showActionChoice;
}

// Form per creare appuntamento
function showAppointmentForm() {
  const modalBody = document.getElementById('modalBody');
  
  modalBody.innerHTML = `
    <div class="modal-form">
      <input type="text" id="eventTitle" placeholder="Titolo dell'appuntamento" />
      <div class="modal-buttons">
        <button id="submitAppointment">Salva Appuntamento</button>
        <button id="cancelForm">Indietro</button>
      </div>
    </div>
  `;

  document.getElementById('submitAppointment').onclick = async () => {
    const title = document.getElementById('eventTitle').value.trim();
    
    if (!title) return alert('Inserisci un titolo valido');

    const appointment = { title, date: selectedDate };
    const saved = await createAppointment(appointment);
    if (saved) {
      addEventToCalendar({ title, start: selectedDate, color: '#4caf9e' });
      await refreshCalendar();
    }
    closeModal();
  };

  document.getElementById('cancelForm').onclick = showActionChoice;
}

export function closeModal() {
  const modal = document.getElementById('actionModal');
  modal.classList.add('hidden');
}

export function showEditModal(event) {
  const modal = document.getElementById('actionModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  modalTitle.textContent = 'Modifica evento';
  
  // Determine if it's an expense or appointment
  const eventType = event.extendedProps?.type || 'expense';
  
  modalBody.innerHTML = `
    <div class="modal-form">
      <input type="text" id="eventTitle" placeholder="Titolo" value="${event.title}" />
      <div class="modal-buttons">
        <button id="saveEdit">Salva Modifiche</button>
        <button id="cancelEdit">Annulla</button>
      </div>
    </div>
  `;
  
  // Show the modal
  modal.classList.remove('hidden');
  
  // Add event listeners
  document.getElementById('saveEdit').onclick = async () => {
    const title = document.getElementById('eventTitle').value.trim();
    
    if (!title) return alert('Inserisci un titolo valido');
    
    try {
      let result;
      if (eventType === 'expense') {
        // Update expense
        const expenseModule = await import('../models/expense.model.js');
        // Convert date to proper format, getting the date part only
        let dateStr;
        if (event.start instanceof Date) {
          dateStr = `${event.start.getFullYear()}-${String(event.start.getMonth() + 1).padStart(2, '0')}-${String(event.start.getDate()).padStart(2, '0')}`;
        } else {
          dateStr = event.start.split('T')[0];
        }
        result = await expenseModule.updateExpense(event.id, { title, date: dateStr });
      } else {
        // Update appointment
        const appointmentModule = await import('../models/appointment.model.js');
        // Convert date to proper format, getting the date part only
        let dateStr;
        if (event.start instanceof Date) {
          dateStr = `${event.start.getFullYear()}-${String(event.start.getMonth() + 1).padStart(2, '0')}-${String(event.start.getDate()).padStart(2, '0')}`;
        } else {
          dateStr = event.start.split('T')[0];
        }
        result = await appointmentModule.updateAppointment(event.id, { title, date: dateStr });
      }
      
      if (result) {
        alert('Evento aggiornato con successo!');
        await refreshCalendar();
        closeModal(); // Close the modal after successful update
      } else {
        alert('Errore durante l\'aggiornamento');
      }
    } catch (err) {
      console.error('Errore durante l\'aggiornamento:', err);
      alert('Errore durante l\'aggiornamento');
    }
  };
  
  document.getElementById('cancelEdit').onclick = () => {
    modal.classList.add('hidden');
    showActionChoice();
  };
}
