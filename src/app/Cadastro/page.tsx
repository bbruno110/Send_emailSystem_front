'use client'
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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
  return formattedValue.slice(0, 18); // CNPJ tem 18 caracteres formatados
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

// Função para formatar CEP
const formatCep = (value: string): string => {
  // Remove caracteres não numéricos
  const numericValue = value.replace(/\D/g, '');

  // Formatação: 00000-000
  const formattedValue = numericValue
    .replace(/^(\d{5})(\d)/, '$1-$2');

  // Limita a quantidade de caracteres após a formatação
  return formattedValue.slice(0, 9); // CEP tem 9 caracteres formatados
};

const schema = yup.object().shape({
  nome: yup.string().required('Nome é obrigatório'),
  cnpj: yup.string().matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido').required('CNPJ é obrigatório'),
  tel1: yup.string().matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone 1 inválido').max(15, 'Telefone 1 deve ter no máximo 15 caracteres').required('Telefone 1 é obrigatório'),
  tel2: yup.string().matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone 2 inválido').max(15, 'Telefone 2 deve ter no máximo 15 caracteres').required('Telefone 2 é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  endereco: yup.object().shape({
    rua: yup.string().required('Rua é obrigatória'),
    numero: yup.string().matches(/^\d+$/, 'Número deve conter apenas números').required('Número é obrigatório'),
    bairro: yup.string().required('Bairro é obrigatório'),
    cidade: yup.string().required('Cidade é obrigatória'),
    estado: yup.string().required('Estado é obrigatório'),
    cep: yup.string().matches(/^\d{5}-\d{3}$/, 'CEP inválido').required('CEP é obrigatório'),
    complemento: yup.string().notRequired(),
  }),
});

type FormValues = {
  nome: string;
  cnpj: string;
  tel1: string;
  tel2: string;
  email: string;
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    complemento?: string;
  };
};

const RegisterForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: yupResolver(schema) as any, // Ajuste temporário para contornar erro de tipo
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // Envio dos dados para o servidor
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto bg-slate-50 p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bloco Principal */}
        <div>
          <div className="border-slate-200 border-2 rounded-lg p-4 space-y-4">
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
                      placeholder="(00) 00000-0000"
                      className={`mt-1 block w-full px-3 py-2 border ${errors.tel1 ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  )}
                />
                {errors.tel1 && <p className="mt-2 text-sm text-red-600">{errors.tel1.message}</p>}
              </div>
              <div className="w-full md:w-1/2">
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
                      placeholder="(00) 00000-0000"
                      className={`mt-1 block w-full px-3 py-2 border ${errors.tel2 ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  )}
                />
                {errors.tel2 && <p className="mt-2 text-sm text-red-600">{errors.tel2.message}</p>}
              </div>
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
                    className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                )}
              />
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
            </div>
          </div>
        </div>

        {/* Bloco Endereço */}
        <div className="md:col-span-2">
          <div className="border-slate-200 border-2 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rua */}
              <div>
                <label htmlFor="rua" className="block text-sm font-medium text-gray-700">Rua</label>
                <Controller
                  name="endereco.rua"
                  control={control}
                  render={({ field }) => (
                    <input {...field}
                      id="rua"
                      type="text"
                      placeholder="Digite a rua"
                      className={`mt-1 block w-full px-3 py-2 border ${errors.endereco?.rua ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  )}
                />
                {errors.endereco?.rua && <p className="mt-2 text-sm text-red-600">{errors.endereco?.rua.message}</p>}
              </div>
              {/* Número e Bairro (em linha) */}
              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="w-full md:w-1/2">
                  <label htmlFor="numero" className="block text-sm font-medium text-gray-700">Número</label>
                  <Controller
                    name="endereco.numero"
                    control={control}
                    render={({ field }) => (
                      <input {...field}
                        id="numero"
                        type="text"
                        inputMode="numeric" // Restringe entrada apenas a números
                        placeholder="Digite o número"
                        className={`mt-1 block w-full px-3 py-2 border ${errors.endereco?.numero ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      />
                    )}
                  />
                  {errors.endereco?.numero && <p className="mt-2 text-sm text-red-600">{errors.endereco?.numero.message}</p>}
                </div>
                <div className="w-full md:w-1/2">
                  <label htmlFor="bairro" className="block text-sm font-medium text-gray-700">Bairro</label>
                  <Controller
                    name="endereco.bairro"
                    control={control}
                    render={({ field }) => (
                      <input {...field}
                        id="bairro"
                        type="text"
                        placeholder="Digite o bairro"
                        className={`mt-1 block w-full px-3 py-2 border ${errors.endereco?.bairro ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      />
                    )}
                  />
                  {errors.endereco?.bairro && <p className="mt-2 text-sm text-red-600">{errors.endereco?.bairro.message}</p>}
                </div>
              </div>
              {/* Estado e CEP (em linha) */}
              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="w-full md:w-1/2">
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
                  <Controller
                    name="endereco.estado"
                    control={control}
                    render={({ field }) => (
                      <input {...field}
                        id="estado"
                        type="text"
                        placeholder="Digite o estado"
                        className={`mt-1 block w-full px-3 py-2 border ${errors.endereco?.estado ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      />
                    )}
                  />
                  {errors.endereco?.estado && <p className="mt-2 text-sm text-red-600">{errors.endereco?.estado.message}</p>}
                </div>
                <div className="w-full md:w-1/2">
                  <label htmlFor="cep" className="block text-sm font-medium text-gray-700">CEP</label>
                  <Controller
                    name="endereco.cep"
                    control={control}
                    render={({ field }) => (
                      <input {...field}
                        id="cep"
                        type="text"
                        onChange={(e) => {
                          field.onChange(formatCep(e.target.value));
                        }}
                        placeholder="00000-000"
                        className={`mt-1 block w-full px-3 py-2 border ${errors.endereco?.cep ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      />
                    )}
                  />
                  {errors.endereco?.cep && <p className="mt-2 text-sm text-red-600">{errors.endereco?.cep.message}</p>}
                </div>
              </div>
              {/* Cidade */}
              <div>
                <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">Cidade</label>
                <Controller
                  name="endereco.cidade"
                  control={control}
                  render={({ field }) => (
                    <input {...field}
                      id="cidade"
                      type="text"
                      placeholder="Digite a cidade"
                      className={`mt-1 block w-full px-3 py-2 border ${errors.endereco?.cidade ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  )}
                />
                {errors.endereco?.cidade && <p className="mt-2 text-sm text-red-600">{errors.endereco?.cidade.message}</p>}
              </div>
              {/* Complemento */}
              <div>
                <label htmlFor="complemento" className="block text-sm font-medium text-gray-700">Complemento</label>
                <Controller
                  name="endereco.complemento"
                  control={control}
                  render={({ field }) => (
                    <textarea {...field}
                      id="complemento"
                      placeholder="Digite o complemento"
                      className={`mt-1 block w-full px-3 py-2 border ${errors.endereco?.complemento ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  )}
                />
                {errors.endereco?.complemento && <p className="mt-2 text-sm text-red-600">{errors.endereco?.complemento.message}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão de Submit */}
      <div className="flex justify-end mt-6">
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Cadastrar
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
