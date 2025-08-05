import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const typeStyles = {
  success: 'text-success',
  error: 'text-danger',
  warning: 'text-warning',
  info: 'text-primary',
};
const typeToBgClass = {
    success: 'bg-primary text-white',
    error: 'bg-danger text-white',
    warning: 'bg-warning text-dark',
    info: 'bg-info text-white',
  };
  
  const CustomModal = ({ isOpen, onClose, messageType = 'success', heading, message }) => {
    return (
      <Modal show={isOpen} onHide={onClose} centered>
        <Modal.Header closeButton className={typeToBgClass[messageType] || 'bg-primary text-white'}>
          <Modal.Title>{heading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{message}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={onClose}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  
export default CustomModal;
