import React from 'react';
import { HiOutlineIdentification, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';
import { HiDevicePhoneMobile } from 'react-icons/hi2';
import { FiCalendar, FiAlertCircle, FiDollarSign, FiClock, FiCheckCircle, FiXCircle, FiRefreshCcw, FiFileText } from 'react-icons/fi';
import { formatCnpj, formatCpf, formatCurrency, formatPhoneNumber } from '@/helpers/format'; // Adicione formatCpf se necessário
import { format } from 'date-fns';

interface CardProps {
  id: number;
  nome: string;
  documento: string; // Campo genérico para CPF ou CNPJ
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
  documento,
  email,
  telefone1,
  telefone2,
  dt_vencimento,
  dt_processo,
  nr_valor,
  nr_processo,
  selected,
  ie_status,
  onClick,
  onContextMenu,
}) => {
  const isDueSoon = isDateDueSoon(dt_vencimento);
  const isOverdue = isDateOverdue(dt_vencimento);

  const borderColorClass = isOverdue
    ? 'border-red-500'
    : isDueSoon
    ? 'border-yellow-500'
    : 'border-gray-300'; 

  const backgroundColorClass = isOverdue
    ? 'bg-red-50'
    : isDueSoon
    ? 'bg-yellow-50'
    : 'bg-green-50';

  const selectedBackgroundClass = selected
    ? 'bg-gray-200 border-blue-500 shadow-md'
    : backgroundColorClass;

  const displayValue = (value: string | undefined | null): string => value ?? 'Não informado';

  // Formata o documento dependendo se é CPF ou CNPJ
  const formattedDocumento = formatDocument(documento);

  return (
    <div
      className={`card-container border ${borderColorClass} ${selectedBackgroundClass} rounded-lg flex flex-col p-4 mb-4 cursor-pointer transition-transform transform ${selected ? 'scale-105' : ''} max-w-full w-[350px] sm:w-full  md:w-auto`}
      onClick={onClick}
      onContextMenu={onContextMenu}
      aria-label={`Card de ${nome}`}
    >
      <div className="flex items-center mb-2">
        <HiOutlineIdentification className="text-gray-600 mr-2" />
        <h2 className="text-lg font-bold truncate">{displayValue(nome)}</h2>
      </div>
      <div className="flex items-center mb-2">
        <HiOutlineIdentification className="text-gray-400 mr-2" />
        <p className="text-sm text-gray-600 truncate">Doc: {formattedDocumento}</p>
      </div>
      <div className="flex items-center mb-2">
        <HiOutlineMail className="text-gray-400 mr-2" />
        <p className="text-sm text-gray-600 truncate">Email: {displayValue(email)}</p>
      </div>
      {telefone1 && (
        <div className="flex items-center mb-2">
          <HiOutlinePhone className="text-gray-400 mr-2" />
          <p className="text-sm text-gray-600 truncate">Telefone 1: {formatPhoneNumber(displayValue(telefone1))}</p>
        </div>
      )}
      {telefone2 && (
        <div className="flex items-center mb-2">
          <HiDevicePhoneMobile className="text-gray-400 mr-2" />
          <p className="text-sm text-gray-600 truncate">Telefone 2: {formatPhoneNumber(displayValue(telefone2))}</p>
        </div>
      )}
      <div className={`flex items-center mb-2 ${isDueSoon ? 'text-yellow-800' : ''} ${isOverdue ? 'text-red-800' : ''}`}>
        <FiCalendar className="text-gray-400 mr-2" />
        <p className="text-sm text-gray-600 truncate">Vencimento: {formatDate(displayValue(dt_vencimento))}</p>
        {isDueSoon && (
          <FiAlertCircle className="ml-2 text-yellow-500" title="Próximo a vencer" />
        )}
        {isOverdue && (
          <FiAlertCircle className="ml-2 text-red-500" title="Vencido" />
        )}
      </div>
      <div className="flex items-center mb-2">
        <FiClock className="text-gray-400 mr-2" />
        <p className="text-sm text-gray-600 truncate">Data de Processo: {formatDate(displayValue(dt_processo))}</p>
      </div>
      {nr_processo && (
        <div className="flex items-center mb-2">
          {statusIcons[ie_status] || <FiFileText className="text-gray-400" title="Status desconhecido" />}
          <p className="text-sm ml-2 text-gray-600 truncate">N° Processo: {displayValue(nr_processo)}</p>
        </div>
      )}
      <div className="flex items-center mb-2">
        <FiDollarSign className="text-gray-400 mr-2" />
        <p className="text-sm text-gray-600 truncate">Valor: R$ {displayValue(formatCurrency(nr_valor))}</p>
      </div>
      <div className="flex items-center mt-2">
        {statusIcons[ie_status] || <FiAlertCircle className="text-gray-400" title="Status desconhecido" />}
        <p className="text-sm ml-2 text-gray-600 truncate">Situação: {ie_status}</p>
      </div>
    </div>
  );
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'dd/MM/yyyy');
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

function formatDocument(documento: string): string {
  if (documento.length === 14) {
    return formatCnpj(documento);
  } else if (documento.length === 11) { 
    return formatCpf(documento);
  } else {
    return documento;
  }
}

export default Card;
