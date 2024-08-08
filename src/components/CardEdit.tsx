import React, { useState, useEffect } from 'react';
import { HiOutlineIdentification, HiOutlineMail, HiOutlinePhone, HiOutlineDocument } from 'react-icons/hi';
import axiosInstance from '@/instance/axiosInstance';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { formatCnpj, parseCurrency, formatCpf } from '@/helpers/format';

interface CardEditProps {
  searchTerm: string;
}

const formatPhoneNumber = (value?: string): string => {
  if (!value) return ''; // Retorna uma string vazia se o valor for undefined, null ou vazio

  const numericValue = value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

  // Aplica a formatação no número
  const formattedValue = numericValue
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');

  return formattedValue.slice(0, 15); // Retorna o valor formatado, limitando a 15 caracteres
};

const schema = yup.object().shape({
  nome: yup.string().required('Nome é obrigatório'),
  documento: yup.string()
    .required('Documento é obrigatório')
    .test('documento', 'Documento inválido', (value) => {
      if (value) {
        const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        const cnpjPattern = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
        return cpfPattern.test(value) || cnpjPattern.test(value);
      }
      return false;
    }),
  tel1: yup.string().matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido').max(15, 'Telefone deve ter no máximo 15 caracteres').required('Telefone é obrigatório'),
  tel2: yup.string().matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido').max(15, 'Telefone deve ter no máximo 15 caracteres'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  repeticao: yup.number().integer('Repetição deve ser um número inteiro').required('Repetição é obrigatória'),
  dt_processo: yup.date().required('Data do processo é obrigatória'),
  nr_processo: yup.number().typeError('Número do processo deve ser um número').required('Número do processo é obrigatório'),
  nr_valor: yup.string().required('Valor é obrigatório'),
});

type Card = {
  id: number;
  nome: string;
  cnpj?: string;
  cpf?: string;
  email: string;
  telefone1: string;
  telefone2: string;
  situacao: string;
  repeticao: number;
  nr_valor?: number;
  dt_processo?: Date;
  nr_processo?: number;
};

const CardEdit: React.FC<CardEditProps> = ({ searchTerm }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredData, setFilteredData] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Card>({
    id: 0,
    nome: '',
    cnpj: '',
    cpf: '',
    email: '',
    telefone1: '',
    telefone2: '',
    situacao: 'A',
    repeticao: 1,
    nr_valor: undefined,
    dt_processo: undefined,
    nr_processo: undefined,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tipoDocumento, setTipoDocumento] = useState<'CPF' | 'CNPJ'>('CNPJ');

  const { handleSubmit, setValue, formState: { errors } } = useForm<Card>({
    resolver: yupResolver(schema) as any,
  });

  useEffect(() => {
    axiosInstance.get('/list')
      .then(response => {
        const formattedCards = response.data.map((card: any) => ({
          id: card.id,
          nome: card.ds_nome,
          cnpj: card.cd_cnpj ? formatCnpj(card.cd_cnpj) : undefined,
          cpf: card.nr_cpf ? formatCpf(card.nr_cpf) : undefined,
          email: card.ds_email,
          telefone1: formatPhoneNumber(card.nr_telefone_1),
          telefone2: card.nr_telefone_2 ? formatPhoneNumber(card.nr_telefone_2) : undefined,
          situacao: card.ie_situacao,
          repeticao: card.nr_repeticao,
          nr_valor: card.nr_valor ? parseCurrency(card.nr_valor) : undefined,
          dt_processo: card.dt_processo ? new Date(card.dt_processo) : undefined,
          nr_processo: card.nr_processo,
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
          (item.cnpj && item.cnpj.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.cpf && item.cpf.toLowerCase().includes(searchTerm.toLowerCase())) ||
          item.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredData(cards);
    }
  }, [searchTerm, cards]);

  const handleEdit = (card: Card) => {
    setSelectedCardId(card.id);
    setTipoDocumento(card.cnpj ? 'CNPJ' : 'CPF');
    setFormData({
      ...card,
      cnpj: card.cnpj ? formatCnpj(card.cnpj) : '',
      cpf: card.cpf ? formatCpf(card.cpf) : '',
      telefone1: formatPhoneNumber(card.telefone1),
      telefone2: formatPhoneNumber(card.telefone2),
      nr_valor: card.nr_valor ?? 0,
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
  
    // Função para remover caracteres não numéricos
    const removeNonNumeric = (value: string) => value.replace(/\D/g, '');
  
    // Verifica se o campo de documento está preenchido
    if ((tipoDocumento === 'CNPJ' && !formData.cnpj) || (tipoDocumento === 'CPF' && !formData.cpf)) {
      alert(`O campo ${tipoDocumento} deve ser preenchido completamente.`);
      setIsLoading(false);
      return;
    }
  
    // Verifica se o campo de telefone 1 está preenchido
    if (!formData.telefone1) {
      alert('O campo Telefone 1 deve ser preenchido.');
      setIsLoading(false);
      return;
    }
  
    // Verifica se o campo de telefone 2, se preenchido, está completo
    const telefone2Numerico = removeNonNumeric(formData.telefone2 ?? ''); // Usa '' como padrão
    if (formData.telefone2 && telefone2Numerico.length < 10) { // Supondo que o comprimento mínimo seja 10 dígitos
      alert('O campo Telefone 2 deve estar completo se preenchido.');
      setIsLoading(false);
      return;
    }
  
    // Verifica se o campo de email está preenchido
    if (!formData.email) {
      alert('O campo Email deve ser preenchido.');
      setIsLoading(false);
      return;
    }
  
    // Verifica se o campo de valor está preenchido
    if (!formData.nr_valor) {
      alert('O campo Valor deve ser preenchido.');
      setIsLoading(false);
      return;
    }
  
    try {
      await axiosInstance.put(`/edit/${formData.id}`, {
        ds_nome: formData.nome,
        cd_cnpj: tipoDocumento === 'CNPJ' ? removeNonNumeric(formData.cnpj ?? '') : null,
        nr_cpf: tipoDocumento === 'CPF' ? removeNonNumeric(formData.cpf ?? '') : null,
        nr_telefone_1: removeNonNumeric(formData.telefone1),
        nr_telefone_2: removeNonNumeric(formData.telefone2),
        ds_email: formData.email,
        nr_repeticao: formData.repeticao,
        ie_situacao: formData.situacao,
        nr_valor: formData.nr_valor,
        dt_processo: formData.dt_processo,
        nr_processo: formData.nr_processo,
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
            cnpj: card.cd_cnpj ? formatCnpj(card.cd_cnpj) : undefined,
            cpf: card.nr_cpf ? formatCpf(card.nr_cpf) : undefined,
            email: card.ds_email,
            telefone1: formatPhoneNumber(card.nr_telefone_1),
            telefone2: card.nr_telefone_2,
            situacao: card.ie_situacao,
            repeticao: card.nr_repeticao,
            nr_valor: card.nr_valor ? parseCurrency(card.nr_valor) : undefined,
            dt_processo: card.dt_processo ? new Date(card.dt_processo) : undefined,
            nr_processo: card.nr_processo,
          }));
          
          setCards(formattedCards);
          
        })
        .catch(error => {
          console.error('Erro ao buscar dados:', error);
        });
      setIsLoading(false);
    }
  };
  
  
  
  const handleCancel = () => {
    setSelectedCardId(null);
  };

  const handleValueChange = (value: string) => {
    const numericValue = parseCurrency(value);
    setFormData({
      ...formData,
      nr_valor: isNaN(numericValue) ? undefined : numericValue
    });
  };

  const handleDocumentoChange = (value: string) => {
    if (tipoDocumento === 'CNPJ') {
      setFormData({
        ...formData,
        cnpj: formatCnpj(value),
      });
    } else {
      setFormData({
        ...formData,
        cpf: formatCpf(value),
      });
    }
  };

  const handleTelefone1Change = (value: string) => {
    setFormData({
      ...formData,
      telefone1: formatPhoneNumber(value),
    });
  };

  const handleTelefone2Change = (value: string) => {
    setFormData({
      ...formData,
      telefone2: formatPhoneNumber(value),
    });
  };

  return (
    <div className="space-y-4 mb-28">
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
                <HiOutlineDocument className="text-gray-500" />
                <select
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value as 'CPF' | 'CNPJ')}
                  className="border rounded-md p-2"
                  disabled={isLoading}
                >
                  <option value="CPF">CPF</option>
                  <option value="CNPJ">CNPJ</option>
                </select>
                <input
                  type="text"
                  value={tipoDocumento === 'CNPJ' ? formData.cnpj : formData.cpf}
                  onChange={(e) => handleDocumentoChange(e.target.value)}
                  className="flex-grow border rounded-md p-2"
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center space-x-2">
                <HiOutlinePhone className="text-gray-500" />
                <input
                  type="text"
                  value={formData.telefone1}
                  onChange={(e) => handleTelefone1Change(e.target.value)}
                  className="flex-grow border rounded-md p-2"
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <HiOutlinePhone className="text-gray-500" />
                <input
                  type="text"
                  value={formData.telefone2}
                  onChange={(e) => handleTelefone2Change(e.target.value)}
                  className="flex-grow border rounded-md p-2"
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center space-x-2">
                <HiOutlineMail className="text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="flex-grow border rounded-md p-2"
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center space-x-2">
                <HiOutlineDocument className="text-gray-500" />
                <input
                  type="number"
                  value={formData.repeticao}
                  onChange={(e) => setFormData({ ...formData, repeticao: Number(e.target.value) })}
                  className="border rounded-md p-2"
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center space-x-2">
              <HiOutlineDocument className="text-gray-500" />
              <input
                  type="text"
                  value={formData.nr_valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? ''}
                  onChange={(e) => handleValueChange(e.target.value)}
                  className="border rounded-md p-2"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="situacao">Situação: </label>
                <input
                  id="situacao"
                  type="checkbox"
                  checked={formData.situacao === 'A'}
                  onChange={() => setFormData({ ...formData, situacao: formData.situacao === 'A' ? 'I' : 'A' })}
                />
                <label>{formData.situacao === 'A' ? ' Ativo ' : ' Inativo '}</label>
                {errors.situacao && <span>{errors.situacao.message}</span>}
              </div>
              <div className="flex items-center space-x-2">
                <label>Data do Processo</label>
                <input
                  type="date"
                  value={formData.dt_processo ? formData.dt_processo.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, dt_processo: e.target.value ? new Date(e.target.value) : undefined })}
                  className="border rounded-md p-2"
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button onClick={handleCancel} className="bg-gray-500 text-white rounded-md px-4 py-2" disabled={isLoading}>Cancelar</button>
                <button onClick={handleSave} className="bg-blue-500 text-white rounded-md px-4 py-2" disabled={isLoading}>Salvar</button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <HiOutlineIdentification className="text-gray-500" />
                <p className="flex-grow">{card.nome}</p>
              </div>
              <div className="flex items-center space-x-2">
                <HiOutlineDocument className="text-gray-500" />
                <p className="flex-grow">{card.cnpj || card.cpf}</p>
              </div>
              <div className="flex items-center space-x-2">
                <HiOutlinePhone className="text-gray-500" />
                <p className="flex-grow">{card.telefone1}</p>
              </div>
              {card.telefone2 &&
                <div className="flex items-center space-x-2">
                  <HiOutlinePhone className="text-gray-500" />
                  <p className="flex-grow">{card.telefone2}</p>
                </div>
              }
              
              <div className="flex items-center space-x-2">
                <HiOutlineMail className="text-gray-500" />
                <p className="flex-grow">{card.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                <HiOutlineDocument className="text-gray-500" />
                <p className="flex-grow">{card.nr_valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? ''}</p>
              </div>
              <div className="flex items-center space-x-2">
                <label>Data do Processo</label>
                <p className="flex-grow">{card.dt_processo ? card.dt_processo.toISOString().split('T')[0] : ''}</p>
              </div>
              <button onClick={() => handleEdit(card)} className="bg-blue-500 text-white rounded-md px-4 py-2 self-end">Editar</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default CardEdit;
