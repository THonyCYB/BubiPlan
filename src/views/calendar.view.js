import { Calendar } from 'https://esm.sh/@fullcalendar/core@6.1.11';
import dayGridPlugin from 'https://esm.sh/@fullcalendar/daygrid@6.1.11';
import timeGridPlugin from 'https://esm.sh/@fullcalendar/timegrid@6.1.11';
import interactionPlugin from 'https://esm.sh/@fullcalendar/interaction@6.1.11';
// L'import del CSS viene rimosso da qui e andrà gestito nell'HTML
import { setCalendarInstance } from './calendarHelper.js';

let calendarInstance = null;

export function initCalendarView(events = []) {
  const calendarEl = document.getElementById('calendar');

  calendarInstance = new Calendar(calendarEl, {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events,
    dateClick: (info) => {
      console.log('Data cliccata:', info.dateStr);
      // Import dinamico per evitare circular dependencies
      import('./modal.view.js').then(module => {
        module.showActionModal(info.dateStr);
      });
    },
    eventClick: (info) => {
      const event = info.event;
      showEventActionsModal(event);
    }
  });

  calendarInstance.render();
  setCalendarInstance(calendarInstance);
}

function showEventActionsModal(event) {
  const modal = document.getElementById('actionModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  modalTitle.textContent = event.title;
  
  modalBody.innerHTML = `
    <p>Data: ${formatDate(event.start)}</p>
    <div class="modal-buttons">
      <button id="editEventBtn">Modifica</button>
      <button id="deleteEventBtn">Elimina</button>
    </div>
  `;
  
  // Show the modal
  modal.classList.remove('hidden');
  
  // Add event listeners
  document.getElementById('editEventBtn').addEventListener('click', () => {
    // Close modal and trigger edit functionality
    modal.classList.add('hidden');
    import('./modal.view.js').then(module => {
      module.showEditModal(event);
    });
  });
  
  document.getElementById('deleteEventBtn').addEventListener('click', () => {
    // Confirm and delete event
    if (confirm('Sei sicuro di voler eliminare questo evento?')) {
      // Chiudi la modale prima di iniziare l'eliminazione
      modal.classList.add('hidden');
      handleDeleteEvent(event);
    }
  });
}

async function handleDeleteEvent(event) {
  try {
    const { type, id } = event.extendedProps;
    let deleteFunction;

    if (type === 'expense') {
      const { deleteExpense } = await import('../models/expense.model.js');
      deleteFunction = deleteExpense;
    } else {
      const { deleteAppointment } = await import('../models/appointment.model.js');
      deleteFunction = deleteAppointment;
    }

    await deleteFunction(event.id);
    alert('Evento eliminato con successo!');

    const { refreshCalendar } = await import('../controllers/calendar.controller.js');
    refreshCalendar();
  } catch (err) {
    console.error('Errore durante l\'eliminazione:', err);
    alert('Errore durante l\'eliminazione');
  }
}

function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('it-IT', options);
}
