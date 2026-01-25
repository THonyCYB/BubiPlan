let calendarInstance = null;

export function setCalendarInstance(instance) {
  calendarInstance = instance;
}

export function addEventToCalendar(event) {
  if (!calendarInstance) return;
  calendarInstance.addEvent(event);
}
