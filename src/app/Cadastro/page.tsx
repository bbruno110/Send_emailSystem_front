'use client';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import * as yup from 'yup';
import Modal from '@/components/Modal';
import axiosInstance from '@/instance/axiosInstance';

// Função para formatar o valor como moeda
const formatCurrency = (value: string) => {
  if (!value) return ''; // Retorna uma string vazia se o valor for vazio

  // Remove todos os caracteres não numéricos
  const numericValue = value.replace(/\D/g, '');

  // Converte a string numérica para número e divide por 100
  const number = parseFloat(numericValue) / 100;

  // Converte o número para o formato desejado
  return number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Função para converter o valor de volta para número
const parseCurrency = (value: string) => {
  const numericValue = value.replace(/\D/g, '');
  return parseFloat(numericValue) / 100;
};

// Função para formatar o CNPJ
const formatCnpj = (value: string): string => {
  const numericValue = value.replace(/\D/g, '');
  const formattedValue = numericValue
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
  return formattedValue.slice(0, 18);
};

// Função para formatar o CPF
const formatCpf = (value: string): string => {
  const numericValue = value.replace(/\D/g, '');
  const formattedValue = numericValue
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
  return formattedValue.slice(0, 14);
};

// Função para formatar o telefone
const formatPhoneNumber = (value: string): string => {
  const numericValue = value.replace(/\D/g, '');
  const formattedValue = numericValue
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
  return formattedValue.slice(0, 15);
};

// Esquema de validação do Yup
const schema = yup.object().shape({
  nome: yup.string().required('Nome é obrigatório'),
  documento: yup.string()
    .required('Documento é obrigatório')
    .test('documento', 'Documento inválido', (value) => {
      if (value) {
        // Verifica se é um CPF ou CNPJ válido
        const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        const cnpjPattern = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
        return cpfPattern.test(value) || cnpjPattern.test(value);
      }
      return false;
    }),
  tel1: yup.string().matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido').max(15, 'Telefone deve ter no máximo 15 caracteres').required('Telefone é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  repeticao: yup.number().integer('Repetição deve ser um número inteiro').required('Repetição é obrigatória'),
  dt_processo: yup.date().required('Data do processo é obrigatória'),
  nr_processo: yup.number().typeError('Número do processo deve ser um número').required('Número do processo é obrigatório'),
  nr_valor: yup.string().required('Valor é obrigatório'),
});

type FormValues = {
  nome: string;
  tipoDocumento: 'CPF' | 'CNPJ'; // Adicionado tipoDocumento
  documento: string;
  tel1: string;
  tel2: string;
  email: string;
  repeticao: number;
  dt_processo: string;
  nr_valor: string; // Alterado para string para permitir a formatação
  nr_processo: number;
};

const RegisterForm = () => {
  const { control, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      nome: '',
      tipoDocumento: 'CPF', // Valor padrão
      documento: '',
      tel1: '',
      tel2: '',
      email: '',
      repeticao: 0,
      dt_processo: '',
      nr_valor: '',
      nr_processo: 0,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Remove a formatação de moeda para enviar o valor como número
      const formattedData = {
        ...data,
        nr_valor: parseCurrency(data.nr_valor),
      };
      const response = await axiosInstance.post('register-frm', formattedData);
      if (response.status === 200) {
        reset({
          nome: '',
          tipoDocumento: 'CPF', // Reset valor padrão
          documento: '',
          tel1: '',
          tel2: '',
          email: '',
          repeticao: 0,
          dt_processo: '',
          nr_valor: '',
          nr_processo: 0, // Certifique-se de definir o valor padrão como 0 ou vazio
        });
      }
      if (response.status === 226) {
        alert('CPF ou CNPJ já cadastrado')
      }
      else {
        console.error('Erro ao enviar os dados: resposta inesperada', response);
      }
    } catch (error) {
      console.error('Erro ao enviar os dados: ', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const tipoDocumento = watch('tipoDocumento');
  const documentoValue = watch('documento');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen md:mt-[-25px] bg-blue-100 select-none">
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title='Editar Cadastro'>
        {/* Conteúdo do Modal */}
      </Modal>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl w-full bg-white p-4 rounded-lg shadow-md">
        {/* Botão Listar Empresas */}
        <button
          onClick={handleOpenModal}
          type="button"
          className="mb-2 mt-4 md:mb-6 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300 ease-in-out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block align-text-top mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1zm9-1a1 1 0 011 1h4a1 1 0 110 2h-4a1 1 0 01-1-1zM4 9a1 1 0 011-1h4a1 1 0 110 2H5a1 1 0 01-1-1zm9-1a1 1 0 011 1h4a1 1 0 110 2h-4a1 1 0 01-1-1zm-9 5a1 1 0 011 1h4a1 1 0 110 2H5a1 1 0 01-1-1zm9-1a1 1 0 011 1h4a1 1 0 110 2h-4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          Listar Empresas
        </button>

        {/* Campo Nome */}
        <div className="mb-4">
          <label htmlFor="nome" className="block font-semibold">Nome da Empresa</label>
          <Controller
            name="nome"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="nome"
                className={`border ${errors.nome ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded focus:outline-none focus:border-blue-500`}
              />
            )}
          />
          {errors.nome && <p className="text-red-500">{errors.nome.message}</p>}
        </div>

        <div className="flex flex-wrap -mx-2">
          {/* Tipo de Documento */}
          <div className="mb-4 w-full md:w-1/2 px-2">
            <label htmlFor="tipoDocumento" className="block font-semibold">Tipo de Documento</label>
            <Controller
              name="tipoDocumento"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="tipoDocumento"
                  className={`border ${errors.tipoDocumento ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded focus:outline-none focus:border-blue-500`}
                >
                  <option value="CPF">CPF</option>
                  <option value="CNPJ">CNPJ</option>
                </select>
              )}
            />
            {errors.tipoDocumento && <p className="text-red-500">{errors.tipoDocumento.message}</p>}
          </div>

          {/* Campo Documento */}
          <div className="mb-4 w-full md:w-1/2 px-2">
            <label htmlFor="documento" className="block font-semibold">Documento</label>
            <Controller
              name="documento"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="documento"
                  className={`border ${errors.documento ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded focus:outline-none focus:border-blue-500`}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    const formattedValue = tipoDocumento === 'CNPJ' ? formatCnpj(rawValue) : formatCpf(rawValue);
                    setValue('documento', formattedValue, { shouldValidate: true });
                  }}
                />
              )}
            />
            {errors.documento && <p className="text-red-500">{errors.documento.message}</p>}
          </div>
        </div>

        <div className="flex flex-wrap -mx-2">
          {/* Campo Telefone 1 */}
          <div className="mb-4 w-full md:w-1/2 px-2">
            <label htmlFor="tel1" className="block font-semibold">Telefone 1</label>
            <Controller
              name="tel1"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="tel1"
                  className={`border ${errors.tel1 ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded focus:outline-none focus:border-blue-500`}
                  onChange={(e) => {
                    const formattedValue = formatPhoneNumber(e.target.value);
                    setValue('tel1', formattedValue, { shouldValidate: true });
                  }}
                />
              )}
            />
            {errors.tel1 && <p className="text-red-500">{errors.tel1.message}</p>}
          </div>

          {/* Campo Telefone 2 */}
          <div className="mb-4 w-full md:w-1/2 px-2">
            <label htmlFor="tel2" className="block font-semibold">Telefone 2</label>
            <Controller
              name="tel2"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="tel2"
                  className={`border ${errors.tel2 ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded focus:outline-none focus:border-blue-500`}
                  onChange={(e) => {
                    const formattedValue = formatPhoneNumber(e.target.value);
                    setValue('tel2', formattedValue, { shouldValidate: true });
                  }}
                />
              )}
            />
            {errors.tel2 && <p className="text-red-500">{errors.tel2.message}</p>}
          </div>
        </div>

        <div className="flex flex-wrap -mx-2">
          {/* Campo Email */}
          <div className="mb-4 w-full md:w-1/2 px-2">
            <label htmlFor="email" className="block font-semibold">Email</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="email"
                  className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded focus:outline-none focus:border-blue-500`}
                />
              )}
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          {/* Campo Repetição */}
          <div className="mb-4 w-full md:w-1/2 px-2">
            <label htmlFor="repeticao" className="block font-semibold">Repetição</label>
            <Controller
              name="repeticao"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  id="repeticao"
                  className={`border ${errors.repeticao ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded focus:outline-none focus:border-blue-500`}
                />
              )}
            />
            {errors.repeticao && <p className="text-red-500">{errors.repeticao.message}</p>}
          </div>
        </div>

        <div className="flex flex-wrap -mx-2">
          {/* Campo Data do Processo */}
          <div className="mb-4 w-full md:w-1/2 px-2">
            <label htmlFor="dt_processo" className="block font-semibold">Data do Processo</label>
            <Controller
              name="dt_processo"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="date"
                  id="dt_processo"
                  className={`border ${errors.dt_processo ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded focus:outline-none focus:border-blue-500`}
                />
              )}
            />
            {errors.dt_processo && <p className="text-red-500">{errors.dt_processo.message}</p>}
          </div>

          {/* Campo Número do Processo */}
          <div className="mb-4 w-full md:w-1/2 px-2">
            <label htmlFor="nr_processo" className="block font-semibold">Número do Processo</label>
            <Controller
              name="nr_processo"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  id="nr_processo"
                  className={`border ${errors.nr_processo ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded focus:outline-none focus:border-blue-500`}
                />
              )}
            />
            {errors.nr_processo && <p className="text-red-500">{errors.nr_processo.message}</p>}
          </div>
        </div>

        {/* Campo Valor */}
        <div className="mb-4">
          <label htmlFor="nr_valor" className="block font-semibold">Valor</label>
          <Controller
            name="nr_valor"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="nr_valor"
                className={`border ${errors.nr_valor ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded focus:outline-none focus:border-blue-500`}
                onChange={(e) => {
                  const formattedValue = formatCurrency(e.target.value);
                  setValue('nr_valor', formattedValue, { shouldValidate: true });
                }}
              />
            )}
          />
          {errors.nr_valor && <p className="text-red-500">{errors.nr_valor.message}</p>}
        </div>

        {/* Botão Submeter */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
