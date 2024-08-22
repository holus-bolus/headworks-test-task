import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import './TicketForm.css';

const TicketForm = ({ eventId, existingTicket = null, onCancel, onSave }: { eventId: string, existingTicket?: any, onCancel?: () => void, onSave?: (ticket: any) => void }) => {
    const [type, setType] = useState(existingTicket?.type || '');
    const [quantity, setQuantity] = useState(existingTicket?.quantity || '');
    const [price, setPrice] = useState(existingTicket?.price || '');
    const [errors, setErrors] = useState({ type: '', quantity: '', price: '' });


    useEffect(() => {
        if (existingTicket) {
            setType(existingTicket.type);
            setQuantity(existingTicket.quantity);
            setPrice(existingTicket.price);
        }
    }, [existingTicket]);

    const validateForm = () => {
        let isValid = true;
        const newErrors = { type: '', quantity: '', price: '' };

        if (!type.trim()) {
            newErrors.type = 'Ticket type is required';
            isValid = false;
        }

        if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
            newErrors.quantity = 'Valid quantity is required';
            isValid = false;
        }

        if (!price || isNaN(Number(price)) || Number(price) <= 0) {
            newErrors.price = 'Valid price is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const ticket = {
                id: existingTicket ? existingTicket.id : uuidv4(),
                eventId,
                type,
                quantity: Number(quantity),
                price: Number(price)
            };

            if (onSave) {
                onSave(ticket);
            }

            setType('');
            setQuantity('');
            setPrice('');
        }
    };

    return (
        <div className="ticket-form">
            <label>
                Type
                <input
                    type="text"
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value);
                        setErrors((prev) => ({ ...prev, type: '' }));
                    }}
                    placeholder="Ticket Type"
                />
                {errors.type && <span className="error-message">{errors.type}</span>}
            </label>
            <label>
                Quantity
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                        setQuantity(e.target.value);
                        setErrors((prev) => ({ ...prev, quantity: '' }));
                    }}
                    placeholder="Quantity"
                />
                {errors.quantity && <span className="error-message">{errors.quantity}</span>}
            </label>
            <label>
                Price
                <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => {
                        setPrice(e.target.value);
                        setErrors((prev) => ({ ...prev, price: '' }));
                    }}
                    placeholder="Price"
                />
                {errors.price && <span className="error-message">{errors.price}</span>}
            </label>
            <button onClick={handleSubmit}>{existingTicket ? 'Save Changes' : 'Save the ticket'}</button>
            {onCancel && <button onClick={onCancel} className="cancel-button">Cancel</button>}
        </div>
    );
};

export default TicketForm;
