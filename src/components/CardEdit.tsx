import React, { useState, useEffect } from 'react';
import { HiOutlineIdentification, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';
import axiosInstance from '@/instance/axiosInstance';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { formatCnpj, formatPhoneNumber, formatCurrency, parseCurrency } from '@/helpers/format';

interface CardEditProps {
  searchTerm: string;
}

// Atualizando o schema de validação
const schema = yup.object().shape({
  nome: yup.string().required('Nome é obrigatório'),
  cnpj: yup.string().matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido').required('CNPJ é obrigatório'),
  tel1: yup.string().matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido').max(15, 'Telefone deve ter no máximo 15 caracteres'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  repeticao: yup.number().integer('Repetição deve ser um número inteiro').required('Repetição é obrigatória'),
  nr_valor: yup.number().positive('Valor deve ser positivo').nullable(),
  dt_processo: yup.date().nullable()
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
  nr_valor?: number;
  dt_processo?: Date;
};

const CardEdit: React.FC<CardEditProps> = ({ searchTerm }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredData, setFilteredData] = useState<Card[]>([]);
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
    nr_valor: undefined,
    dt_processo: undefined,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<Card>({
    resolver: yupResolver(schema) as any,
  });

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
          nr_valor: card.nr_valor,
          dt_processo: card.dt_processo ? new Date(card.dt_processo) : undefined
        }));
        setCards(formattedCards);
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
      });
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredData(
        cards.filter((item) =>
          item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.cnpj.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredData(cards);
    }
  }, [searchTerm, cards]);

  const handleEdit = (card: Card) => {
    setSelectedCardId(card.id);
    setFormData({
      ...card,
      cnpj: formatCnpj(card.cnpj),
      telefone1: formatPhoneNumber(card.telefone1),
      telefone2: formatPhoneNumber(card.telefone2),
      nr_valor: card.nr_valor ?? 0, // Definindo valor padrão para formatação
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
        nr_valor: formData.nr_valor,
        dt_processo: formData.dt_processo,
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
          nr_valor: card.nr_valor,
          dt_processo: card.dt_processo ? new Date(card.dt_processo) : undefined
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

  // Função para formatar o valor em tempo real
  const handleValueChange = (value: string) => {
    const numericValue = parseCurrency(value);
    setFormData({
      ...formData,
      nr_valor: isNaN(numericValue) ? undefined : numericValue
    });
  };

  return (
    <div className="space-y-4">
      {filteredData.map((card) => (
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
              {/* Campos ocultos */}
              <div className="flex items-center space-x-2 mt-2">
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
              <div className="flex items-center space-x-2 mt-2">
                <label className="flex items-center space-x-2">
                  <span>Repetição:</span>
                  <input
                    type="number"
                    value={formData.repeticao}
                    onChange={(e) => setFormData({ ...formData, repeticao: Number(e.target.value) })}
                    className="border rounded-md p-2"
                    disabled={isLoading}
                  />
                </label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <label className="flex items-center space-x-2">
                  <span>Valor:</span>
                  <input
                    type="text"
                    value={formData.nr_valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? ''}
                    onChange={(e) => handleValueChange(e.target.value)}
                    className="border rounded-md p-2"
                    disabled={isLoading}
                  />
                </label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <label className="flex items-center space-x-2">
                  <span>Data do Processo:</span>
                  <input
                    type="date"
                    value={formData.dt_processo ? formData.dt_processo.toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, dt_processo: e.target.value ? new Date(e.target.value) : undefined })}
                    className="border rounded-md p-2"
                    disabled={isLoading}
                  />
                </label>
              </div>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  disabled={isLoading}
                >
                  {isLoading ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col space-y-2">
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
              <button
                onClick={() => handleEdit(card)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Editar
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CardEdit;
