import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createEvent, updateEvent } from "../../redux/eventSlice";
import { useNavigate } from "react-router-dom";
import './EventForm.css';
import Modal from "../Modal/Modal";
import { AppDispatch } from "../../redux/store";
import IEvent from "../../interfaces/IEvent.ts";



const EventForm = ({ existingEvent = null }: { existingEvent?: IEvent | null }) => {
    const [name, setName] = useState(existingEvent?.name || '');
    const [description, setDescription] = useState(existingEvent?.description || '');
    const [date, setDate] = useState(existingEvent?.date || '');
    const [errors, setErrors] = useState({ name: '', description: '', date: '' });
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        if (existingEvent) {
            setName(existingEvent.name);
            setDescription(existingEvent.description);
            setDate(existingEvent.date);
        }
    }, [existingEvent]);

    const validateForm = () => {
        let isValid = true;
        const newErrors = { name: '', description: '', date: '' };

        if (!name.trim()) {
            newErrors.name = 'Event Name is required';
            isValid = false;
        }

        if (!description.trim()) {
            newErrors.description = 'Event Description is required';
            isValid = false;
        }

        if (!date) {
            newErrors.date = 'Event Date and Time is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const event: IEvent = {
                id: existingEvent ? existingEvent.id : '',
                name,
                description,
                date,
                tickets: existingEvent ? existingEvent.tickets : []
            };
            if (existingEvent) {
                dispatch(updateEvent({ id: existingEvent.id, updatedEvent: event }));
            } else {
                dispatch(createEvent(event));
            }
            navigate('/');
        }
    };

    const handleClose = () => {
        if (name || description || date) {
            setShowModal(true);
        } else {
            navigate('/');
        }
    };

    const handleConfirmClose = () => {
        setName('');
        setDescription('');
        setDate('');
        setShowModal(false);
        navigate('/');
    };

    const handleCancelClose = () => {
        setShowModal(false);
    };

    const handleInputChange = (field: keyof typeof errors) => {
        setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    };

    return (
        <div className='event-form'>
            {showModal && (
                <Modal
                    title='Confirm Close'
                    message='You have unsaved changes. Are you sure you want to close the form?'
                    onConfirm={handleConfirmClose}
                    onCancel={handleCancelClose}
                />
            )}
            <button className='close-button' onClick={handleClose}>×</button>
            <div className='event-form-wrapper'>
                <label>
                    Event Name
                    <input
                        type='text'
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            handleInputChange('name');
                        }}
                        placeholder='Event Name'
                    />
                    {errors.name && <span className='error-message'>{errors.name}</span>}
                </label>
                <label>
                    Event Description
                    <textarea
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                            handleInputChange('description');
                        }}
                        cols={30}
                        rows={10}
                        placeholder='Event Description'
                    />
                    {errors.description && <span className='error-message'>{errors.description}</span>}
                </label>
                <label>
                    Event Date and Time
                    <input
                        type='datetime-local'
                        value={date}
                        onChange={(e) => {
                            setDate(e.target.value);
                            handleInputChange('date');
                        }}
                        name='date'
                        id='date'
                    />
                    {errors.date && <span className='error-message'>{errors.date}</span>}
                </label>
                <button onClick={handleSubmit}>{existingEvent ? 'Update Event' : 'Save Event'}</button>
            </div>
        </div>
    );
};

export default EventForm;
