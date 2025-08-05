// ModalContext.jsx
import { createContext, useContext, useState } from 'react';
import CustomModal from './CustomModal';

const ModalContext = createContext();

export const useMessageModal = () => useContext(ModalContext); // ✅ Name must match!

export const ModalProvider = ({ children }) => {
  const [modalData, setModalData] = useState({
    isOpen: false,
    heading: '',
    message: '',
    messageType: 'info',
  });

  const showMessageModal = ({ heading, message, messageType = 'info' }) => {
    setModalData({ isOpen: true, heading, message, messageType });
  };

  const hideMessageModal = () => {
    setModalData((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ModalContext.Provider value={{ showMessageModal, hideMessageModal }}>
      {children}
      <CustomModal
        isOpen={modalData.isOpen}
        onClose={hideMessageModal}
        heading={modalData.heading}
        message={modalData.message}
        messageType={modalData.messageType}
      />
    </ModalContext.Provider>
  );
};
