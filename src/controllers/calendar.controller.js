import { initCalendarView } from '../views/calendar.view.js';
import { getExpenses } from '../models/expense.model.js';
import { getAppointments } from '../models/appointment.model.js';

export async function loadEventsAndRender() {
  // Carica tutti gli eventi dal database
  const expenses = await getExpenses();
  const appointments = await getAppointments();
  
  // Combina tutti gli eventi
  const allEvents = [
    ...expenses.map(e => ({ ...e, type: 'expense' })),
    ...appointments.map(a => ({ ...a, type: 'appointment' }))
  ];
  
  // Restituisce gli eventi per il calendario
  return allEvents.map(event => ({
    id: event.id,
    title: event.title,
    start: event.date,
    color: event.type === 'expense' ? '#66c2b0' : '#4caf9e',
    extendedProps: {
      type: event.type
    }
  }));
}

let calendarEvents = [];

export async function initCalendarPage() {
  calendarEvents = await loadEventsAndRender();
  initCalendarView(calendarEvents);
}

export async function refreshCalendar() {
  calendarEvents = await loadEventsAndRender();
  
  // Get the calendar instance and re-render with new events
  import('../views/calendarHelper.js').then(helperModule => {
    const calendar = helperModule.getCalendarInstance();
    if (calendar) {
      calendar.removeAllEvents();
      calendar.addEventSource(calendarEvents);
      calendar.refetchEvents();
    }
  });
}
