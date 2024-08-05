import React from 'react';
import { HiOutlineIdentification, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';
import { HiDevicePhoneMobile } from 'react-icons/hi2';
import { FiCalendar, FiAlertCircle, FiDollarSign, FiClock, FiCheckCircle, FiXCircle, FiRefreshCcw, FiFileText } from 'react-icons/fi'; // Importa o novo ícone
import { formatCnpj, formatPhoneNumber } from '@/helpers/format';

interface CardProps {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone1?: string;
  telefone2?: string;
  dt_vencimento: string;
  dt_processo: string;
  nr_valor: string;
  nr_processo: string;
  selected: boolean;
  ie_status: string;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const statusIcons: { [key: string]: React.ReactNode } = {
  'Inicial': <FiCheckCircle className="text-green-500" title="Inicial" />,
  'Em Progresso': <FiRefreshCcw className="text-yellow-500" title="Em Progresso" />,
  'Concluído': <FiCheckCircle className="text-blue-500" title="Concluído" />,
  'Cancelado': <FiXCircle className="text-red-500" title="Cancelado" />,
  // Adicione outros status e ícones conforme necessário
};

const Card: React.FC<CardProps> = ({
  id,
  nome,
  cnpj,
  email,
  telefone1,
  telefone2,
  dt_vencimento,
  dt_processo,
  nr_valor,
  ie_status,
  nr_processo,
  selected,
  onClick,
  onContextMenu,
}) => {
  const isDueSoon = isDateDueSoon(dt_vencimento);
  const isOverdue = isDateOverdue(dt_vencimento);

  // Definir classes de estilo baseadas no estado do vencimento e seleção
  let borderColorClass = 'border-gray-300'; // Cor padrão
  let backgroundColorClass = 'bg-white'; // Cor padrão do fundo

  if (isOverdue) {
    borderColorClass = 'border-red-500'; // Card vencido
    backgroundColorClass = 'bg-red-50'; // Fundo para vencido
  } else if (isDueSoon) {
    borderColorClass = 'border-yellow-500'; // Card próximo a vencer
    backgroundColorClass = 'bg-yellow-50'; // Fundo para próximo a vencer
  }

  // Aplica cor mais escura e sombra quando o card está selecionado
  const selectedBackgroundClass = selected
    ? 'bg-gray-200 border-blue-500 shadow-md' // Cor de fundo mais escura e borda azul
    : backgroundColorClass;

  // Função para exibir "Não informado" quando o valor é null ou undefined
  const displayValue = (value: string | undefined | null): string => {
    return value ?? 'Não informado';
  };

  return (
    <div
      className={`card-container border ${borderColorClass} ${selectedBackgroundClass} rounded-lg h-full flex flex-col p-4 mb-4 cursor-pointer transition-transform transform ${selected ? 'scale-105' : ''}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <div className="flex items-center mb-2">
        <HiOutlineIdentification className="text-gray-600 mr-2" />
        <h2 className="text-lg font-bold">{displayValue(nome)}</h2>
      </div>
      <div className="flex items-center mb-2">
        <HiOutlineIdentification className="text-gray-400 mr-2" />
        <p className="text-sm text-gray-600">CNPJ: {formatCnpj(displayValue(cnpj))}</p>
      </div>
      <div className="flex items-center mb-2">
        <HiOutlineMail className="text-gray-400 mr-2" />
        <p className="text-sm text-gray-600">Email: {displayValue(email)}</p>
      </div>
      {telefone1 && (
        <div className="flex items-center mb-2">
          <HiOutlinePhone className="text-gray-400 mr-2" />
          <p className="text-sm text-gray-600">Telefone 1: {formatPhoneNumber(displayValue(telefone1))}</p>
        </div>
      )}
      {telefone2 && (
        <div className="flex items-center mb-2">
          <HiDevicePhoneMobile className="text-gray-400 mr-2" />
          <p className="text-sm text-gray-600">Telefone 2: {formatPhoneNumber(displayValue(telefone2))}</p>
        </div>
      )}
      <div className={`flex items-center mb-2 ${isDueSoon ? 'text-yellow-800' : ''} ${isOverdue ? 'text-red-800' : ''}`}>
        <FiCalendar className="text-gray-400 mr-2" />
        <p className="text-sm text-gray-600">Data de Vencimento: {formatDate(displayValue(dt_vencimento))}</p>
        {isDueSoon && (
          <FiAlertCircle className="ml-2 text-yellow-500" title="Próximo a vencer" />
        )}
        {isOverdue && (
          <FiAlertCircle className="ml-2 text-red-500" title="Vencido" />
        )}
      </div>
      <div className="flex items-center mb-2">
        <FiClock className="text-gray-400 mr-2" />
        <p className="text-sm text-gray-600">Data de Processo: {formatDate(displayValue(dt_processo))}</p>
      </div>
      
      { nr_processo && 
      <div className="flex items-center mb-2 ">
        {statusIcons[ie_status] || <FiFileText className="text-gray-400" title="Status desconhecido" />}
        <p className="text-sm ml-2 text-gray-600">N° Processo: {displayValue(nr_processo)}</p>
      </div>
      }
      <div className="flex items-center mb-2">
        <FiDollarSign className="text-gray-400 mr-2" />
        <p className="text-sm text-gray-600">Valor: R$ {displayValue(nr_valor)}</p>
      </div>
      <div className="flex items-center mt-2">
        {statusIcons[ie_status] || <FiAlertCircle className="text-gray-400" title="Status desconhecido" />}
        <p className="text-sm ml-2 text-gray-600">Situação: {ie_status}</p>
      </div>
    </div>
  );
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

function isDateDueSoon(dt_vencimento: string): boolean {
  const dueDate = new Date(dt_vencimento);
  const currentDate = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(currentDate.getMonth() + 1);

  return dueDate > currentDate && dueDate <= oneMonthLater;
}

function isDateOverdue(dt_vencimento: string): boolean {
  const dueDate = new Date(dt_vencimento);
  const currentDate = new Date();

  return dueDate < currentDate;
}

export default Card;
