import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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
    loading: boolean;
    error: string | null;
}

const initialState: EventState = {
    events: [],
    loading: false,
    error: null,
};


const API_URL = 'http://localhost:5000/events';


export const fetchEvents = createAsyncThunk('events/fetchEvents', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

export const createEvent = createAsyncThunk('events/createEvent', async (newEvent: IEvent) => {
    const response = await axios.post(API_URL, newEvent);
    return response.data;
});

export const updateEvent = createAsyncThunk('events/updateEvent', async ({ id, updatedEvent }: { id: string, updatedEvent: IEvent }) => {
    const response = await axios.put(`${API_URL}/${id}`, updatedEvent);
    return response.data;
});

export const deleteEvent = createAsyncThunk('events/deleteEvent', async (id: string) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
});

const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<IEvent[]>) => {
                state.loading = false;
                state.events = action.payload;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch events';
            })
            .addCase(createEvent.fulfilled, (state, action: PayloadAction<IEvent>) => {
                state.events.push(action.payload);
            })
            .addCase(updateEvent.fulfilled, (state, action: PayloadAction<IEvent>) => {
                const index = state.events.findIndex(event => event.id === action.payload.id);
                if (index !== -1) {
                    state.events[index] = action.payload;
                }
            })
            .addCase(deleteEvent.fulfilled, (state, action: PayloadAction<string>) => {
                state.events = state.events.filter(event => event.id !== action.payload);
            });
    }
});

export const { addTicket, updateTicket, deleteTicket } = eventSlice.actions;
export default eventSlice.reducer;
