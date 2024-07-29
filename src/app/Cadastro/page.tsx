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
  cnpj: yup.string().matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido').required('CNPJ é obrigatório'),
  tel1: yup.string().matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido').max(15, 'Telefone deve ter no máximo 15 caracteres').required('Telefone é obrigatório'),
  tel2: yup.string().matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido').max(15, 'Telefone deve ter no máximo 15 caracteres'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  repeticao: yup.number().integer('Repetição deve ser um número inteiro').required('Repetição é obrigatória'),
  dt_processo: yup.date().required('Data do processo é obrigatória'),
  nr_processo: yup.number().typeError('Número do processo deve ser um número').required('Número do processo é obrigatório'),
});

type FormValues = {
  nome: string;
  cnpj: string;
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
      cnpj: '',
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
          cnpj: '',
          tel1: '',
          tel2: '',
          email: '',
          repeticao: 0,
          dt_processo: '',
          nr_valor: '',
          nr_processo: 0, // Certifique-se de definir o valor padrão como 0 ou vazio
        });
      } else {
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

  const repeticaoValue = watch('repeticao');

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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Página de Cadastro</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coluna 1 */}
          <div className="space-y-4">
            {/* Nome */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome</label>
              <Controller
                name="nome"
                control={control}
                render={({ field }) => (
                  <input {...field}
                    type="text"
                    placeholder="Digite o nome"
                    disabled={isSubmitting}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.nome ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                )}
              />
              {errors.nome && <p className="mt-2 text-sm text-red-600">{errors.nome.message}</p>}
            </div>
            {/* CNPJ */}
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">CNPJ</label>
              <Controller
                name="cnpj"
                control={control}
                render={({ field }) => (
                  <input {...field}
                    type="text"
                    onChange={(e) => {
                      field.onChange(formatCnpj(e.target.value));
                    }}
                    value={formatCnpj(field.value)}
                    placeholder="Digite o CNPJ"
                    disabled={isSubmitting}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.cnpj ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                )}
              />
              {errors.cnpj && <p className="mt-2 text-sm text-red-600">{errors.cnpj.message}</p>}
            </div>
            {/* Telefone 1 */}
            <div>
              <label htmlFor="tel1" className="block text-sm font-medium text-gray-700">Telefone 1</label>
              <Controller
                name="tel1"
                control={control}
                render={({ field }) => (
                  <input {...field}
                    type="text"
                    onChange={(e) => {
                      field.onChange(formatPhoneNumber(e.target.value));
                    }}
                    value={formatPhoneNumber(field.value)}
                    placeholder="Digite o telefone 1"
                    disabled={isSubmitting}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.tel1 ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                )}
              />
              {errors.tel1 && <p className="mt-2 text-sm text-red-600">{errors.tel1.message}</p>}
            </div>
            {/* Telefone 2 */}
            <div>
              <label htmlFor="tel2" className="block text-sm font-medium text-gray-700">Telefone 2</label>
              <Controller
                name="tel2"
                control={control}
                render={({ field }) => (
                  <input {...field}
                    type="text"
                    onChange={(e) => {
                      field.onChange(formatPhoneNumber(e.target.value));
                    }}
                    value={formatPhoneNumber(field.value)}
                    placeholder="Digite o telefone 2"
                    disabled={isSubmitting}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.tel2 ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                )}
              />
              {errors.tel2 && <p className="mt-2 text-sm text-red-600">{errors.tel2.message}</p>}
            </div>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input {...field}
                    type="email"
                    placeholder="Digite o email"
                    disabled={isSubmitting}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                )}
              />
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
            </div>
          </div>
          {/* Coluna 2 */}
          <div className="space-y-4">
            {/* Repetição */}
            <div>
              <label htmlFor="repeticao" className="block text-sm font-medium text-gray-700">Repetição</label>
              <Controller
                name="repeticao"
                control={control}
                render={({ field }) => (
                  <input {...field}
                    type="number"
                    placeholder="Digite o número de repetições"
                    disabled={isSubmitting}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      setValue('repeticao', value > 0 ? value : 1); // Substitui zero por 1
                    }}
                    value={repeticaoValue <= 0 ? '' : repeticaoValue} // Limpa o campo se o valor for zero
                    className={`mt-1 block w-full px-3 py-2 border ${errors.repeticao ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                )}
              />
              {errors.repeticao && <p className="mt-2 text-sm text-red-600">{errors.repeticao.message}</p>}
            </div>
            {/* Data do Processo */}
            <div>
              <label htmlFor="dt_processo" className="block text-sm font-medium text-gray-700">Data do Processo</label>
              <Controller
                name="dt_processo"
                control={control}
                render={({ field }) => (
                  <input {...field}
                    type="date"
                    disabled={isSubmitting}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.dt_processo ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                )}
              />
              {errors.dt_processo && <p className="mt-2 text-sm text-red-600">{errors.dt_processo.message}</p>}
            </div>
            {/* Valor */}
            <div>
              <label htmlFor="nr_valor" className="block text-sm font-medium text-gray-700">Valor</label>
              <Controller
                name="nr_valor"
                control={control}
                render={({ field }) => (
                  <input {...field}
                    type="text"
                    placeholder="Digite o valor"
                    onChange={(e) => {
                      field.onChange(formatCurrency(e.target.value));
                    }}
                    value={formatCurrency(field.value)}
                    disabled={isSubmitting}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.nr_valor ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                )}
              />
              {errors.nr_valor && <p className="mt-2 text-sm text-red-600">{errors.nr_valor.message}</p>}
            </div>
            {/* Número do Processo */}
            <div>
              <label htmlFor="nr_processo" className="block text-sm font-medium text-gray-700">Número do Processo</label>
              <Controller
                name="nr_processo"
                control={control}
                render={({ field }) => (
                  <input {...field}
                    type="number"
                    placeholder="Digite o número do processo"
                    disabled={isSubmitting}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.nr_processo ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                )}
              />
              {errors.nr_processo && <p className="mt-2 text-sm text-red-600">{errors.nr_processo.message}</p>}
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md text-white ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
