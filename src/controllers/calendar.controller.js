import { initCalendarView } from '../views/calendar.view.js';

export function initCalendarPage() {
  const mockEvents = [
    { id: '1', title: 'Meeting di prova', start: new Date().toISOString() },
    { id: '2', title: 'Spesa mensile', start: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString() }
  ];

  initCalendarView(mockEvents);
}
