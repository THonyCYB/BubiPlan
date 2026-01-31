// src/views/events.view.js

import { deleteExpense } from '../models/expense.model.js';
import { deleteAppointment } from '../models/appointment.model.js';

export function renderEventsList(events) {
  const eventsList = document.getElementById('eventsList');
  
  if (!events || events.length === 0) {
    eventsList.innerHTML = '<p class="no-events">Nessun evento trovato</p>';
    return;
  }
  
  eventsList.innerHTML = events.map(event => `
    <div class="event-item ${event.type}">
      <div class="event-title">${event.title}</div>
      <div class="event-date">${formatDate(event.date)}</div>
      <div class="event-actions">
        <button class="edit-btn" onclick="editEvent('${event.id}', '${event.type}')">✏️ Modifica</button>
        <button class="delete-btn" onclick="deleteEvent('${event.id}', '${event.type}')">🗑️ Elimina</button>
      </div>
    </div>
  `).join('');
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('it-IT', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Funzioni globali per modifica ed eliminazione
window.editEvent = async function(id, type) {
  // TODO: Implementare modifica evento
  alert(`Modifica ${type} con ID: ${id}`);
};

window.deleteEvent = async function(id, type) {
  if (!confirm(`Sei sicuro di voler eliminare questo ${type}?`)) {
    return;
  }
  
  try {
    let success;
    if (type === 'expense') {
      success = await deleteExpense(id);
    } else {
      success = await deleteAppointment(id);
    }
    
    if (success) {
      alert(`${type} eliminato con successo!`);
      // Ricarica la pagina per aggiornare la lista
      location.reload();
    } else {
      alert(`Errore nell'eliminazione del ${type}`);
    }
  } catch (error) {
    console.error('Errore:', error);
    alert(`Errore: ${error.message}`);
  }
};