import React from 'react';
import './Modal.css';

interface ModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, message, onConfirm, onCancel }) => {
    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>{title}</h2>
                <p>{message}</p>
                <div className="modal-buttons">
                    <button onClick={onConfirm} className="confirm-modal-button">Yes</button>
                    <button onClick={onCancel} className="cancel-modal-button">No</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
