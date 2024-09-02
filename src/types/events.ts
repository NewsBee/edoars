// Define the type for a single event
export interface Event {
    id: string;
    title: string;
    date: string;
    color: string;
}


// Define the type for events mapped by date
export interface Events {
    [date: string]: Event[];
}

export interface EventDetail {
    title: string;
    description: string;
    date: string;
}

// types.ts
export interface CalendarEvent {
    title: string;
    description: string;
    date: Date;
    type: 'seminar_proposal' | 'seminar_hasil' | 'sidang_hasil';
  }
  

