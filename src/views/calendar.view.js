import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../styles/calendar.css';
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
      import('../models/expense.model.js').then(expenseModule => {
        import('../models/appointment.model.js').then(appointmentModule => {
          if (event.extendedProps.type === 'expense') {
            expenseModule.deleteExpense(event.id).then(async () => {
              alert('Evento eliminato con successo!');
              import('../controllers/calendar.controller.js').then(controllerModule => {
                controllerModule.refreshCalendar();
              });
            }).catch(err => {
              console.error('Errore durante l\'eliminazione della spesa:', err);
              alert('Errore durante l\'eliminazione');
            });
          } else {
            appointmentModule.deleteAppointment(event.id).then(async () => {
              alert('Evento eliminato con successo!');
              import('../controllers/calendar.controller.js').then(controllerModule => {
                controllerModule.refreshCalendar();
              });
            }).catch(err => {
              console.error('Errore durante l\'eliminazione dell\'appuntamento:', err);
              alert('Errore durante l\'eliminazione');
            });
          }
        });
      });
    }
  });
}

function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('it-IT', options);
}
