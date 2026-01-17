export const calendarEventCreatedAction = {
  id: 'calendar_event_created',
  name: 'Calendar Event Created',
  displayName: 'Calendar Event Created',
  description: 'Triggers when a new Google Calendar event is created',
  input: [],

  match: (payload, params) => true,
};
