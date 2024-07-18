import React, { useState, useEffect } from 'react';
import { HiOutlineIdentification, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';
import axiosInstance from '@/instance/axiosInstance';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';

// Função para formatar CNPJ
const formatCnpj = (value: string): string => {
  const numericValue = value.replace(/\D/g, '');
  const formattedValue = numericValue
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
  return formattedValue.slice(0, 18);
};

// Função para formatar números de telefone
const formatPhoneNumber = (value: string): string => {
  const numericValue = value.replace(/\D/g, '');
  const formattedValue = numericValue
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
  return formattedValue.slice(0, 15);
};

const schema = yup.object().shape({
  nome: yup.string().required('Nome é obrigatório'),
  cnpj: yup.string().matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido').required('CNPJ é obrigatório'),
  tel1: yup.string().matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido').max(15, 'Telefone deve ter no máximo 15 caracteres'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  repeticao: yup.number().integer('Repetição deve ser um número inteiro').required('Repetição é obrigatória'),
});

type Card = {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone1: string;
  telefone2: string;
  situacao: string;
  repeticao: number;
};

const CardEdit: React.FC = () => {
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<Card>({
    resolver: yupResolver(schema) as any,
  });
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Card>({
    id: 0,
    nome: '',
    cnpj: '',
    email: '',
    telefone1: '',
    telefone2: '',
    situacao: 'A',
    repeticao: 1,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    axiosInstance.get('/list')
      .then(response => {
        const formattedCards = response.data.map((card: any) => ({
          id: card.id,
          nome: card.ds_nome,
          cnpj: formatCnpj(card.cd_cnpj),
          email: card.ds_email,
          telefone1: formatPhoneNumber(card.nr_telefone_1),
          telefone2: formatPhoneNumber(card.nr_telefone_2),
          situacao: card.ie_situacao,
          repeticao: card.nr_repeticao,
        }));
        setCards(formattedCards);
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
      });
  }, []);

  const handleEdit = (card: Card) => {
    setSelectedCardId(card.id);
    setFormData({
      ...card,
      cnpj: formatCnpj(card.cnpj),
      telefone1: formatPhoneNumber(card.telefone1),
      telefone2: formatPhoneNumber(card.telefone2),
    });
  };

  const handleSave = async () => {
    setIsLoading(true); // Inicia o carregamento
    try {
      await axiosInstance.put(`/edit/${formData.id}`, {
        ds_nome: formData.nome,
        cd_cnpj: formData.cnpj,
        nr_telefone_1: formData.telefone1,
        nr_telefone_2: formData.telefone2,
        ds_email: formData.email,
        nr_repeticao: formData.repeticao,
        ie_situacao: formData.situacao,
      });

      setCards(prevCards =>
        prevCards.map(card =>
          card.id === formData.id ? { ...formData } : card
        )
      );
      setSelectedCardId(null);
    } catch (error) {
      console.error('Erro ao editar empresa:', error);
      alert('Erro ao realizar a atualização do cadastro.');
    } finally {
      axiosInstance.get('/list')
      .then(response => {
        const formattedCards = response.data.map((card: any) => ({
          id: card.id,
          nome: card.ds_nome,
          cnpj: formatCnpj(card.cd_cnpj),
          email: card.ds_email,
          telefone1: formatPhoneNumber(card.nr_telefone_1),
          telefone2: formatPhoneNumber(card.nr_telefone_2),
          situacao: card.ie_situacao,
          repeticao: card.nr_repeticao,
        }));
        setCards(formattedCards);
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
      });
      setIsLoading(false); // Finaliza o carregamento
    }
  };

  const handleCancel = () => {
    setSelectedCardId(null);
  };

  return (
    <div className="space-y-4">
      {cards.map((card) => (
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
                  disabled={isLoading}
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
                      value={formData.cnpj}
                      onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                      className="flex-grow border rounded-md p-2"
                      disabled={isLoading}
                    />
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
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center space-x-2">
                <HiOutlinePhone className="text-gray-500" />
                <Controller
                  name="telefone1"
                  control={control}
                  render={({ field }) => (
                    <input {...field}
                      type="text"
                      value={formData.telefone1}
                      onChange={(e) => setFormData({ ...formData, telefone1: e.target.value })}
                      className="flex-grow border rounded-md p-2"
                      disabled={isLoading}
                    />
                  )}
                />
              </div>
              <div className="flex items-center space-x-2">
                <HiOutlinePhone className="text-gray-500" />
                <Controller
                  name="telefone2"
                  control={control}
                  render={({ field }) => (
                    <input {...field}
                      type="text"
                      value={formData.telefone2}
                      onChange={(e) => setFormData({ ...formData, telefone2: e.target.value })}
                      className="flex-grow border rounded-md p-2"
                      disabled={isLoading}
                    />
                  )}
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.situacao === 'A'}
                    onChange={() => setFormData({ ...formData, situacao: formData.situacao === 'A' ? 'I' : 'A' })}
                    className="form-checkbox"
                    disabled={isLoading}
                  />
                  <span>Ativo</span>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={formData.repeticao}
                  onChange={(e) => setFormData({ ...formData, repeticao: parseInt(e.target.value) })}
                  className="flex-grow border rounded-md p-2"
                  disabled={isLoading}
                />
              </div>
              <div className="flex space-x-2">
                <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded" disabled={isLoading}>
                  Salvar
                </button>
                <button onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded" disabled={isLoading}>
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
                <span>{card.telefone1}</span>
              </div>
              <div className="flex items-center space-x-2">
                <HiOutlinePhone className="text-gray-500" />
                <span>{card.telefone2}</span>
              </div>
              <button onClick={() => handleEdit(card)} className="px-4 py-2 bg-blue-500 text-white rounded">
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
