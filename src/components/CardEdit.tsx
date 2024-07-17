import React, { useState } from 'react';
import { HiOutlineIdentification, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';
import { data } from '@/helpers/data';

const CardEdit = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formData, setFormData] = useState(data);

  const handleSelectCard = (id: number) => {
    setSelectedId(id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? (checked ? 'A' : 'I') : value;
    setFormData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, [name]: newValue } : item))
    );
  };

  const handleCancel = () => {
    setSelectedId(null);
  };

  const handleSave = () => {
    console.log('Saved data:', formData);
    setSelectedId(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
      {formData.map((item) => (
        <div
          key={item.id}
          className="w-full max-w-md p-4 border rounded-lg shadow-md bg-white hover:bg-gray-100 transition duration-300 ease-in-out"
        >
          {selectedId === item.id ? (
            <>
              <div className="flex items-center space-x-2">
                <HiOutlineIdentification className="text-gray-500" />
                <input
                  type="text"
                  name="nome"
                  value={item.nome}
                  onChange={(e) => handleChange(e, item.id)}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <HiOutlineIdentification className="text-gray-500" />
                <input
                  type="text"
                  name="cnpj"
                  value={item.cnpj}
                  onChange={(e) => handleChange(e, item.id)}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <HiOutlineMail className="text-gray-500" />
                <input
                  type="text"
                  name="email"
                  value={item.email}
                  onChange={(e) => handleChange(e, item.id)}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <HiOutlinePhone className="text-gray-500" />
                <input
                  type="text"
                  name="telefone"
                  value={item.telefone}
                  onChange={(e) => handleChange(e, item.id)}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="situacao"
                    checked={item.situacao === 'A'}
                    onChange={(e) => handleChange(e, item.id)}
                    className="form-checkbox"
                  />
                  <span>Ativo</span>
                </label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <label className="flex items-center space-x-2">
                  <span>Repetição:</span>
                  <input
                    type="number"
                    name="repeticao"
                    value={item.repeticao}
                    onChange={(e) => handleChange(e, item.id)}
                    className="border rounded p-2 w-16"
                  />
                </label>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Salvar
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <HiOutlineIdentification className="text-gray-500" />
                <span>{item.nome}</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <HiOutlineIdentification className="text-gray-500" />
                <span>{item.cnpj}</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <HiOutlineMail className="text-gray-500" />
                <span>{item.email}</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <HiOutlinePhone className="text-gray-500" />
                <span>{item.telefone}</span>
              </div>
              <button
                onClick={() => handleSelectCard(item.id)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
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