'use client'
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import * as yup from 'yup';
import Modal from '@/components/Modal';
import CardEdit from '@/components/CardEdit';

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
  nome: yup.string().required('Nome é obrigatório'),
  cnpj: yup.string().matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido').required('CNPJ é obrigatório'),
  tel1: yup.string().matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido').max(15, 'Telefone deve ter no máximo 15 caracteres').required('Telefone é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  repeticao: yup.number().integer('Repetição deve ser um número inteiro').required('Repetição é obrigatória'),
});

type FormValues = {
  nome: string;
  cnpj: string;
  tel1: string;
  tel2: string;
  email: string;
  repeticao: number;
};

const RegisterForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: yupResolver(schema) as any, // Ajuste temporário para contornar erro de tipo
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // Envio dos dados para o servidor
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 select-none">
      {/* Botão Listar Empresas */}
      <button onClick={handleOpenModal} type="button" className="mb-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300 ease-in-out">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block align-text-top mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1zm9-1a1 1 0 011 1h4a1 1 0 110 2h-4a1 1 0 01-1-1zM4 9a1 1 0 011-1h4a1 1 0 110 2H5a1 1 0 01-1-1zm9-1a1 1 0 011 1h4a1 1 0 110 2h-4a1 1 0 01-1-1zm-9 5a1 1 0 011-1h4a1 1 0 110 2H5a1 1 0 01-1-1zm9-1a1 1 0 011 1h4a1 1 0 110 2h-4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
        Listar Empresas
      </button>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <CardEdit/>
      </Modal>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Página de Cadastro</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bloco Principal */}
          <div>
            <div className="border-gray-200 border-2 rounded-lg p-4 space-y-4">
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
                      placeholder="00.000.000/0000-00"
                      className={`mt-1 block w-full px-3 py-2 border ${errors.cnpj ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  )}
                />
                {errors.cnpj && <p className="mt-2 text-sm text-red-600">{errors.cnpj.message}</p>}
              </div>
              {/* Telefone 1 e Telefone 2 (em linha) */}
              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="w-full md:w-1/2">
                  <label htmlFor="tel1" className="block text-sm font-medium text-gray-700">Telefone</label>
                  <Controller
                    name="tel1"
                    control={control}
                    render={({ field }) => (
                      <input {...field}
                        type="text"
                        onChange={(e) => {
                          field.onChange(formatPhoneNumber(e.target.value));
                        }}
                        placeholder="(00) 00000-0000"
                        className={`mt-1 block w-full px-3 py-2 border ${errors.tel1 ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      />
                    )}
                  />
                  {errors.tel1 && <p className="mt-2 text-sm text-red-600">{errors.tel1.message}</p>}
                </div>
                
              </div>
            </div>
          </div>

          {/* Bloco Secundário */}
          <div>
            <div className="border-gray-200 border-2 rounded-lg p-4 space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <input {...field}
                      type="text"
                      placeholder="email@example.com"
                      className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  )}
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
              </div>
              {/* Repetição */}
              <div>
                <label htmlFor="repeticao" className="block text-sm font-medium text-gray-700">Repetição</label>
                <Controller
                  name="repeticao"
                  control={control}
                  render={({ field }) => (
                    <input {...field}
                      type="number"
                      placeholder="Digite a repetição de meses que deverá ser notificado"
                      className={`mt-1 block w-full px-3 py-2 border ${errors.repeticao ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  )}
                />
                {errors.repeticao && <p className="mt-2 text-sm text-red-600">{errors.repeticao.message}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Botão de Envio */}
        <div className="mt-6 flex justify-end">
          <button type="submit" className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
