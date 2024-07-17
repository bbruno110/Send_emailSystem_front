import React, { useState } from 'react';
import { HiOutlineIdentification, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';
import { data } from '@/helpers/data';

const CardEdit: React.FC = () => {
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    situacao: 'A',
    repeticao: 0,
  });

  const handleEdit = (card: any) => {
    setSelectedCardId(card.id);
    setFormData({
      nome: card.nome,
      cnpj: card.cnpj,
      email: card.email,
      telefone: card.telefone,
      situacao: card.situacao,
      repeticao: card.repeticao,
    });
  };

  const handleSave = () => {
    // Logic to save the edited card data
    setSelectedCardId(null);
  };

  const handleCancel = () => {
    setSelectedCardId(null);
  };

  return (
    <div className="space-y-4">
      {data.map((card) => (
        <div key={card.id} className="p-4 border rounded-lg shadow-sm flex flex-col space-y-2">
          {selectedCardId === card.id ? (
            <>
              <div className="flex items-center space-x-2">
                <HiOutlineIdentification className="text-gray-500" />
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="flex-grow border rounded-md p-2"
                />
              </div>
              <div className="flex items-center space-x-2">
                <HiOutlineIdentification className="text-gray-500" />
                <input
                  type="text"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  className="flex-grow border rounded-md p-2"
                />
              </div>
              <div className="flex items-center space-x-2">
                <HiOutlineMail className="text-gray-500" />
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="flex-grow border rounded-md p-2"
                />
              </div>
              <div className="flex items-center space-x-2">
                <HiOutlinePhone className="text-gray-500" />
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="flex-grow border rounded-md p-2"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.situacao === 'A'}
                    onChange={(e) => setFormData({ ...formData, situacao: e.target.checked ? 'A' : 'I' })}
                    className="form-checkbox"
                  />
                  <span className="ml-2">Ativo</span>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <label className="flex items-center">
                  <span className="mr-2">Repetição:</span>
                  <input
                    type="number"
                    value={formData.repeticao}
                    onChange={(e) => setFormData({ ...formData, repeticao: Number(e.target.value) })}
                    className="w-20 border rounded-md p-2"
                  />
                </label>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Salvar
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <HiOutlineIdentification className="text-gray-500" />
                <span>{card.nome}</span>
              </div>
              <div className="flex items-center space-x-2">
                <HiOutlineIdentification className="text-gray-500" />
                <span>{card.cnpj}</span>
              </div>
              <div className="flex items-center space-x-2">
                <HiOutlineMail className="text-gray-500" />
                <span>{card.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <HiOutlinePhone className="text-gray-500" />
                <span>{card.telefone}</span>
              </div>
              <button
                onClick={() => handleEdit(card)}
                className="self-end px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Editar
              </button>
            </>
          )}
        </div>
      ))}
      
    </div>
  );
};

export default CardEdit;
