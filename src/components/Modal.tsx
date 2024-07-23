import React, { useEffect, useState } from 'react';
import CardEdit from './CardEdit';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title }) => {
  const [searchTerm, setSearchTerm] = useState('');

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

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm(''); // Limpa o campo de pesquisa quando o modal é fechado
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 select-none">
      <div className="bg-white rounded-lg overflow-hidden w-full max-w-xl h-full max-h-[80%] md:max-w-2xl md:max-h-[70%]">
        <div className="relative h-full">
          <div className="sticky top-0 bg-white z-10 flex flex-col">
            <div className="flex justify-between items-center border-b p-4 mb-2">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button
                onClick={() => {
                  setSearchTerm(''); // Limpa o campo de pesquisa ao fechar o modal
                  onClose();
                }}
                className="text-gray-700 hover:text-gray-900 text-2xl px-2"
              >
                &times;
              </button>
            </div>
            <input
              type="text"
              placeholder="Pesquisar..."
              className="border p-2 m-4 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="overflow-auto invisible-scrollbar p-4 pb-20 h-full">
            {/* Passa a barra de pesquisa como prop para o CardEdit */}
            <CardEdit searchTerm={searchTerm}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
