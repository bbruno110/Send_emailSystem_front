import React, { useState } from 'react';
import { HiOutlineIdentification, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';
import { data } from '@/helpers/data';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';

// Função para formatar CNPJ
const formatCnpj = (value: string): string => {
  // Remove caracteres não numéricos
  const numericValue = value.replace(/\D/g, '');

  // Formatação: XX.XXX.XXX/XXXX-XX
  const formattedValue = numericValue
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');

  // Limita a quantidade de caracteres após a formatação
  return formattedValue.slice(0, 18); // CNPJ tem 14 caracteres formatados
};

// Função para formatar números de telefone
const formatPhoneNumber = (value: string): string => {
  // Remove caracteres não numéricos
  const numericValue = value.replace(/\D/g, '');

  // Formatação: (XX) XXXXX-XXXX
  const formattedValue = numericValue
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');

  // Limita a quantidade de caracteres após a formatação
  return formattedValue.slice(0, 15); // Telefone tem 15 caracteres formatados
};
const schema = yup.object().shape({
  nome: yup.string(),
  cnpj: yup.string().matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido'),
  tel1: yup.string().matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido').max(15, 'Telefone deve ter no máximo 15 caracteres'),
  email: yup.string().email('Email inválido'),
  repeticao: yup.number().integer('Repetição deve ser um número inteiro'),
});

type FormValues = {
  nome: string;
  cnpj: string;
  tel1: string;
  tel2: string;
  email: string;
  repeticao: number;
};


const CardEdit: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: yupResolver(schema) as any, // Ajuste temporário para contornar erro de tipo
  });
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone1: '',
    telefone2: '',
    situacao: 'A',
    repeticao: 1,
  });

  const handleEdit = (card: any) => {
    setSelectedCardId(card.id);
    setFormData({
      nome: card.nome,
      cnpj: card.cnpj,
      email: card.email,
      telefone1: card.telefone1,
      telefone2: card.telefone2,
      situacao: card.situacao,
      repeticao: card.repeticao,
    });
  };

  const handleSave = () => {
    console.log("Dados a serem salvos:", formData);
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
                <Controller
                  name="cnpj"
                  control={control}
                  render={({ field }) => (
                <input {...field}
                  type="text"
                  value={formatCnpj(formData.cnpj)}
                  onChange={(e) => setFormData({ ...formData, cnpj: formatCnpj(e.target.value) })}
                  className="flex-grow border rounded-md p-2"/>
                )}
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
                <Controller
                  name="tel1"
                  control={control}
                  render={({ field }) => (
                  <input {...field}
                    type="text"
                    value={formatPhoneNumber(formData.telefone1)}
                    onChange={(e) => setFormData({ ...formData, telefone1: formatPhoneNumber(e.target.value) })}
                    className="flex-grow border rounded-md p-2"
                  />
                )}
                />
              </div>
              <div className="flex items-center space-x-2">
                <HiOutlinePhone className="text-gray-500" />
                <Controller
                  name="tel2"
                  control={control}
                  render={({ field }) => (
                  <input {...field}
                    type="text"
                    value={formatPhoneNumber(formData.telefone2)}
                    onChange={(e) => setFormData({ ...formData, telefone2: formatPhoneNumber(e.target.value) })}
                    className="flex-grow border rounded-md p-2"
                  />
                )}
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
                <span>{formatCnpj(card.cnpj)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <HiOutlineMail className="text-gray-500" />
                <span>{card.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <HiOutlinePhone className="text-gray-500" />
                <span>{formatPhoneNumber(card.telefone1)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <HiOutlinePhone className="text-gray-500" />
                <span>{formatPhoneNumber(card.telefone2)}</span>
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
