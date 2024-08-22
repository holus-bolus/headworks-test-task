import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store.ts";
import { deleteTicket, deleteEvent, addTicket, updateTicket } from "../../redux/eventSlice.ts";
import TicketForm from "../../components/TicketForm/TicketForm.tsx";
import Modal from "../../components/Modal/Modal";
import './EventDetailsPage.css';

interface Ticket {
    id: string;
    type: string;
    price: number;
    quantity: number;
}

const EventDetailsPage = () => {
    const { id } = useParams<{ id: string | undefined }>();
    const event = useSelector((state: RootState) => state.events.events.find(event => event.id === id));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });

    const handleDeleteTicket = (ticketId: string) => {
        console.log(`Deleting ticket with ID: ${ticketId}`);
        dispatch(deleteTicket({ eventId: id!, ticketId }));
    };

    const handleDeleteEvent = () => {
        console.log(`Deleting event with ID: ${id}`);
        dispatch(deleteEvent({ id: id! }));
        console.log(`Event with ID: ${id} should be deleted`);
        navigate('/');
    };

    const handleShowDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleClose = () => {
        navigate('/');
    };

    const handleEditEvent = () => {
        navigate(`/edit/${id}`);
    };

    const handleEditTicket = (ticket: Ticket) => {
        setEditingTicket(ticket);
    };

    const handleCancelEditTicket = () => {
        setEditingTicket(null);
    };

    const handleSaveTicket = (ticket: Ticket) => {
        if (editingTicket) {
            dispatch(updateTicket({ eventId: id!, ticket }));
        } else {
            dispatch(addTicket({ eventId: id!, ticket }));
        }
        setEditingTicket(null);
    };

    return (
        <section className="event-details">
            <button className="close-button" onClick={handleClose}>×</button>
            <h2>{event?.name}</h2>
            <p className="event-description">{event?.description}</p>
            <p className="event-date">Date: {dateFormatter.format(new Date(event?.date || ''))}</p>

            <h3>Tickets</h3>
            <ul className="ticket-list">
                {event?.tickets.map(ticket => (
                    <li key={ticket.id} className="ticket-item">
                        <p><strong>Type:</strong> {ticket.type}</p>
                        <p><strong>Quantity:</strong> {ticket.quantity}</p>
                        <p><strong>Price:</strong> ${ticket.price.toFixed(2)}</p>
                        <button onClick={() => handleEditTicket(ticket)} className="edit-ticket-button">Edit</button>
                        <button onClick={() => handleDeleteTicket(ticket.id)} className="delete-button">Delete</button>
                    </li>
                ))}
            </ul>

            <TicketForm
                eventId={id!}
                existingTicket={editingTicket}
                onCancel={handleCancelEditTicket}
                onSave={handleSaveTicket}
            />

            <button className="edit-event-button" onClick={handleEditEvent}>Edit Event</button>
            <button className="delete-event-button" onClick={handleShowDeleteModal}>Delete Event</button>

            {showDeleteModal && (
                <Modal
                    title="Confirm Delete"
                    message="Are you sure you want to delete the event?"
                    onConfirm={handleDeleteEvent}
                    onCancel={handleCloseDeleteModal}
                />
            )}
        </section>
    );
};

export default EventDetailsPage;
