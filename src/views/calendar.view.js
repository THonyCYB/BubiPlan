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
    }
  });

  calendarInstance.render();
  setCalendarInstance(calendarInstance);
}
