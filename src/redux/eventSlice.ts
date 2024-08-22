import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ITicket {
    id: string;
    type: string;
    quantity: number;
    price: number;
}

interface IEvent {
    id: string;
    name: string;
    description: string;
    date: string;
    tickets: ITicket[];
}

interface EventState {
    events: IEvent[];
}

const initialState: EventState = {
    events: []
};

const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        addEvent(state, action: PayloadAction<IEvent>) {
            state.events.push(action.payload);
        },
        updateEvent(state, action: PayloadAction<IEvent>) {
            const index = state.events.findIndex(event => event.id === action.payload.id);
            if (index !== -1) {
                state.events[index] = action.payload;
            }
        },
        deleteEvent(state, action: PayloadAction<{ id: string }>) {
            console.log(`Event with ID: ${action.payload.id} is being deleted`);
            state.events = state.events.filter(event => event.id !== action.payload.id);
            console.log('Remaining events:', state.events);
        },
        addTicket(state, action: PayloadAction<{ eventId: string; ticket: ITicket }>) {
            const event = state.events.find(event => event.id === action.payload.eventId);
            if (event) {
                event.tickets.push(action.payload.ticket);
            }
        },
        updateTicket(state, action: PayloadAction<{ eventId: string; ticket: ITicket }>) {
            const event = state.events.find(event => event.id === action.payload.eventId);
            if (event) {
                const ticketIndex = event.tickets.findIndex(ticket => ticket.id === action.payload.ticket.id);
                if (ticketIndex !== -1) {
                    event.tickets[ticketIndex] = action.payload.ticket;
                }
            }
        },
        deleteTicket(state, action: PayloadAction<{ eventId: string; ticketId: string }>) {
            const event = state.events.find(event => event.id === action.payload.eventId);
            if (event) {
                event.tickets = event.tickets.filter(ticket => ticket.id !== action.payload.ticketId);
            }
        }
    }
});

export const { addEvent, updateEvent, deleteEvent, addTicket, updateTicket, deleteTicket } = eventSlice.actions;
export default eventSlice.reducer;