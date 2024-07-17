import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 select-none">
      <div className="bg-white rounded-lg overflow-hidden w-full max-w-xl h-full max-h-[80%] md:max-w-2xl md:max-h-[70%]">
        <div className="relative h-full ">
          <div className="sticky top-0 bg-white z-10 flex justify-between items-center border-b p-4 mb-2">
            <h2 className="text-xl font-semibold">Editar Empresa</h2>
            <button
              onClick={onClose}
              className="text-gray-700 hover:text-gray-900 text-2xl px-2"
            >
              &times;
            </button>
          </div>
          <div className="overflow-auto invisible-scrollbar p-4 pb-20 h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
