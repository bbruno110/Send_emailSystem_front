import React, { useState } from 'react';
import Combobox from './ui/comboBox'; // Certifique-se de que o caminho para o Combobox está correto

interface Option {
  value: string;
  label: string;
}

interface ModalStatusProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (status: string) => Promise<void>;
}

const options: Option[] = [
  { value: 'Oposição', label: 'Oposição' },
  { value: 'Indeferimento', label: 'Indeferimento' },
  { value: 'Concessão', label: 'Concessão' },
  { value: 'Nulidade', label: 'Nulidade' },
  { value: 'Negativado', label: 'Negativado' },
  { value: 'Renovação', label: 'Renovação' },
  { value: 'Aguardando exame de mérito', label: 'Aguardando exame de mérito' },
  { value: 'Acompanhamento de Processo', label: 'Acompanhamento de Processo' },
];

const ModalStatus: React.FC<ModalStatusProps> = ({ isOpen, onClose, onSave }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      await onSave(selectedStatus);
      // Limpar o combobox após a confirmação
      setSelectedStatus('');
      onClose();
    } catch (error) {
      console.error('Erro ao salvar status:', error);
    }
  };

  const handleCancel = () => {
    // Limpar o combobox ao cancelar
    setSelectedStatus('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 select-none">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Alterar Status</h2>
        <Combobox
          value={selectedStatus}
          onSelect={setSelectedStatus}
          options={options}
          placeholder="Selecione um status"
        />
        <div className="flex space-x-4 mt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Confirmar
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalStatus;
